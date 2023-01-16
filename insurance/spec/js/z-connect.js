// @provengo summon constraints

/**
 * In this file, we listen to events generated by the combi-based case detail generation 
 * system (in case-gen.js), and restrict the high-level business flow accordingly.
 */

// Start the high-level flow AFTER the combi has finished.
bthread("gen->states", function(){
    waitFor( rec.doneEvent );
    highLevelFlow.doStart();
});

/**
 * * When a claimant needs to update her contact details, she must visit the contact details screen before 
 * visiting the main screen.
 * * When a does not claimant need to update her contact details, she must not visit the contact details screen.
 */
bthread("Contact details router", function(){
    var updateContactDetails = waitFor(isContactDetailsUpdateRequired.anySetEvent)
    if ( updateContactDetails.data.value === Combi.YES ) {
        // Can't get to the main screen before visiting the update details screen
        sync({
            block:   highLevelFlow.enters("mainScreen"),
            waitFor: highLevelFlow.enters("updateContactDetails")
        });
        
    } else {
        // Must go to the main screen first
        sync({
            block:   highLevelFlow.enters("updateContactDetails"),
            waitFor: highLevelFlow.enters("mainScreen")
        });
    }
});

// Event set containing all excluded topics.
const excludedTopicsEventSet = bp.EventSet("excludedTopics", function(e){
    return claimTopic.anySetEvent.contains(e) &&
    ( excludedTopics.indexOf(e.data.value) > -1 );
});
// Event set containing all covered topics.
const coveredTopicsEventSet = bp.EventSet("coveredTopics", function(e){
    return claimTopic.anySetEvent.contains(e) &&
    ( coveredTopics.indexOf(e.data.value) > -1 );
});

// After an excluded topic was selected, don't allow the user to get to the "choosePlaintiff" stage.
Constraints.unless(claimTopic.doneEvent)
            .after(excludedTopicsEventSet)
            .block(highLevelFlow.enters("choosePlaintiffStage")).forever();

// After a covered topic was selected, don't allow the user to get to the "manualClaimProcess" stage.
Constraints.unless(claimTopic.doneEvent)
            .after(coveredTopicsEventSet)
            .block(highLevelFlow.enters("manualClaimProcess")).forever();


// @provengo summon constraints

const flow = new StateMachine("customer");

// Standard "Happy" Flow
flow.connect("visit")
    .to("beginTrial")
    .to("endTrial")
    .to("join")
    .to("medium plan");

// Customer cases
flow.connect("join").to("mini plan");
flow.connect("join").to("premium plan");
// "see Jira #3445"
flow.connect("premium plan").to("support").to("premium plan");

// Onboard fail
flow.connect("endTrial").to("leave");

// Marketing failure
flow.connect("visit").to("leave");

// A trial can't last forever
Constraints.after(flow.enters("beginTrial"))
           .require( flow.enters("join").or( flow.enters("leave")) )
           .eventually();

// More trial time
flow.connect("endTrial").to("30-more").to("beginTrial");

// Constraints.limit( flow.enters("30-more"), 3 ).forever();

// flow.whileAt("visit", function(){
//     let visitor = choose("Assaf","Lior");
//     let repeatCount = (visitor=="Assaf" ? 3 : 2);
//     Constraints.limit( flow.enters("30-more"), repeatCount ).forever();
// });

bthread("stopper", function(){
    waitFor(flow.enters("join"));
    sync({
        request: flow.doneEvent,
        block: flow.anyStateChange
    });
});
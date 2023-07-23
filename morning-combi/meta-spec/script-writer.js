/**
 * Generate Python scripts from the test model - this is a Javascript file 
 * that creates Python programs.
 *
 * @param {Array<Event>} run A test run, described using n array of events
 * @param {ScriptBuilder} scriptFile A builder for the script file
 */
 function generateScript(run, scriptFile) {
    scriptFile.prepend("# Auto-generated python script");
    scriptFile.append(`# script number ${scriptFile.scriptNumber}`);
    scriptFile.include("config/performAction.py");

    run.forEach(evt => {
        if ( (!!evt.data) && evt.data.lib==="ACTION" ) {
           scriptFile.append(`performAction("${evt.data.type}", "${evt.data.name}")`);
        } else {
            scriptFile.append(`# ${evt.name}`);
        }
    });

    scriptFile.append("");
    scriptFile.append(`print("Script ${scriptFile.scriptNumber} done.")`);

}

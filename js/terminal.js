const terminalOutput = document.getElementById("terminalOutput");
const commandInput = document.getElementById("commandInput");

function addLine(text = "", className = ""){

    const line = document.createElement("div");

    line.className = "line " + className;

    line.textContent = text;

    terminalOutput.appendChild(line);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;

}

function initializeTerminal(){

    terminalOutput.innerHTML = "";

    addLine("Connecting to Hackcrow Network...");
    addLine("Authentication Successful");
    addLine("");
    addLine("Type HELP to begin.");

    commandInput.value = "";
    commandInput.focus();

}

commandInput.addEventListener("keydown", function(e){

    if(e.key !== "Enter") return;

    const command = commandInput.value.trim();

    addLine("> " + command);

    commandInput.value = "";

    terminalOutput.scrollTop = terminalOutput.scrollHeight;

});

const terminalOutput = document.getElementById("terminalOutput");

function printLine(text = "", className = "") {

    const line = document.createElement("div");

    line.className = "line " + className;

    line.textContent = text;

    terminalOutput.appendChild(line);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;

}

function printLines(lines) {

    lines.forEach(line => printLine(line));

}

function createPrompt() {

    const row = document.createElement("div");
    row.className = "terminal-row";

    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = ">";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";

    input.autocomplete = "off";
    input.autocorrect = "off";
    input.autocapitalize = "off";
    input.spellcheck = false;

    row.appendChild(prompt);
    row.appendChild(input);

    terminalOutput.appendChild(row);

    input.focus();

    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    input.addEventListener("keydown", function(e){

        if(e.key !== "Enter") return;

        const command = input.value.trim();

        input.disabled = true;

        executeCommand(command);

    });

}

function executeCommand(command){

    const cmd = command.toLowerCase();

    if(commands[cmd]){

        printLines(commands[cmd]());

    }else{

        printLine("");
        printLine("Unknown command: " + command);
        printLine("Type HELP to see available commands.");

    }

    printLine("");

    createPrompt();

}

function initializeTerminal(){

    terminalOutput.innerHTML = "";

    printLine("Hackcrow OS v3.0");
    printLine("----------------------------------------");
    printLine("Connecting to Hackcrow Network...");
    printLine("Authentication Successful");
    printLine("");
    printLine("Type HELP to begin.");
    printLine("");

    createPrompt();

}

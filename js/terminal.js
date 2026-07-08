const terminalOutput = document.getElementById("terminalOutput");

function printLine(text = "") {

    const line = document.createElement("div");
    line.className = "line";
    line.textContent = text;

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

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

}

function initializeTerminal() {

    terminalOutput.innerHTML = "";

    printLine("Connecting to Hackcrow Network...");
    printLine("Authentication Successful");
    printLine("");
    printLine("Type HELP to begin.");
    printLine("");

    createPrompt();

}

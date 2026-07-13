const terminalOutput = document.getElementById("terminalOutput");

function printLine(text = "", className = "") {

    const line = document.createElement("div");

    line.className = "line " + className;

    line.textContent = text;

    terminalOutput.appendChild(line);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;

}//printLine

function printLines(lines) {

    lines.forEach(line => printLine(line));

}//printLines

function createPrompt() {

    const row = document.createElement("div");
    row.className = "terminal-row";

    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "hackcrow:~$ ";

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
        if(e.key === "Tab"){

            e.preventDefault();
        
            input.value = autocompleteCommand(input.value);
        
            return;
        
        }
        
        if(e.key === "ArrowUp"){

            e.preventDefault();
        
            input.value = previousHistory();
        
            return;
        
        }
        
        if(e.key === "ArrowDown"){
        
            e.preventDefault();
        
            input.value = nextHistory();
        
            return;
        
        }

        if(e.key !== "Enter") return;

        const command = input.value.trim();

        addToHistory(command);

        input.disabled = true;

        executeCommand(command);

    });

}//createPrompt

function executeCommand(command){

    const parts = command.trim().split(" ");

    const cmd = parts.shift().toLowerCase();
    
    const args = parts.join(" ");

    const commandObject = commands.find(c =>
        c.name === cmd ||
        (c.aliases && c.aliases.includes(cmd))
    );

    if(commandObject){

        const result = commandObject.execute(args);

        if(result){

            printLines(result);
            printLine("");
            createPrompt();

        }

        return;

    }

    printLine("");
    printLine("Unknown command: " + command);
    printLine("Type HELP to see available commands.");
    printLine("");

    createPrompt();

}//executeCommand

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

}//initializeTerminal

document.getElementById("terminal").addEventListener("click", () => {

    const input = document.querySelector(".terminal-input");

    if(input){

        input.focus();

    }

});

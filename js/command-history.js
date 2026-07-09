const commandHistory = [];

let historyIndex = -1;

function addToHistory(command){

    if(!command) return;

    if(commandHistory[commandHistory.length - 1] !== command){

        commandHistory.push(command);

    }

    historyIndex = commandHistory.length;

}//addToHistory

function previousHistory(){

    if(historyIndex <= 0) return "";

    historyIndex--;

    return commandHistory[historyIndex];

}//previousHistory

function nextHistory(){

    if(historyIndex >= commandHistory.length - 1){

        historyIndex = commandHistory.length;

        return "";

    }

    historyIndex++;

    return commandHistory[historyIndex];

}//nextHistory

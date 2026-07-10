function openWords(){

    terminalOutput.innerHTML = "";

    const lines = [

        "Launching 5 Daily Words...",
        "Loading dictionary...",
        "Synchronizing database...",
        "",
        "Done.",
        "",
        "Opening application..."

    ];

    let i = 0;

    const interval = setInterval(() => {

        printLine(lines[i]);

        i++;

        if(i >= lines.length){

            clearInterval(interval);

            setTimeout(() => {

                window.location.href = "words/index.html";

            }, 500);

        }

    }, 250);

}

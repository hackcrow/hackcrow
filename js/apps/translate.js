function openTranslator(){

    terminalOutput.innerHTML = "";

    const lines = [

        "Launching Aurebesh Translator...",
        "Loading Galactic Dictionary...",
        "Initializing translator...",
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

                window.location.href = "aurebesh/index.html";

            }, 500);

        }

    }, 250);

}

function openTools(){

    terminalOutput.innerHTML = "";

    const lines = [

        "Launching Tools...",
        "Loading utilities...",
        "Initializing modules...",
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

                window.location.href = "tools/index.html";

            }, 500);

        }

    }, 250);

}

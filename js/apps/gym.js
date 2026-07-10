function openHackGym(){

    terminalOutput.innerHTML = "";

    const lines = [

        "Launching HackGym...",
        "Loading workout database...",
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

                window.location.href = "workout/index.html";

            }, 500);

        }

    }, 250);

}

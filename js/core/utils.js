function launchApplication(options){

    const {

        name,
        messages,
        url,
        delay = 250

    } = options;

    terminalOutput.innerHTML = "";

    const lines = [

        `Launching ${name}...`,
        ...messages,
        "",
        "Done.",
        "",
        "Opening application..."

    ];

    let index = 0;

    const interval = setInterval(() => {

        printLine(lines[index]);

        index++;

        if(index >= lines.length){

            clearInterval(interval);

            setTimeout(() => {

                window.location.href = url;

            }, 500);

        }

    }, delay);

}

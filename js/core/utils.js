async function launchApplication(options){

    const {

        name,
        messages,
        url,
        delay = 20

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

    await typeLines(lines, delay);

    setTimeout(() => {

        window.location.href = url;

    },500);

}

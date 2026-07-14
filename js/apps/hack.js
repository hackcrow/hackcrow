async function runHack(){

    terminalOutput.innerHTML = "";

    const lines = [

        "Initializing exploit engine...",
        "Scanning target...",
        "Bypassing firewall...",
        "Escalating privileges...",
        "Decrypting secure channels...",
        "Injecting payload...",
        "Cleaning traces...",
        "",
        "ACCESS GRANTED",
        "",
        "...just kidding 😄"

    ];

    await typeLines(lines, 18);

    await new Promise(r => setTimeout(r, 1000));

    createPrompt();

}

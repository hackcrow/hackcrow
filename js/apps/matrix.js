async function runMatrix(){

    if(matrixMode) return;

    terminalOutput.innerHTML = "";

    await typeLine("Entering Matrix...", 20);

    await new Promise(r => setTimeout(r, 500));

    await typeLine("", 1);
    await typeLine("Connecting to Zion...", 15);

    const steps = [
        "██░░░░░░░░░░░░░░░░░ 10%",
        "█████░░░░░░░░░░░░░ 25%",
        "████████░░░░░░░░░░ 40%",
        "████████████░░░░░░ 60%",
        "███████████████░░░ 85%",
        "██████████████████ 100%"
    ];

    for(const step of steps){

        await typeLine(step, 8);

        await new Promise(r => setTimeout(r, 180));

    }

    await typeLine("", 1);
    await typeLine("Connection Established.", 18);

    await new Promise(r => setTimeout(r, 600));

    await corruptTerminal();

    terminal.classList.add("glitch");

    await new Promise(r => setTimeout(r, 500));

    matrixMode = true;

    stopDigitalRain();
    startDigitalRain();

    terminal.style.visibility = "hidden";

    await new Promise(r => setTimeout(r, 10000));

    terminal.style.visibility = "visible";

    terminal.classList.remove("glitch");

    matrixMode = false;

    stopDigitalRain();
    startDigitalRain();

    terminalOutput.innerHTML = "";

    await typeLine("Disconnecting from Matrix...", 18);

    await new Promise(r => setTimeout(r, 400));

    await typeLine("Restoring Hackcrow OS...", 18);

    await new Promise(r => setTimeout(r, 500));

    await corruptTerminal();

    terminal.classList.add("glitch");

    await new Promise(r => setTimeout(r, 350));

    terminal.classList.remove("glitch");

    terminalOutput.innerHTML = "";

    await typeLine("Hackcrow OS Restored.", 18);

    await typeLine("", 1);

    createPrompt();

}//runMatrix

async function corruptTerminal(){

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@アイウエオカキクケコサシスセソタチツテト日月火水木金土";

    terminalOutput.innerHTML = "";

    for(let i = 0; i < 18; i++){

        let line = "";

        for(let j = 0; j < 70; j++){

            line += chars[Math.floor(Math.random() * chars.length)];

        }

        printLine(line);

    }

    await new Promise(r => setTimeout(r,250));

}//corruptTerminal

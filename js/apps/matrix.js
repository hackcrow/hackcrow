async function runMatrix(){

    if(matrixMode) return;

    matrixMode = true;

    stopDigitalRain();

    startDigitalRain();

    terminal.style.visibility = "hidden";

    await new Promise(r => setTimeout(r,10000));

    terminal.style.visibility = "visible";

    matrixMode = false;

    stopDigitalRain();

    startDigitalRain();

    createPrompt();

}//runMatrix

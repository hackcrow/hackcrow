function initializeTerminal() {

    const output = document.getElementById("terminalOutput");

    output.innerHTML = `
        <div class="line">Connecting to Hackcrow Network...</div>
        <div class="line">Authentication Successful</div>
        <div class="line"></div>
        <div class="line">Type <span class="highlight">HELP</span> to begin.</div>
    `;

    document.getElementById("commandInput").focus();

}

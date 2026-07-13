const bar = document.getElementById("bar");
const percent = document.getElementById("percent");
const logs = document.getElementById("logs");
const loader = document.getElementById("loader");
const main = document.getElementById("mainContent");
const secretMenu = document.getElementById("secretMenu");

const fakeLogs = [
    "[00:00:01] Loading kernel modules... OK",
    "[00:00:02] Establishing secure connection... OK",
    "[00:00:03] Bypassing firewall... OK",
    "[00:00:04] Encrypting payload... OK",
    "[00:00:05] Injecting exploit vector... OK",
    "[00:00:06] Accessing secure nodes... OK",
    "[00:00:07] Elevating privileges... OK",
    "[00:00:08] Cleaning traces... OK",
    "[00:00:09] Access granted."
];

let progress = 0;
let logIndex = 0;

/* ==========================================
   LOADER
========================================== */

const interval = setInterval(() => {

    progress += 2;

    if (progress > 100) progress = 100;

    bar.style.width = progress + "%";
    percent.textContent = progress + "%";

    if (progress % 10 === 0 && logIndex < fakeLogs.length) {

        const log = document.createElement("div");
        log.className = "log";
        log.textContent = fakeLogs[logIndex];

        logs.appendChild(log);
        logs.scrollTop = logs.scrollHeight;

        logIndex++;
    }

    if (progress >= 100) {

        clearInterval(interval);

        setTimeout(() => {

                loader.style.display = "none";
                main.classList.add("show");
            
                initializeTerminal();
            
                startDigitalRain();
            
            },350);

        }, 120);

    }

}, 16);

/* ==========================================
   MENU
========================================== */

function toggleMenu() {

    const opening = !secretMenu.classList.contains("showMenu");

    secretMenu.classList.toggle("showMenu");

    if (opening) {

        // Reinicia la animación
        secretMenu.classList.remove("boot");

        void secretMenu.offsetWidth;

        secretMenu.classList.add("boot");

        // Elimina la clase al terminar
        setTimeout(() => {

            secretMenu.classList.remove("boot");

        }, 700);

    }

}

/* ==========================================
   PC (HK)
========================================== */

let typed = "";

document.addEventListener("keydown", (e) => {

    typed += e.key.toLowerCase();
    typed = typed.slice(-2);

    if (typed === "hk") {

        toggleMenu();
        typed = "";

    }

});

/* ==========================================
   MOBILE (DOUBLE TAP)
========================================== */

let lastTap = 0;

document.addEventListener("touchend", () => {

    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {

        toggleMenu();

    }

    lastTap = currentTime;

});

/* ==================================================
   LOADER
================================================== */

const bar = document.getElementById("bar");
const percent = document.getElementById("percent");
const logs = document.getElementById("logs");

const loader = document.getElementById("loader");
const main = document.getElementById("mainContent");

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

const interval = setInterval(() => {

    progress += 2;

    if(progress > 100){
        progress = 100;
    }

    bar.style.width = progress + "%";
    percent.innerText = progress + "%";

    if(progress % 10 === 0 && logIndex < fakeLogs.length){

        const log = document.createElement("div");
        log.classList.add("log");
        log.innerText = fakeLogs[logIndex];

        logs.appendChild(log);
        logs.scrollTop = logs.scrollHeight;

        logIndex++;
    }

    if(progress >= 100){

        clearInterval(interval);

        setTimeout(() => {

            loader.style.transition = "opacity .35s ease";
            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";
                main.classList.add("show");

            },350);

        },120);

    }

},16);

/* ==================================================
   SECRET MENU
================================================== */

const secretMenu = document.getElementById("secretMenu");

/* PC = HK */

let typed = "";

document.addEventListener("keydown", (e) => {

    typed += e.key.toLowerCase();
    typed = typed.slice(-2);

    if(typed === "hk"){

        secretMenu.classList.toggle("showMenu");
        typed = "";

    }

});

/* MOBILE = DOUBLE TAP */

let lastTap = 0;

document.addEventListener("touchend", function(){

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if(tapLength < 300 && tapLength > 0){

        secretMenu.classList.toggle("showMenu");

    }

    lastTap = currentTime;

});

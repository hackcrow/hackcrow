let rainInterval = null;

function startDigitalRain(){

    if(rainInterval) return;

    rainInterval = setInterval(() => {

        if(Math.random() < 0.35){

            createRainColumn();

        }

    }, 350);

}

function stopDigitalRain(){

    clearInterval(rainInterval);

    rainInterval = null;

}

function createRainColumn(){

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@<>";

    const column = document.createElement("div");

    column.className = "digital-rain";

    column.style.left = Math.random() * window.innerWidth + "px";

    column.style.animationDuration = (1 + Math.random()) + "s";

    let text = "";

    const length = 6 + Math.floor(Math.random() * 10);

    for(let i=0;i<length;i++){

        text += chars[Math.floor(Math.random()*chars.length)] + "<br>";

    }

    column.innerHTML = text;

    document.body.appendChild(column);

    setTimeout(()=>{

        column.remove();

    },2200);

}

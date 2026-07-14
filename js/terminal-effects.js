let rainInterval = null;

const RAIN_CONFIG = {

    desktop: {

        probability: 0.80,
        interval: 180,
        columnsPerTick: 3,
        spacing: 12,
        minLength: 15,
        maxLength: 30,
        minDuration: 1.5,
        maxDuration: 2.5

    },

    mobile: {

        probability: 0.20,
        interval: 350,
        columnsPerTick: 1,
        spacing: 18,
        minLength: 8,
        maxLength: 16,
        minDuration: 3.5,
        maxDuration: 4.5

    }

};

function getRainConfig(){

    return window.innerWidth < 768
        ? RAIN_CONFIG.mobile
        : RAIN_CONFIG.desktop;

}//getRainConfig

function startDigitalRain(){

    if(rainInterval) return;

    rainInterval = setInterval(() => {

       const isMobile = window.innerWidth < 768;

            rainInterval = setInterval(() => {
            
                if(Math.random() < (isMobile ? 0.20 : 0.80)){
            
                    const amount = isMobile
                        ? 1
                        : 1 + Math.floor(Math.random() * 3);
            
                    for(let i = 0; i < amount; i++){
            
                        createRainColumn();
            
                    }
            
                }
            
            }, isMobile ? 350 : 180);

}

function stopDigitalRain(){

    clearInterval(rainInterval);

    rainInterval = null;

}

function createRainColumn(){

    const glyphSets = [

        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
        "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
        "日月火水木金土空山川天風雨龍虎心光夢星",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "0123456789",
        "#$%&@<>*+=-"

    ];

    const colors = [

        "#00ff88",
        "#00ff66",
        "#33ff99",
        "#66ffaa",
        "#55ff88"

    ];

    const isMobile = window.innerWidth < 768;

    const column = document.createElement("div");

    column.className = "digital-rain";

    column.style.color = colors[Math.floor(Math.random() * colors.length)];

    const spacing = isMobile ? 18 : 12;

    const columns = Math.floor(window.innerWidth / spacing);

    const columnIndex = Math.floor(Math.random() * columns);

    column.style.left = (columnIndex * spacing) + "px";

    column.style.animationDuration =
        (isMobile ? 3.5 : 1.5) + Math.random() + "s";

    const length = isMobile
        ? 8 + Math.floor(Math.random() * 8)
        : 15 + Math.floor(Math.random() * 15);

    let text = "";

    for(let i = 0; i < length; i++){

        const set = glyphSets[Math.floor(Math.random() * glyphSets.length)];

        text += set[Math.floor(Math.random() * set.length)] + "<br>";

    }

    column.innerHTML = text;

    document.body.appendChild(column);

    setTimeout(() => {

        column.remove();

    },2200);

}//createRainColumn



    



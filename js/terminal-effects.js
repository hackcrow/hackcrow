let rainInterval = null;
let matrixMode = false;

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

};//RAIN_CONFIG

const MATRIX_CONFIG = {

    desktop:{

        spawnMin:40,
        spawnMax:80,
        lengthMin:18,
        lengthMax:38,
        durationMin:2,
        durationMax:4

    },

    mobile:{

        spawnMin:80,
        spawnMax:150,
        lengthMin:16,
        lengthMax:30,
        durationMin:2.5,
        durationMax:4.5

    }

};//MATRIX_CONFIG

const NORMAL_GLYPHS = [

        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
        "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
        "日月火水木金土空山川天風雨龍虎心光夢星",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "0123456789",
        "#$%&@<>*+=-"
    
    ];
    
    const MATRIX_GLYPHS = [
    
        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
        "日月火水木金土空山川天風雨龍虎心光夢星",
        "漢字無限電脳情報仮想世界精神機械生命"
    
    ];

}//getRainConfig

function startDigitalRain(){

    if(rainInterval) return;

    const config = getRainConfig();

    rainInterval = setInterval(() => {

        if(Math.random() < config.probability){

            const amount = 1 + Math.floor(Math.random() * config.columnsPerTick);

            for(let i = 0; i < amount; i++){

                createRainColumn();

            }

        }

    }, config.interval);

}

function stopDigitalRain(){

    clearInterval(rainInterval);

    rainInterval = null;

}//startDigitalRain

function createRainColumn(){

    const config = getRainConfig();

    const colors = [

        "#00ff88",
        "#00ff66",
        "#33ff99",
        "#66ffaa",
        "#55ff88"

    ];

    const column = document.createElement("div");

    if(matrixMode){

        column.classList.add("matrix-column");
    
    }

    column.className = "digital-rain";

    column.style.color = colors[Math.floor(Math.random() * colors.length)];

    const columns = Math.floor(window.innerWidth / config.spacing);

    const columnIndex = Math.floor(Math.random() * columns);

    column.style.left = (columnIndex * config.spacing) + "px";

    column.style.animationDuration =
        (
            config.minDuration +
            Math.random() * (config.maxDuration - config.minDuration)
        ) + "s";

    const length =
        config.minLength +
        Math.floor(
            Math.random() *
            (config.maxLength - config.minLength + 1)
        );

    let text = "";

    for(let i = 0; i < length; i++){
        const glyphSets = matrixMode
            ? MATRIX_GLYPHS
            : NORMAL_GLYPHS;
        
        const set = glyphSets[Math.floor(Math.random() * glyphSets.length)];

        text += set[Math.floor(Math.random() * set.length)] + "<br>";

    }

    column.innerHTML = text;

    document.body.appendChild(column);

    setTimeout(() => {

        column.remove();

    }, 5000);

}//createRainColumn

function toggleDigitalRain(){

    if(rainEnabled){

        stopDigitalRain();

        rainEnabled = false;

        return "Digital Rain Disabled.";

    }

    startDigitalRain();

    rainEnabled = true;

    return "Digital Rain Enabled.";

}//toggleDigitalRain

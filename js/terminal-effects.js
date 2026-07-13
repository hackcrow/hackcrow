let rainInterval = null;

function startDigitalRain(){

    if(rainInterval) return;

    rainInterval = setInterval(() => {

        if(Math.random() < 0.80){

            const amount = 1 + Math.floor(Math.random() * 3);

                let text = "";

                const length = 15 + Math.floor(Math.random() * 15);
                
                for(let i = 0; i < length; i++){
                
                    const set = glyphSets[Math.floor(Math.random() * glyphSets.length)];
                
                    text += set[Math.floor(Math.random() * set.length)] + "<br>";
                
                }

        }

    }, 350);

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
    
    ];const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@<>";

    const column = document.createElement("div");

    const colors = [

        "#00ff88",
        "#00ff66",
        "#33ff99",
        "#66ffaa",
        "#55ff88"
    
    ];
    
    column.style.color = colors[Math.floor(Math.random() * colors.length)];

    column.className = "digital-rain";

    column.style.left = Math.random() * window.innerWidth + "px";

    column.style.animationDuration = (1 + Math.random()) + "s";

    let text = "";

    const length = 15 + Math.floor(Math.random() * 15);

    for(let i=0;i<length;i++){

        text += chars[Math.floor(Math.random()*chars.length)] + "<br>";

    }

    column.innerHTML = text;

    document.body.appendChild(column);

    setTimeout(()=>{

        column.remove();

    },2200);

}

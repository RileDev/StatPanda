const infoWrapper = document.getElementById("infoShow");

export function displayInfo(data){
    if(data === null){
        hideInfo()
        return;
    }
    showInfo();

    const n = data["dataset"].n;
    const k = data["dataset"].k;
    const i = data["dataset"].i;
    const arithmeticMean = data["dataset"].arithmeticMean || null;
    const geometricMean = data["dataset"].geometricMean || null;
    const harmonicMean = data["dataset"].harmonicMean || null;
    const median = data["dataset"].median || null;
    const mode = data["dataset"].mode || null;
    const quartiles = data["dataset"].quartiles || null;


    try{
        infoWrapper.innerHTML = 
            `
                <p>N: ${n}</p>
                <p>k: ${k}</p>
                <p>i: ${i}<p>
                ${arithmeticMean ? `<p><strong>Arithmetic Mean: ${arithmeticMean.toFixed(2)}</strong></p>` : ""}
                ${geometricMean ? `<p>Geometric Mean: ${geometricMean.toFixed(2)}</p>` : ""}
                ${harmonicMean ? `<p>Harmonic Mean: ${harmonicMean.toFixed(2)}</p>` : ""}
                ${median ? `<p><strong>Median: ${median.toFixed(2)}</strong></p>` : ""}
                ${mode ? `<p>Mode: ${mode.toFixed(2)}</p>` : ""}
                ${quartiles ? `<p><strong>Quartiles: </strong></p>` : ""}
                ${quartiles ? `<p>Q1: ${quartiles.Q1.toFixed(2)}</p>` : ""}
                ${quartiles ? `<p>Q2: ${quartiles.Q2.toFixed(2)}</p>` : ""}
                ${quartiles ? `<p>Q3: ${quartiles.Q3.toFixed(2)}</p>` : ""}
            <hr>
            `;
    }catch(e){}
    
}

const showInfo = () => infoWrapper.classList.add("display");

const hideInfo = () => {
    infoWrapper.innerHTML = "";
    if(infoWrapper.classList.contains("display"))
        infoWrapper.classList.remove("display");
}
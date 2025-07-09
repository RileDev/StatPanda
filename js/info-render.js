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
    const range = data["dataset"].range || null;
    const meanAbsoluteDeviation = data["dataset"].meanAbsoluteDeviation || null;
    const variance = data["dataset"].variance || null;
    const standardDeviation = data["dataset"].standardDeviation || null;
    const coefficientOfVariation = data["dataset"].coefficientOfVariation || null;
    const skewness = data["dataset"].skewness || null;
    const kurtosis = data["dataset"].kurtosis || null;

    try{
        infoWrapper.innerHTML = 
            `
                <p>N: ${n}</p>
                <p>k: ${k}</p>
                <p>i: ${i}<p>
                ${arithmeticMean ? `<p>Arithmetic Mean: ${arithmeticMean.toFixed(2)}</p>` : ""}
                ${geometricMean ? `<p>Geometric Mean: ${geometricMean.toFixed(2)}</p>` : ""}
                ${harmonicMean ? `<p>Harmonic Mean: ${harmonicMean.toFixed(2)}</p>` : ""}
                ${median ? `<p>Median: ${median.toFixed(2)}</p>` : ""}
                ${mode ? `<p>Mode: ${mode.toFixed(2)}</p>` : ""}
                ${quartiles ? `<hr><p><strong>Quartiles: </strong></p>` : ""}
                ${quartiles ? `<p>Q1: ${quartiles.Q1.toFixed(2)}</p>` : ""}
                ${quartiles ? `<p>Q2: ${quartiles.Q2.toFixed(2)}</p>` : ""}
                ${quartiles ? `<p>Q3: ${quartiles.Q3.toFixed(2)}</p>` : ""}
                ${range ? `<hr><p>Range: ${range}</p>` : ""}
                ${meanAbsoluteDeviation ? `<p>Mean Absolute Deviation: ${meanAbsoluteDeviation.toFixed(3)}</p>` : ""}
                ${variance ? `<p>Variance (𝜎2): ${variance.toFixed(2)}</p>` : ""}
                ${standardDeviation ? `<p>Standard Deviation (𝜎): ${standardDeviation.toFixed(2)}</p>` : ""}
                ${coefficientOfVariation ? `<p>Coefficient of Variation: ${coefficientOfVariation.toFixed(2)}</p>` : ""}
                ${skewness ? `<p>Skewness (α3): ${skewness.toFixed(2)}</p>` : ""}
                ${kurtosis ? `<p>Kurtosis (α4): ${kurtosis.toFixed(2)}</p>` : ""}
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
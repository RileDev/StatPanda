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

    infoWrapper.innerHTML = 
    `
        <p>N: ${n}</p>
        <p>k: ${k}</p>
        <p>i: ${i}<p>
        ${arithmeticMean ? `<p>Arithmetic Mean: ${arithmeticMean.toFixed(2)}<p>` : ""}
        ${geometricMean ? `<p>Geometric Mean: ${geometricMean.toFixed(2)}<p>` : ""}
    <hr>
    `;
}

const showInfo = () => infoWrapper.classList.add("display");

const hideInfo = () => {
    infoWrapper.innerHTML = "";
    if(infoWrapper.classList.contains("display"))
        infoWrapper.classList.remove("display");
}
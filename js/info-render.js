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

    infoWrapper.innerHTML = 
    `
        <p>N: ${n}</p>
        <p>k: ${k}</p>
        <p>i: ${i}<p>
    <hr>
    `;
}

const showInfo = () => infoWrapper.classList.add("display");

const hideInfo = () => {
    infoWrapper.innerHTML = "";
    if(infoWrapper.classList.contains("display"))
        infoWrapper.classList.remove("display");
}
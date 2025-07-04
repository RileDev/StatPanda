const inputsWrapper = document.querySelector(".input-samples");

export function generateSampleFields(n){
    inputsWrapper.innerHTML = "";
    for(let i = 0; i < n; i++){
        const inputEl = document.createElement("input");
        inputEl.setAttribute("type", "number");
        inputEl.classList.add(`form-control`);
        inputEl.classList.add(`sample`);
        inputEl.classList.add(`sample-${i}`);
        inputEl.style.width = "100px";
        inputEl.style.maxWidth = "100px";
        inputsWrapper.appendChild(inputEl);
    }
}

export function fetchData(){
    let data = [];
    const samplesDataInput = document.querySelectorAll(".sample"); 
    for (const element of samplesDataInput) {
        if(element.value)
            data.push(parseInt(element.value));
        else
            data.push(0);
    }
    return data;
}

export function clearSampleFields() {
    inputsWrapper.innerHTML = "";
}
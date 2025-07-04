const inputsWrapper = document.querySelector(".input-samples");

export function generateSampleFields(n){
    inputsWrapper.innerHTML = "";
    for(let i = 0; i < n; i++){
        const inputEl = document.createElement("input");
        inputEl.setAttribute("type", "number");
        inputEl.classList.add("form-control");
        inputEl.style.width = "100px";
        inputsWrapper.appendChild(inputEl);
    }
}
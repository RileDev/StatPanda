const LIMIT = 500;
const inputsWrapper = document.querySelector(".input-samples");

let canInputFieldsBeRendered = true;
let uploadedData = [];

export function generateSampleFields(n) {
    if (n > LIMIT) {
        alert(`You cannot generate more fields than the limit (${LIMIT}). Try uploading a file instead.`);
        return;
    }
    canInputFieldsBeRendered = true;
    inputsWrapper.innerHTML = "";
    for (let i = 0; i < n; i++) {
        const inputEl = document.createElement("input");
        inputEl.type = "number";
        inputEl.className = `form-control sample sample-${i}`;
        inputEl.style.width = "100px";
        inputEl.style.maxWidth = "100px";
        inputsWrapper.appendChild(inputEl);
    }
}

export function fetchData() {
    if (!canInputFieldsBeRendered && uploadedData.length > 0) 
        return uploadedData;
    const samplesDataInput = document.querySelectorAll(".sample");
    const values = [];
    for (const element of samplesDataInput) {
        values.push(element.value ? parseInt(element.value) : 0);
    }
    return values;
}

export function clearSampleFields() {
    inputsWrapper.innerHTML = "";
    canInputFieldsBeRendered = true;
}

export function displayUploadedSamples(arr) {
    uploadedData = [];
    if (arr.length > LIMIT) {
        canInputFieldsBeRendered = false;
        uploadedData = arr;
        inputsWrapper.innerHTML = `
            <p>
                <strong>Your data file was successfully uploaded!</strong><br>
                Because your dataset contains more than 500 values, input fields were not generated.<br>
                Click "Generate" to view statistics and charts based on your uploaded data.
            </p>
        `;
        return;
    }
    canInputFieldsBeRendered = true;
    inputsWrapper.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        const inputEl = document.createElement("input");
        inputEl.type = "number";
        inputEl.className = `form-control sample sample-${i}`;
        inputEl.style.width = "100px";
        inputEl.style.maxWidth = "100px";
        inputEl.value = arr[i];
        inputsWrapper.appendChild(inputEl);
    }
}
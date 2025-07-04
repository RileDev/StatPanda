import { FrequencyDistribution } from "./js/classes/frequency-distribution.js";
import { generateSampleFields, fetchData } from "./js/samples.js"
import { displayTable } from "./js/table-render.js";
import { readFromFile } from "./js/file-stream.js";


const addBtn = document.getElementById("addBtn");
const generateBtn = document.getElementById("generateBtn");
const fileInput = document.getElementById("fileInput");

const nSamples = document.getElementById("nSamples");
const intervalCb = document.getElementById("intervalCb");

const uploadedMessage = document.getElementById("uploaded-message");

let distribution = null;


addBtn.addEventListener("click", () => generateSampleFields(parseInt(nSamples.value, 10)));

fileInput.addEventListener("change", e => {
    readFromFile(e, intervalCb.checked);
    setTimeout(() => {fileInput.value = ""}, 500);
});

generateBtn.addEventListener("click", () => {
    const data = fetchData();
    uploadedMessage.textContent = "";
    
    distribution = new FrequencyDistribution(data, intervalCb.checked);    
    displayTable(distribution.json);

    
})

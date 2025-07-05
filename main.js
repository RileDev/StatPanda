import { FrequencyDistribution } from "./js/classes/frequency-distribution.js";
import { generateSampleFields, fetchData, clearSampleFields } from "./js/samples.js"
import { displayTable } from "./js/table-render.js";
import { clearUploadedMessage, readFromFile } from "./js/file-stream.js";
import { displayChart } from "./js/chart-render.js";
import { displayInfo } from "./js/info-render.js";
import { saveToPDF } from "./js/pdf-export.js";


const addBtn = document.getElementById("addBtn");
const generateBtn = document.getElementById("generateBtn");
const fileInput = document.getElementById("fileInput");
const clearBtn = document.getElementById("clearBtn");
const exportPDFBtn = document.getElementById("exportPDFBtn");

const nSamples = document.getElementById("nSamples");
const intervalCb = document.getElementById("intervalCb");

const uploadedMessage = document.getElementById("uploaded-message");

let distribution = null;
let chart = null;


addBtn.addEventListener("click", () => generateSampleFields(parseInt(nSamples.value, 10)));

fileInput.addEventListener("change", e => {
    readFromFile(e);
    setTimeout(() => {fileInput.value = ""}, 500);
});

generateBtn.addEventListener("click", () => {
    const data = fetchData();
    uploadedMessage.textContent = "";
    
    distribution = new FrequencyDistribution(data, intervalCb.checked);    
    displayInfo(distribution.json);
    displayTable(distribution.json);
    chart = displayChart(distribution.json);
})

clearBtn.addEventListener("click", () => {
    distribution = null;
    clearSampleFields();
    displayInfo(null);
    displayTable(null);
    displayChart(null);
    clearUploadedMessage();
})

exportPDFBtn.addEventListener("click", () => {
    saveToPDF(distribution, chart);
});
import { FrequencyDistribution } from "./js/classes/frequency-distribution.js";
import { generateSampleFields, fetchData } from "./js/samples.js"
import { displayTable } from "./js/table-render.js";

const addBtn = document.getElementById("addBtn");
const generateBtn = document.getElementById("generateBtn");
const nSamples = document.getElementById("nSamples");
const intervalCb = document.getElementById("intervalCb");

let distribution = null;

addBtn.addEventListener("click", () => {
    generateSampleFields(parseInt(nSamples.value, 10));
    nSamples.value = "";
})

generateBtn.addEventListener("click", () => {
    const data = [
        1, 10, 7, 16, 8, 4, 12, 5, 2, 2,
        5, 7, 9, 10, 13, 15, 18, 20, 1, 22,
        30, 35, 4, 8, 6, 3, 15, 17, 29, 36,
        3, 9, 15, 6, 7, 38, 13, 10, 12, 15,
        14, 18, 10, 5, 3, 2, 1, 21, 19, 11
    ];

    // distribution = new FrequencyDistribution(fetchData(), intervalCb.checked);
    distribution = new FrequencyDistribution(data, intervalCb.checked);
    displayTable(distribution.json);

    
})
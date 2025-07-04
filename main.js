import {generateSampleFields} from "./js/add-samples.js"

const addBtn = document.getElementById("addBtn");
const nSamples = document.getElementById("nSamples");

addBtn.addEventListener("click", () => {
    generateSampleFields(parseInt(nSamples.value, 10));
})
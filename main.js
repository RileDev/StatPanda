import { FrequencyDistribution } from "./js/classes/frequency-distribution.js";
import { generateSampleFields, fetchData, clearSampleFields } from "./js/samples.js"
import { displayTable } from "./js/table-render.js";
import { clearUploadedMessage, readFromFile } from "./js/file-stream.js";
import { displayBoxplot, displayChart, displayHistogram } from "./js/chart-render.js";
import { displayInfo } from "./js/info-render.js";
import { saveFreqDistToPDF, saveTendencyToPDF, saveVariationToPDF } from "./js/pdf-export.js";
import { Tendency } from "./js/classes/tendency.js";
import { Variation } from "./js/classes/variation.js";

const addBtn = document.getElementById("addBtn");
const generateBtn = document.getElementById("generateBtn");
const fileInput = document.getElementById("fileInput");
const clearBtn = document.getElementById("clearBtn");
const exportPDFBtn = document.getElementById("exportPDFBtn");
const showOptions = document.querySelectorAll(".show-option");

const nSamples = document.getElementById("nSamples");
const intervalCb = document.getElementById("intervalCb");

const uploadedMessage = document.getElementById("uploaded-message");

let statistics = null;
let histogram = null
let chart = null;


addBtn.addEventListener("click", () => generateSampleFields(parseInt(nSamples.value, 10)));

fileInput.addEventListener("change", e => {
    readFromFile(e);
    setTimeout(() => { fileInput.value = "" }, 500);
});

generateBtn.addEventListener("click", () => {
    const data = fetchData();
    const groupedData = intervalCb.checked;
    const statisticsType = generateBtn.dataset.type;

    switch (statisticsType) {
        case "freq-dist":
            statistics = new FrequencyDistribution(data, groupedData);
            displayInfo(statistics.json);
            displayTable(statistics.json);
            chart = displayChart(statistics.json);
            break;
        case "tendency":
            statistics = new Tendency(data, groupedData);
            displayInfo(statistics.json);
            if (showOptions[0].checked) //show dropdown -> table checkbox
                displayTable(statistics.json);
            else
                displayTable(null);
            if (showOptions[1].checked) //show dropdown -> boxplot checkbox
                chart = displayBoxplot(statistics.json, statisticsType);
            else {
                chart = null;
                displayBoxplot(null);
            }
            if (showOptions[2].checked) //show dropdown -> histogram checkbox
                histogram = displayHistogram(statistics.json, statisticsType)
            else{
                displayHistogram(null)
                histogram = null;
            }
            break;

        case "variation":
            statistics = new Variation(data, groupedData);
            displayInfo(statistics.json);
            if (showOptions[0].checked)
                displayTable(statistics.json);
            else
                displayTable(null);
            if (showOptions[1].checked)
                chart = displayBoxplot(statistics.json, statisticsType);
            else {
                chart = null;
                displayBoxplot(null);
            }
            if (showOptions[2].checked)
                histogram = displayHistogram(statistics.json, statisticsType)
            else{
                displayHistogram(null)
                histogram = null;
            }
            break;
            
    }

})

clearBtn.addEventListener("click", () => clearContents())

exportPDFBtn.addEventListener("click", () => {
    const statisticsType = generateBtn.dataset.type;
    let isTableShowChecked = null;
    switch(statisticsType){
        case "freq-dist":
            saveFreqDistToPDF(statistics, chart);
            break;
        case "tendency":
            isTableShowChecked = showOptions[0].checked;
            saveTendencyToPDF(statistics, chart, histogram, isTableShowChecked);
            break;
        case "variation":
            isTableShowChecked = showOptions[0].checked;
            saveVariationToPDF(statistics, chart, histogram, isTableShowChecked);
            break;
    }
});

const clearContents = () => {
    statistics = null;
    try {
        clearUploadedMessage();
        clearSampleFields();
        displayInfo(null);
        displayTable(null);
        displayChart(null);
        displayHistogram(null);
    } catch (e) { }

}
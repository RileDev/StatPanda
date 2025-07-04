import { displayUploadedSamples } from "./samples.js";

const uploadedMessage = document.getElementById("uploaded-message");

export function readFromFile(event, hasIntervals) {
    const file = event.target.files[0];
    
    if (!file) {
        alert("No file selected or there was an error with loading the file!");
        return;
    }

    const reader = new FileReader();

    reader.onload = e => {
        try {
            const text = e.target.result;
            const rawData = text
                .split(/[\s,]+/)
                .filter(s => s.length > 0)
                .map(Number)
                .filter(n => !isNaN(n));
            
            displayUploadedSamples(rawData);
            uploadedMessage.innerText = `File ${event.target.files[0].name} has been successfully loaded!`;

            if (rawData.length === 0) {
                alert("The file did not contain any valid numbers.");
                return;
            }
        } catch (error) {
            alert("Error processing file: " + error.message);
        }
    };

    reader.onerror = () => {
        alert("Error reading the file.");
    };

    reader.readAsText(file);
}

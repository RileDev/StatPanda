export function saveToPDF(data, chart){
    if(data === null || chart === null){
        alert("There's nothing generated to save as a PDF file :(");
        return;
    }

    const currentData = data.json;
    const n = currentData["dataset"].n;
    const k = currentData["dataset"].k;
    const i = currentData["dataset"].i;
    const hasIntervals = currentData["dataset"].hasIntervals;
    const frequencies = currentData["dataset"].frequencies;
    const cumulativeBelow = currentData["dataset"].cumulativeBelow;
    const cumulativeAbove = currentData["dataset"].cumulativeAbove;
    const relFreq = currentData["dataset"].relativeFrequencies;
    const cumulativeFreq = currentData["dataset"].cumulativeFrequencies;

    let tableData = [];

    if (hasIntervals) {
        tableData = frequencies.map((f, i) => [
            `${f.min} - ${f.max}`,
            f.frequency,
            cumulativeBelow[i],
            cumulativeAbove[i],
            relFreq[i].toFixed(2),
            cumulativeFreq[i].toFixed(2)
        ]);
    } else {
        const values = Object.keys(frequencies).sort((a, b) => Number(a) - Number(b));
        tableData = values.map((value, i) => [
            value,
            frequencies[value],
            cumulativeBelow[i],
            cumulativeAbove[i],
            relFreq[i].toFixed(2),
            cumulativeFreq[i].toFixed(2)
        ]);
    }
        
    const doc = new window.jspdf.jsPDF();

    doc.setFontSize(16);
    doc.text("Frequency Distribution Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`N: ${n}`, 14, 25);
    doc.text(`k: ${k}`, 40, 25);
    doc.text(`i: ${i}`, 66, 25);
    
    doc.autoTable({
        startY: 35,
        head: [['Items', 'Frequency', 'Cumulative Below', 'Cumulative Above', 'Relative Frequency (%)', 'Cumulative Frequency (%)']],
        body: tableData,
        theme: "striped",
        headStyles: {fillColor: [54, 162, 235]}
    });

    const chartImage = chart.toBase64Image();
    const chartWidth = 180;
    const chartHeight = 120;

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.addImage(chartImage, "PNG", 15, finalY, chartWidth, chartHeight);

    doc.save("frequency-distribution-report.pdf");

}
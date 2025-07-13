export function saveFreqDistToPDF(data, chart) {
    if (data === null || chart === null) {
        alert("There's nothing generated to save as a PDF file :(");
        return;
    }

    const yBase = 10;
    let currentY = yBase;

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
    currentY += 7;
    doc.text(`k: ${k}`, 40, 25);
    currentY += 7;
    doc.text(`i: ${i}`, 66, 25);

    doc.autoTable({
        startY: currentY + 8,
        head: [['Items', 'Frequency', 'Cumulative Below', 'Cumulative Above', 'Relative Frequency (%)', 'Cumulative Frequency (%)']],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [54, 162, 235] }
    });

    const chartImage = chart.toBase64Image();
    const chartWidth = 180;
    const chartHeight = 120;

    // const finalY = doc.lastAutoTable.finalY + 10;
    doc.addPage();
    doc.addImage(chartImage, "PNG", 15, 10, chartWidth, chartHeight);

    doc.save("frequency-distribution-report.pdf");

}

export function saveTendencyToPDF(data, chart, histogram, showTable = true) {
    if (!data) {
        alert("There's nothing generated to save as a PDF file :(");
        return;
    }

    const { dataset } = data.json;
    const {
        n, k, i, hasIntervals, frequencies,
        cumulativeBelow, arithmeticMean, geometricMean, harmonicMean,
        median, mode, quartiles
    } = dataset;

    let tableData = [];
    if (hasIntervals) {
        tableData = frequencies.map((f, idx) => [
            `${f.min} - ${f.max}`,
            f.frequency,
            cumulativeBelow[idx]
        ]);
    } else {
        const values = Object.keys(frequencies).sort((a, b) => Number(a) - Number(b));
        tableData = values.map((value, idx) => [
            value,
            frequencies[value],
            cumulativeBelow[idx]
        ]);
    }

    const doc = new window.jspdf.jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(16);
    doc.text("Measures of Central Tendency Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`N: ${n}`, 14, 25);
    doc.text(`k: ${k}`, 40, 25);
    doc.text(`i: ${i}`, 66, 25);

    const margin = 10;
    let currentY = 35;

    const addAndCheckPage = (heightNeeded = 0) => {
        if (currentY + heightNeeded + margin > pageHeight) {
            doc.addPage();
            currentY = margin;
        }
    };

    const lines = [
        `Arithmetic Mean: ${arithmeticMean.toFixed(2)}`,
        `Geometric Mean: ${geometricMean.toFixed(2)}`,
        `Harmonic Mean: ${harmonicMean.toFixed(2)}`,
        `Median: ${median.toFixed(2)}`,
        `Mode: ${mode.toFixed(2)}`,
        `Quartiles:`,
        `Q1: ${quartiles.Q1.toFixed(2)}`,
        `Q2: ${quartiles.Q2.toFixed(2)}`,
        `Q3: ${quartiles.Q3.toFixed(2)}`
    ];
    lines.forEach((line, idx) => {
        addAndCheckPage(7);
        doc.text(line, idx < 6 ? 14 : 22, currentY);
        currentY += 7;
    });

    if (showTable) {
        addAndCheckPage(40);
        doc.autoTable({
            startY: currentY + 3,
            head: [['Items', 'Frequency', 'Cumulative Below']],
            body: tableData,
            theme: "striped",
            headStyles: { fillColor: [54, 162, 235] }
        });
        currentY = doc.lastAutoTable.finalY + 7;
    }

    function addImageWithTitle(image, title) {
        const imageHeight = 120, imageWidth = 180, titleHeight = 8, padding = 3;
        addAndCheckPage(titleHeight + imageHeight + padding);
        doc.text(title, 14, currentY + titleHeight);
        currentY += titleHeight + padding;
        doc.addImage(image, "PNG", 15, currentY, imageWidth, imageHeight);
        currentY += imageHeight + 2 * padding;
    }

    if (chart) addImageWithTitle(chart.toBase64Image(), "Boxplot Visualization");
    if (histogram) addImageWithTitle(histogram.toBase64Image(), "Histogram Visualization");

    doc.save("central-tendency-report.pdf");
}


export function saveVariationToPDF(data, chart, histogram, showTable = true) {
    if (!data) {
        alert("There's nothing generated to save as a PDF file :(");
        return;
    }

    const { dataset } = data.json;
    const {
        n, k, i, hasIntervals, frequencies,
        midpointsOfIthClass, arithmeticMean, median, mode, quartiles,
        range, meanAbsoluteDeviation, variance, standardDeviation,
        coefficientOfVariation, skewness, kurtosis
    } = dataset;

    let tableData = [];
    if (hasIntervals) {
        tableData = frequencies.map((f, idx) => [
            `${f.min} - ${f.max}`,
            f.frequency,
            midpointsOfIthClass[idx]
        ]);
    } else {
        const values = Object.keys(frequencies).sort((a, b) => Number(a) - Number(b));
        tableData = values.map((value, idx) => [
            value,
            frequencies[value]
        ]);
    }

    const doc = new window.jspdf.jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(16);
    doc.text("Measures of Variation Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`N: ${n}`, 14, 25);
    doc.text(`k: ${k}`, 40, 25);
    doc.text(`i: ${i}`, 66, 25);

    const margin = 10;
    let currentY = 35;

    const addAndCheckPage = (heightNeeded = 0) => {
        if (currentY + heightNeeded + margin > pageHeight) {
            doc.addPage();
            currentY = margin;
        }
    };

    const lines = [
        `Arithmetic Mean: ${arithmeticMean.toFixed(2)}`,
        `Median: ${median.toFixed(2)}`,
        `Mode: ${mode.toFixed(2)}`,
        `Quartiles:`,
        `Q1: ${quartiles.Q1.toFixed(2)}`,
        `Q2: ${quartiles.Q2.toFixed(2)}`,
        `Q3: ${quartiles.Q3.toFixed(2)}`,
        `Range: ${range}`,
        `Mean Absolute Deviation: ${meanAbsoluteDeviation.toFixed(3)}`,
        `Variance (𝜎2): ${variance.toFixed(2)}`,
        `Standard Deviation (𝜎): ${standardDeviation.toFixed(2)}`,
        `Coefficient of Variation: ${coefficientOfVariation.toFixed(2)}`,
        `Skewness (α3): ${skewness.toFixed(2)}`,
        `Kurtosis (α4): ${kurtosis.toFixed(2)}`
    ];

    lines.forEach((line, idx) => {
        addAndCheckPage(7);
        doc.text(line, idx < 4 ? 14 : 22, currentY);
        currentY += 7;
    });

    if (showTable) {
        addAndCheckPage(40);
        doc.autoTable({
            startY: currentY + 3,
            head: hasIntervals ? [['Items', 'Frequency', 'Midpoint']] : [['Items', 'Frequency']],
            body: tableData,
            theme: "striped",
            headStyles: { fillColor: [54, 162, 235] }
        });
        currentY = doc.lastAutoTable.finalY + 7;
    }

    function addImageWithTitle(image, title) {
        const imageHeight = 120, imageWidth = 180, titleHeight = 8, padding = 3;
        addAndCheckPage(titleHeight + imageHeight + padding);
        doc.text(title, 14, currentY + titleHeight);
        currentY += titleHeight + padding;
        doc.addImage(image, "PNG", 15, currentY, imageWidth, imageHeight);
        currentY += imageHeight + 2 * padding;
    }

    if (chart) addImageWithTitle(chart.toBase64Image(), "Boxplot Visualization");
    if (histogram) addImageWithTitle(histogram.toBase64Image(), "Histogram Visualization");

    doc.save("variations-report.pdf");
}

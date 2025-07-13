export function saveFreqDistToPDF(data, chart){
    if(data === null || chart === null){
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
        headStyles: {fillColor: [54, 162, 235]}
    });

    const chartImage = chart.toBase64Image();
    const chartWidth = 180;
    const chartHeight = 120;

    // const finalY = doc.lastAutoTable.finalY + 10;
    doc.addPage();
    doc.addImage(chartImage, "PNG", 15, 10, chartWidth, chartHeight);

    doc.save("frequency-distribution-report.pdf");

}

export function saveTendencyToPDF(data, chart, histogram) {
  if (!data || !chart) {
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

  doc.setFontSize(16);
  doc.text("Measures of Central Tendency Report", 14, 15);

  doc.setFontSize(12);
  doc.text(`N: ${n}`, 14, 25);
  doc.text(`k: ${k}`, 40, 25);
  doc.text(`i: ${i}`, 66, 25);

  const yBase = 35;
  let currentY = yBase;
  doc.text(`Arithmetic Mean: ${arithmeticMean.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Geometric Mean: ${geometricMean.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Harmonic Mean: ${harmonicMean.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Median: ${median.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Mode: ${mode.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Quartiles:`, 14, currentY);
  currentY += 7;
  doc.text(`Q1: ${quartiles.Q1.toFixed(2)}`, 22, currentY);
  currentY += 7;
  doc.text(`Q2: ${quartiles.Q2.toFixed(2)}`, 22, currentY);
  currentY += 7;
  doc.text(`Q3: ${quartiles.Q3.toFixed(2)}`, 22, currentY);

  doc.autoTable({
    startY: currentY + 8,
    head: [['Items', 'Frequency', 'Cumulative Below']],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [54, 162, 235] }
  });

  const chartImage = chart.toBase64Image();
  doc.addPage();
  doc.text("Boxplot Visualization", 14, 15);
  doc.addImage(chartImage, "PNG", 15, 25, 180, 120);

  const histogramImage = histogram.toBase64Image();
  doc.text("Histogram Visualization", 14, 150);
  doc.addImage(histogramImage, "PNG", 15, 155, 180, 120);

  doc.save("central-tendency-report.pdf");
}

export function saveVariationToPDF(data, chart, histogram) {
  if (!data || !chart) {
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
      frequencies[value],
    ]);
  }

  const doc = new window.jspdf.jsPDF();

  doc.setFontSize(16);
  doc.text("Measures of Central Tendency Report", 14, 15);

  doc.setFontSize(12);
  doc.text(`N: ${n}`, 14, 25);
  doc.text(`k: ${k}`, 40, 25);
  doc.text(`i: ${i}`, 66, 25);

  const yBase = 35;
  let currentY = yBase;
  doc.text(`Arithmetic Mean: ${arithmeticMean.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Median: ${median.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Mode: ${mode.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Quartiles:`, 14, currentY);
  currentY += 7;
  doc.text(`Q1: ${quartiles.Q1.toFixed(2)}`, 22, currentY);
  currentY += 7;
  doc.text(`Q2: ${quartiles.Q2.toFixed(2)}`, 22, currentY);
  currentY += 7;
  doc.text(`Q3: ${quartiles.Q3.toFixed(2)}`, 22, currentY);
  currentY += 7;
  doc.text(`Range: ${range}`, 14, currentY);
  currentY += 7;
  doc.text(`Mean Absolute Deviation: ${meanAbsoluteDeviation.toFixed(3)}`, 14, currentY);
  currentY += 7;
  doc.text(`Variance (𝜎2): ${variance.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Standard Deviation (𝜎): ${standardDeviation.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Coefficient of Variation: ${coefficientOfVariation.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Skewness (α3): ${skewness.toFixed(2)}`, 14, currentY);
  currentY += 7;
  doc.text(`Kurtosis (α4): ${kurtosis.toFixed(2)}`, 14, currentY);

  doc.autoTable({
    startY: currentY + 8,
    head: hasIntervals ? [['Items', 'Frequency', 'Midpoint']] : [['Items', 'Frequency']],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [54, 162, 235] }
  });

  const chartImage = chart.toBase64Image();
  doc.addPage();
  doc.text("Boxplot Visualization", 14, 15);
  doc.addImage(chartImage, "PNG", 15, 25, 180, 120);

  const histogramImage = histogram.toBase64Image();
  doc.text("Histogram Visualization", 14, 150);
  doc.addImage(histogramImage, "PNG", 15, 155, 180, 120);

  doc.save("variations-report.pdf");
}

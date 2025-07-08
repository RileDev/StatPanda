const chartWrapper = document.querySelector(".chart-wrapper");
const ctx = document.getElementById("chart");
const chartTypeSelect = document.getElementById("chartType");

const histogramWrapper = document.querySelector(".histogram-wrapper");
const histogramCtx = document.getElementById("histogram");

let chartInstance = null;
let histogramInstance = null;

const colorPalette = [
  "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099",
  "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395"
];

export function displayChart(data) {
  if (!data) {
    hideChart();
    return;
  }

  const hasIntervals = data["dataset"].hasIntervals;
  const frequencies = data["dataset"].frequencies;

  const labels = hasIntervals
    ? frequencies.map((f) => `${f.min}-${f.max}`)
    : Object.keys(frequencies);
  const dataFreq = hasIntervals
    ? frequencies.map((f) => f.frequency)
    : Object.values(frequencies);

  showChart();

  if (chartInstance)
    chartInstance.destroy();

  chartInstance = getChart(chartTypeSelect.value, "Frequency", labels, dataFreq);
  return chartInstance;
}

const getChart = (type, label, labels, data, datasets = null) => {
  let chartType = type;
  const options = {};
  let chartDatasets;

  if (type === "pie" || type === "doughnut" || type === "polarArea" || type === "radar") {
    chartType = type;
    chartDatasets = [
      {
        label: label,
        data: data,
        backgroundColor: colorPalette,
        borderColor: colorPalette,
        borderWidth: 1,
      }
    ];
  }
  else if (type === "horizontalBar") {
    chartType = "bar";
    options.indexAxis = "y";
    options.scales = {
      x: { title: { display: true, text: "Frequency" } },
      y: { beginAtZero: true, title: { display: true, text: "Intervals" }, ticks: { stepSize: 1 } }
    };
    chartDatasets = datasets || [
      {
        label: label,
        data: data,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ];
  } else if (type === "stackedBar") {
    chartType = "bar";
    options.scales = {
      x: { stacked: true, title: { display: true, text: "Intervals" } },
      y: { stacked: true, beginAtZero: true, title: { display: true, text: "Frequency" }, ticks: { stepSize: 1 } }
    };
    chartDatasets = datasets || [
      {
        label: label,
        data: data,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ];
  } else {
    options.indexAxis = "x";
    options.scales = {
      x: { title: { display: true, text: "Intervals" } },
      y: { beginAtZero: true, title: { display: true, text: "Frequency" }, ticks: { stepSize: 1 } }
    };
    chartDatasets = datasets || [
      {
        label: label,
        data: data,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ];
  }

  return new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: chartDatasets
    },
    options: options,
  });
};

export function displayBoxplot(data) {
  if (!data || data.length === 0) {
    hideChart();
    return;
  }

  const stats = data["dataset"];
  let min, max;

  if (stats.hasIntervals) {
    min = stats.items[0].min;
    max = stats.items[stats.items.length - 1].max;
  } else {
    min = Math.min(...stats.data);
    max = Math.max(...stats.data);
  }


  const boxplotData = [
    {
      min: min,
      q1: stats.quartiles.Q1,
      median: stats.quartiles.Q2,
      mean: stats.arithmeticMean,
      q3: stats.quartiles.Q3,
      max: max
    }
  ]

  showChart();

  if (chartInstance)
    chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'boxplot',
    data: {
      labels: [''],
      datasets: [{
        label: 'Boxplot',
        data: boxplotData,
        backgroundColor: 'rgba(33,150,243,0.35)',
        borderColor: '#2196f3',
        borderWidth: 2,
        medianColor: '#ff9800',
        medianWidth: 3,
        meanColor: '#43a047',
        meanWidth: 3,
        meanRadius: 6,
        whiskerColor: '#757575',
        whiskerWidth: 2,
        outlierColor: '#e53935',
        outlierRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        boxplot: { mean: true },
        legend: {
          labels: {
            color: '#90caf9',
            font: { size: 15 }
          }
        },
        tooltip: {
          backgroundColor: '#263238',
          bodyColor: '#fff',
          titleColor: '#90caf9'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Dataset',
            color: '#90caf9',
            font: { weight: 'bold', size: 16 }
          },
          ticks: { color: '#bdbdbd' }
        },
        y: {
          title: {
            display: true,
            text: 'Value',
            color: '#90caf9',
            font: { weight: 'bold', size: 16 }
          },
          grid: { color: '#333' },
          ticks: { color: '#bdbdbd' }
        }
      },
      layout: {
        padding: { bottom: 40 }
      }
    }
  });

  return chartInstance;
}

export const displayHistogram = data => {
  if (!data) {
    hideHistogram();
    return;
  }

  const dataset = data["dataset"];
  let histogramData, xScaleType, xLabels, meanValue, medianValue, modeValue, meanAnnotation, medianAnnotation, modeAnnotation;

  if (dataset.hasIntervals) {
    xScaleType = 'category';
    xLabels = dataset.items.map(item => `${item.min}-${item.max}`);
    histogramData = dataset.frequencies.map(f => f.frequency);

    function getBinIndex(value, items) {
      for (let i = 0; i < items.length; i++) {
        if (value >= items[i].min && value <= items[i].max) return i;
      }
      return 0;
    }

    const meanBinIndex = getBinIndex(dataset.arithmeticMean, dataset.items);
    const medianBinIndex = getBinIndex(dataset.quartiles.Q2, dataset.items);
    const modeBinIndex = getBinIndex(dataset.mode, dataset.items);

    meanAnnotation = {
      type: 'line',
      xMin: meanBinIndex,
      xMax: meanBinIndex,
      borderColor: '#43a047',
      borderWidth: 2,
      label: { content: 'Mean', enabled: true, color: '#43a047', backgroundColor: '#fff', font: { weight: 'bold' }, position: 'start' }
    };
    medianAnnotation = {
      type: 'line',
      xMin: medianBinIndex,
      xMax: medianBinIndex,
      borderColor: '#ff9800',
      borderWidth: 2,
      label: { content: 'Median', enabled: true, color: '#ff9800', backgroundColor: '#fff', font: { weight: 'bold' }, position: 'start' }
    };
    modeAnnotation = {
      type: 'line',
      xMin: modeBinIndex,
      xMax: modeBinIndex,
      borderColor: '#e53935',
      borderWidth: 2,
      label: { content: 'Mode', enabled: true, color: '#e53935', backgroundColor: '#fff', font: { weight: 'bold' }, position: 'start' }
    };

  } else {
    xScaleType = 'linear';
    const labels = [...new Set(dataset.items)].sort((a, b) => a - b);
    const frequencies = Object.values(dataset.frequencies);
    histogramData = labels.map((value, i) => ({ x: value, y: frequencies[i] }));

    meanValue = dataset.arithmeticMean;
    medianValue = dataset.quartiles.Q2;
    modeValue = dataset.mode;

    meanAnnotation = {
      type: 'line',
      xMin: meanValue,
      xMax: meanValue,
      borderColor: '#43a047',
      borderWidth: 2,
      label: { content: 'Mean', enabled: true, color: '#43a047', backgroundColor: '#fff', font: { weight: 'bold' }, position: 'start' }
    };
    medianAnnotation = {
      type: 'line',
      xMin: medianValue,
      xMax: medianValue,
      borderColor: '#ff9800',
      borderWidth: 2,
      label: { content: 'Median', enabled: true, color: '#ff9800', backgroundColor: '#fff', font: { weight: 'bold' }, position: 'start' }
    };
    modeAnnotation = {
      type: 'line',
      xMin: modeValue,
      xMax: modeValue,
      borderColor: '#e53935',
      borderWidth: 2,
      label: { content: 'Mode', enabled: true, color: '#e53935', backgroundColor: '#fff', font: { weight: 'bold' }, position: 'start' }
    };
  }

  if (histogramInstance) histogramInstance.destroy();
  showHistogram();

  histogramInstance = new Chart(histogramCtx, {
    type: 'bar',
    data: xScaleType === 'category'
      ? {
        labels: xLabels,
        datasets: [{
          label: 'Frequency',
          data: histogramData,
          backgroundColor: 'rgba(33, 150, 243, 0.5)',
          borderColor: '#2196f3',
          borderWidth: 1
        }]
      }
      : {
        datasets: [{
          label: 'Frequency',
          data: histogramData,
          backgroundColor: 'rgba(33, 150, 243, 0.5)',
          borderColor: '#2196f3',
          borderWidth: 1
        }]
      },
    options: {
      scales: {
        x: Object.assign(
          {
            title: { display: true, text: xScaleType === 'category' ? 'Groups' : 'Values' },
            grid: { color: '#333' },
            ticks: { color: '#bdbdbd' }
          },
          xScaleType === 'linear' ? { type: 'linear' } : {}
        ),
        y: {
          title: { display: true, text: 'Frequency' },
          beginAtZero: true,
          grid: { color: '#333' },
          ticks: { color: '#bdbdbd' }
        }
      },
      plugins: {
        legend: { display: false },
        annotation: {
          annotations: {
            meanLine: meanAnnotation,
            medianLine: medianAnnotation,
            modeLine: modeAnnotation
          }
        }
      }
    }
  });
};


const showChart = () => chartWrapper.classList.add("display");

const hideChart = () => {
  if (chartInstance)
    chartInstance.destroy();
  if (chartWrapper.classList.contains("display"))
    chartWrapper.classList.remove("display");
}
const showHistogram = () => histogramWrapper.classList.add("display");

const hideHistogram = () => {
  if (histogramWrapper.classList.contains("display"))
    histogramWrapper.classList.remove("display");
}
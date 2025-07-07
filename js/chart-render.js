const chartWrapper = document.querySelector(".chart-wrapper");
const ctx = document.getElementById("chart");
const chartTypeSelect = document.getElementById("chartType");

const histogramWrapper = document.querySelector(".histogram-wrapper");


let chartInstance = null;
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

  showHistogram();
}

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
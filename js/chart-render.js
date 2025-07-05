const chartWrapper = document.querySelector(".chart-wrapper");
const ctx = document.getElementById("chart");
const chartTypeSelect = document.getElementById("chartType");

let chartInstance = null;

export function displayChart(dist) {
  if(dist == null){
    hideChart();
    return;
  }

  const hasIntervals = dist["dataset"].hasIntervals;
  const frequencies = dist["dataset"].frequencies;

  const labels = hasIntervals
    ? frequencies.map((f) => `${f.min}-${f.max}`)
    : Object.keys(frequencies);
  const data = hasIntervals
    ? frequencies.map((f) => f.frequency)
    : Object.values(frequencies);

  showChart();

  if (chartInstance) 
    chartInstance.destroy();
  
  chartInstance = getChart(chartTypeSelect.value, "Frequency", labels, data);
}

const colorPalette = [
  "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099",
  "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395"
];

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


const showChart = () => chartWrapper.classList.add("display");

const hideChart = () => {
  if(chartInstance)
      chartInstance.destroy();
  if(chartWrapper.classList.contains("display"))
    chartWrapper.classList.remove("display");
}
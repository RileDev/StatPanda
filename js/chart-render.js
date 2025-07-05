const chartWrapper = document.querySelector(".chart-wrapper");
const ctx = document.getElementById("chart");

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

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Frequency",
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Intervals",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Frequency",
          },
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

const showChart = () => chartWrapper.classList.add("display");

const hideChart = () => {
  if(chartInstance)
      chartInstance.destroy();
  if(chartWrapper.classList.contains("display"))
    chartWrapper.classList.remove("display");
}
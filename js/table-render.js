const tableWrapper = document.querySelector(".table-wrapper");
const tableHead = document.querySelector(".table-wrapper thead");
const tableBody = document.querySelector(".table-wrapper tbody");

export function displayTable(data){
    if(data == null) {
        hideTable()
        return;
    }
    
    const rows = data["dataset"].k;
    const hasIntervals = data["dataset"].hasIntervals;
    const items = data["dataset"].items;
    const frequencies = data["dataset"].frequencies;
    const midpointsOfIthClass = data["dataset"].midpointsOfIthClass || null;
    const cumulativeBelow = data["dataset"].cumulativeBelow || null;
    const cumulativeAbove = data["dataset"].cumulativeAbove || null;
    const relativeFrequencies = data["dataset"].relativeFrequencies || null;
    const cumulativeFrequencies = data["dataset"].cumulativeFrequencies || null;

    showTable();
    initializeHead(hasIntervals, midpointsOfIthClass, cumulativeBelow, cumulativeAbove, relativeFrequencies, cumulativeFrequencies);
    tableBody.innerHTML = "";
    
    for(let i = 0; i < rows; i++){
        tableBody.innerHTML += 
        `
            <tr>
                <td>${hasIntervals ? items[i].min + " - " + items[i].max : items[i]}</td>
                <td>${hasIntervals ? frequencies[i].frequency : Object.values(frequencies)[i]}</td>
                ${hasIntervals && midpointsOfIthClass ? `<td>${midpointsOfIthClass[i]}</td>` : ""}
                ${cumulativeBelow ? `<td>${cumulativeBelow[i]}</td>` : ""}
                ${cumulativeAbove ? `<td>${cumulativeAbove[i]}</td>` : ""}
                ${relativeFrequencies ? `<td>${relativeFrequencies[i].toFixed(2)}</td>` : ""}
                ${cumulativeFrequencies ? `<td>${cumulativeFrequencies[i].toFixed(2)}</td>` : ""}
            </tr>
        `;
    }

}

const showTable = () => tableWrapper.classList.add("display");

const hideTable = () => {
    tableBody.innerHTML = "";
    if(tableWrapper.classList.contains("display"))
        tableWrapper.classList.remove("display");
}

const initializeHead = (hasIntervals, midpointsOfIthClass, cumulativeBelow, cumulativeAbove, relativeFrequencies, cumulativeFrequencies) => {
    tableHead.innerHTML = `
        <tr>
            <th>Items</th>
            <th>Frequency</th>
            ${hasIntervals && midpointsOfIthClass ? "<th>Midpoint (x<sub>si</sub>)</th>" : ""}
            ${cumulativeBelow ? "<th>Cumulative Below</th>" : ""}
            ${cumulativeAbove ? "<th>Cumulative Above</th>" : ""}
            ${relativeFrequencies ? "<th>Relative Frequency (%)</th>" : ""}
            ${cumulativeFrequencies ? "<th>Cumulative Frequency (%)</th>" : ""}
        </tr>
    `;
}
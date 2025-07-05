const tableWrapper = document.querySelector(".table-wrapper");
const tableBody = document.querySelector(".table-wrapper tbody");

export function displayTable(data){
    if(data == null) {
        hideTable()
        return;
    }
    showTable();
    tableBody.innerHTML = "";
    
    const rows = data["dataset"].k;
    const hasIntervals = data["dataset"].hasIntervals;
    const items = data["dataset"].items;
    const frequencies = data["dataset"].frequencies;
    const cumulativeBelow = data["dataset"].cumulativeBelow;
    const cumulativeAbove = data["dataset"].cumulativeAbove;
    const relativeFrequencies = data["dataset"].relativeFrequencies;
    const cumulativeFrequencies = data["dataset"].cumulativeFrequencies;
    
    for(let i = 0; i < rows; i++){
        tableBody.innerHTML += 
        `
            <tr>
                <td>${hasIntervals ? items[i].min + " - " + items[i].max : items[i]}</td>
                <td>${hasIntervals ? frequencies[i].frequency : Object.values(frequencies)[i]}</td>
                <td>${cumulativeBelow[i]}</td>
                <td>${cumulativeAbove[i]}</td>
                <td>${relativeFrequencies[i].toFixed(2)}</td>
                <td>${cumulativeFrequencies[i].toFixed(2)}</td>
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
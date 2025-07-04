export class FrequencyDistribution {
  #rawData;
  #hasIntervals;

  constructor(rawData, hasIntervals) {
    this.#rawData = rawData;
    this.#hasIntervals = hasIntervals;
  }

  #getFreqWithIntervals() {
    const intervals = this.getItems();
    let intervalsWithFreq = intervals.map((interval) => ({
      ...interval,
      frequency: 0,
    }));

    for (const item of this.#rawData) {
      for (let i = 0; i < intervalsWithFreq.length; i++) {
        if (
          item >= intervalsWithFreq[i].min &&
          item <= intervalsWithFreq[i].max
        ) {
          intervalsWithFreq[i].frequency++;
          break;
        }
      }
    }

    return intervalsWithFreq;
  }

  #getFreqWithoutIntervals() {
    const freq = {};
    const arr = [...this.#rawData].sort();
    for (const el of arr) {
      freq[el] = (freq[el] || 0) + 1;
    }

    return freq;
  }

  get count() {
    return this.#rawData.length;
  }

  get k() {
    return this.#hasIntervals ? Math.ceil(1 + 3.3 * Math.log10(this.count)) : Object.keys(this.getFrequencies()).length;
  }

  get i() {
    return this.#hasIntervals ? Math.ceil(
      (Math.max(...this.#rawData) - Math.min(...this.#rawData)) / this.k
    ) : 0;
  }

  get json() {
    return {
      dataset: {
        data: this.#rawData,
        n: this.count,
        k: this.k,
        i: this.i,
        hasIntervals: this.#hasIntervals,
        items: this.getItems(),
        frequencies: this.getFrequencies(),
        cumulativeBelow : this.getCumulativeBelow(),
        cumulativeAbove : this.getCumulativeAbove(),
        relativeFrequencies : this.getRelativeFrequencies(),
        cumulativeFrequencies : this.getCumulativeFrequencies()
      },
    };
  }

  getFrequencies() {
    if (this.#hasIntervals) return this.#getFreqWithIntervals();
    else return this.#getFreqWithoutIntervals();
  }

  getItems() {
    if (!this.#hasIntervals) {
      const uniqueSorted = [...new Set(this.#rawData)].sort((a, b) => a - b);
      return [...uniqueSorted];
    }
    const intervals = [];

    let start = Math.min(...this.#rawData);
    for (let i = 0; i < this.k; i++) {
      let intervalMin = start + i * this.i;
      let intervalMax = intervalMin + this.i - 1;

      intervals.push({ min: intervalMin, max: intervalMax });
    }

    return intervals;
  }

  getCumulativeBelow() {
      const frequencies = this.getFrequencies();
      const first = this.#hasIntervals ? frequencies[0].frequency : Object.values(frequencies)[0];
      const cumulativeBelow = [first];
    
      for(let i = 1; i < this.k; i++){
        const item = this.#hasIntervals ? frequencies[i].frequency : Object.values(frequencies)[i];
        cumulativeBelow.push(cumulativeBelow[i - 1] + item);
      }

      return cumulativeBelow;
  }

  getCumulativeAbove(){
    const cumulativeAbove = [];
    const frequencies = this.getFrequencies();

    let runningTotal = 0;
    for(let i = this.k - 1; i >= 0; i--){
        const freq = this.#hasIntervals ? frequencies[i].frequency : Object.values(frequencies)[i];
        runningTotal += freq;
        cumulativeAbove[i] = runningTotal;
    }

    return cumulativeAbove
  }

  getRelativeFrequencies(){
    const relativeFrequencies = [];
    const frequencies = this.getFrequencies();
    const n = this.count;

    for(let i = 0; i < this.k; i++){
        const freq = this.#hasIntervals ? frequencies[i].frequency : Object.values(frequencies)[i];
        const rel = (freq / n) * 100;
        relativeFrequencies.push(rel);
    }

    return relativeFrequencies;
  }

  getCumulativeFrequencies(){
    const cumulativeFrequencies = [];
    const cumulativeBelow = this.getCumulativeBelow();
    const n = this.count;

    for(let i = 0; i < this.k; i++){
        const rel = (cumulativeBelow[i] / n) * 100;
        cumulativeFrequencies.push(rel);
    }

    return cumulativeFrequencies;
  }
  
}

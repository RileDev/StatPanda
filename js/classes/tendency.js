import { FrequencyDistribution } from "./frequency-distribution.js";

export class Tendency extends FrequencyDistribution{
    constructor(rawData, hasInterval){
        super(rawData, hasInterval);
    }

    #getMidpointsOfIthClass(frequencies){
        let result = [];

        for(let i = 0; i < frequencies.length; i++){
            const min = frequencies[i].min;
            const max = frequencies[i].max;
            let el = (min + max) / 2;
            result[i] = el; 
        }

        return result;
    }

    getArithmeticMean() {
        let count = 0;
        const frequencies = this.getFrequencies();
        const n = this.count;

        if (n === 0) return NaN;
        
        if(this.hasIntervals){
            const xs = this.#getMidpointsOfIthClass(frequencies);

            for(let i = 0; i < frequencies.length; i++){
                const freq = frequencies[i].frequency;                
                count += (freq * xs[i]);
            }
        }else{
            let intervals = Object.keys(frequencies);
            let freq = Object.values(frequencies);

            for(let i = 0; i < intervals.length; i++){
                count += (Number(intervals[i]) * freq[i]);
            }
        }

        return count / n;
    }

    getGeometricMean() {
        let g = 0;
        let logSum = 0;
        const frequencies = this.getFrequencies();
        const n = this.count;

        if (n === 0) return NaN;

        if(this.hasIntervals){
            const xs = this.#getMidpointsOfIthClass(frequencies);

            for(let i = 0; i < frequencies.length; i++){
                const freq = frequencies[i].frequency;                
                logSum += freq * Math.log(xs[i]);
            }
        }else{
            let intervals = Object.keys(frequencies);
            let freq = Object.values(frequencies);
            
            for (let i = 0; i < intervals.length; i++) {
                logSum += freq[i] * Math.log(Number(intervals[i]));
            }
        }
        g = Math.exp(logSum / n);
        return g;
    }

    getHarmonicMean() {
        let divisor = 0;
        const frequencies = this.getFrequencies();
        const n = this.count;

        if (n === 0) return NaN;

        if(this.hasIntervals){
            const xs = this.#getMidpointsOfIthClass(frequencies);

            for(let i = 0; i < frequencies.length; i++){
                const freq = frequencies[i].frequency;                
                if (xs[i] === 0) continue; 
                divisor += freq / xs[i];   
            }

        }else{
            let intervals = Object.keys(frequencies);
            let freq = Object.values(frequencies);

            for(let i = 0; i < intervals.length; i++){
                const value = Number(intervals[i]);
                if (value === 0) continue; 
                divisor += freq[i] / value; 
            }

        }
        
        const h = divisor === 0 ? NaN : n / divisor;
        return h;
    }

    getMedian(){
        const data = [...this.rawData.sort((a, b) => a - b)];
        const n = this.count;

        if(this.hasIntervals){
            let medianClassIndex = 0;
            const cumulativeBelow = this.getCumulativeBelow();
            const frequencies = this.getFrequencies();

            for(let i = 0; i < cumulativeBelow.length; i++){
                if(cumulativeBelow[i] >= n/2){
                    medianClassIndex = i;
                    break;
                }
            }

            const freqObj = frequencies[medianClassIndex];
            const L = freqObj.min;
            const F = medianClassIndex > 0 ? cumulativeBelow[medianClassIndex - 1] : 0;
            const f = freqObj.frequency;
            const w = freqObj.max - freqObj.min;

            const median = L + ((n/2 - F) / f) * w;
            return median;
        }else{
            if (n % 2 === 1) 
                return data[(n-1)/2];
            else 
                return (data[n/2 - 1] + data[n/2]) / 2;
        }
    }

    getMode() {}

    getQuartiles() {}

    get json(){
        return {
        dataset: {
            data: this.rawData,
            n: this.count,
            k: this.k,
            i: this.i,
            hasIntervals: this.hasIntervals,
            items: this.getItems(),
            frequencies: this.getFrequencies(),
            arithmeticMean: this.getArithmeticMean(),
            geometricMean: this.getGeometricMean(),
            harmonicMean: this.getHarmonicMean(),
            median: this.getMedian()
        },
    };
    }
}
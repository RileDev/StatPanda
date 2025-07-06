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
            let intrevals = Object.keys(frequencies);
            let freq = Object.values(frequencies);

            for(let i = 0; i < intrevals.length; i++){
                count += (Number(intrevals[i]) * freq[i]);
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
            let intrevals = Object.keys(frequencies);
            let freq = Object.values(frequencies);
            
            for (let i = 0; i < intrevals.length; i++) {
                logSum += freq[i] * Math.log(Number(intrevals[i]));
            }
        }
        g = Math.exp(logSum / n);
        return g;
    }

    getMedian(){}

    getMode() {}

    getHarmonicMean() {}

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
            geometricMean: this.getGeometricMean()
        },
    };
    }
}
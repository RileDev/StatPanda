import { Tendency } from "./tendency.js";

export class Variation extends Tendency {
    constructor(rawData, hasIntervals) {
        super(rawData, hasIntervals);
    }

    #getCentralMomentThirdOrder() {
        const n = this.count;
        const frequencies = this.getFrequencies();
        const mean = this.getArithmeticMean();

        let sum = 0;

        if (this.hasIntervals) {
            const xs = this.getMidpointsOfIthClass(frequencies);

            for (let i = 0; i < frequencies.length; i++) {
                const frequency = frequencies[i].frequency;
                sum += frequency * Math.pow((xs[i] - mean), 3);
            }
        } else {
            for (let i = 0; i < this.k; i++) {
                const frequency = Object.values(frequencies)[i];
                const item = Object.keys(frequencies)[i];

                sum += frequency * Math.pow((Number(item) - mean), 3);
            }

        }

        return sum / n;
    }

    #getCentralMomentFourthOrder() {
        const n = this.count;
        const frequencies = this.getFrequencies();
        const mean = this.getArithmeticMean();

        let sum = 0;

        if (this.hasIntervals) {
            const xs = this.getMidpointsOfIthClass(frequencies);

            for (let i = 0; i < frequencies.length; i++) {
                const frequency = frequencies[i].frequency;
                sum += frequency * Math.pow((xs[i] - mean), 4);
            }
        } else {
            for (let i = 0; i < this.k; i++) {
                const frequency = Object.values(frequencies)[i];
                const item = Object.keys(frequencies)[i];

                sum += frequency * Math.pow((Number(item) - mean), 4);
            }

        }

        return sum / n;
    }

    getRange() {
        let min = 0;
        let max = 0;

        if (this.hasIntervals) {
            const frequencies = this.getFrequencies();
            min = frequencies[0].min;
            max = frequencies[frequencies.length - 1].max;

        } else {
            min = Math.min(...this.rawData);
            max = Math.max(...this.rawData);
        }

        return max - min;
    }

    getMeanAbsoluteDeviation() {
        const n = this.count;
        const frequencies = this.getFrequencies();
        const mean = this.getArithmeticMean();

        let sum = 0;

        if (this.hasIntervals) {
            const xs = this.getMidpointsOfIthClass(frequencies);

            for (let i = 0; i < frequencies.length; i++) {
                const frequency = frequencies[i].frequency;
                sum += frequency * Math.abs(xs[i] - mean);
            }
        } else {
            for (let i = 0; i < this.k; i++) {
                const frequency = Object.values(frequencies)[i];
                const item = Object.keys(frequencies)[i];

                sum += frequency * Math.abs(Number(item) - mean);
            }
        }

        return sum / n;
    }

    getVariance() {
        const n = this.count;
        const frequencies = this.getFrequencies();
        const mean = this.getArithmeticMean();

        let sum = 0;
        let variance = 0;

        if (this.hasIntervals) {
            const xs = this.getMidpointsOfIthClass(frequencies);

            for (let i = 0; i < frequencies.length; i++) {
                const frequency = frequencies[i].frequency;
                sum += frequency * Math.pow(xs[i], 2);
            }

            variance = (sum / n) - Math.pow(mean, 2);
        } else {
            for (let i = 0; i < this.k; i++) {
                const frequency = Object.values(frequencies)[i];
                const item = Object.keys(frequencies)[i];

                sum += frequency * Math.pow(item, 2);
            }

            variance = (sum / n) - Math.pow(mean, 2);
        }

        return variance;
    }

    getStandardDeviation() {
        return Math.sqrt(this.getVariance());
    }

    getCoefficientOfVariation() {
        const stdDev = this.getStandardDeviation();
        const mean = this.getArithmeticMean();
        return (stdDev / mean) * 100;
    }

    getSkewness() {
        const M3 = this.#getCentralMomentThirdOrder();
        const stdDev = this.getStandardDeviation();
        return M3 / Math.pow(stdDev, 3);
    }

    getKurtosis() {
        const M4 = this.#getCentralMomentFourthOrder();
        const stdDev = this.getStandardDeviation();
        return M4 / Math.pow(stdDev, 4);
    }

    get json() {
        return {
            dataset: {
                data: this.rawData,
                n: this.count,
                k: this.k,
                i: this.i,
                hasIntervals: this.hasIntervals,
                items: this.getItems(),
                frequencies: this.getFrequencies(),
                midpointsOfIthClass: this.getMidpointsOfIthClass(this.getFrequencies()),
                arithmeticMean: this.getArithmeticMean(),
                quartiles: this.getQuartiles(),
                median: this.getMedian(),
                mode: this.getMode(),
                range: this.getRange(),
                meanAbsoluteDeviation: this.getMeanAbsoluteDeviation(),
                variance: this.getVariance(),
                standardDeviation: this.getStandardDeviation(),
                coefficientOfVariation: this.getCoefficientOfVariation(),
                skewness: this.getSkewness(),
                kurtosis: this.getKurtosis()
            },
        };
    }
}
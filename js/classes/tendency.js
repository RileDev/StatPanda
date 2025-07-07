import { FrequencyDistribution } from "./frequency-distribution.js";

export class Tendency extends FrequencyDistribution {
    constructor(rawData, hasInterval) {
        super(rawData, hasInterval);
    }

    #getMidpointsOfIthClass(frequencies) {
        let result = [];

        for (let i = 0; i < frequencies.length; i++) {
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

        if (this.hasIntervals) {
            const xs = this.#getMidpointsOfIthClass(frequencies);

            for (let i = 0; i < frequencies.length; i++) {
                const freq = frequencies[i].frequency;
                count += (freq * xs[i]);
            }
        } else {
            let intervals = Object.keys(frequencies);
            let freq = Object.values(frequencies);

            for (let i = 0; i < intervals.length; i++) {
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

        if (this.hasIntervals) {
            const xs = this.#getMidpointsOfIthClass(frequencies);

            for (let i = 0; i < frequencies.length; i++) {
                const freq = frequencies[i].frequency;
                logSum += freq * Math.log(xs[i]);
            }
        } else {
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

        if (this.hasIntervals) {
            const xs = this.#getMidpointsOfIthClass(frequencies);

            for (let i = 0; i < frequencies.length; i++) {
                const freq = frequencies[i].frequency;
                if (xs[i] === 0) continue;
                divisor += freq / xs[i];
            }

        } else {
            let intervals = Object.keys(frequencies);
            let freq = Object.values(frequencies);

            for (let i = 0; i < intervals.length; i++) {
                const value = Number(intervals[i]);
                if (value === 0) continue;
                divisor += freq[i] / value;
            }

        }

        const h = divisor === 0 ? NaN : n / divisor;
        return h;
    }

    getMedian() {
        const data = [...this.rawData.sort((a, b) => a - b)];
        const n = this.count;

        if (this.hasIntervals) {
            let medianClassIndex = 0;
            const cumulativeBelow = this.getCumulativeBelow();
            const frequencies = this.getFrequencies();

            for (let i = 0; i < cumulativeBelow.length; i++) {
                if (cumulativeBelow[i] >= n / 2) {
                    medianClassIndex = i;
                    break;
                }
            }

            const freqObj = frequencies[medianClassIndex];
            const L = freqObj.min;
            const F = medianClassIndex > 0 ? cumulativeBelow[medianClassIndex - 1] : 0;
            const f = freqObj.frequency;
            const w = freqObj.max - freqObj.min;

            const median = L + ((n / 2 - F) / f) * w;
            return median;
        } else {
            if (n % 2 === 1)
                return data[(n - 1) / 2];
            else
                return (data[n / 2 - 1] + data[n / 2]) / 2;
        }
    }

    getMode() {
        let mode = 0;
        const frequencies = this.getFrequencies();
        if (this.hasIntervals) {
            let maxIndex = 0;
            for (let i = 1; i < frequencies.length; i++) {
                if (frequencies[i].frequency > frequencies[maxIndex].frequency) {
                    maxIndex = i;
                }
            }

            const freqObj = frequencies[maxIndex];
            const L = freqObj.min;
            const f1 = freqObj.frequency;
            const f0 = maxIndex > 0 ? frequencies[maxIndex - 1].frequency : 0;
            const f2 = maxIndex < frequencies.length - 1 ? frequencies[maxIndex + 1].frequency : 0;
            const w = freqObj.max - freqObj.min;

            const denominator = 2 * f1 - f0 - f2;
            if (denominator === 0) return NaN;
            mode = L + ((f1 - f0) / denominator) * w;
        } else {
            const maxFreq = Math.max(...Object.values(frequencies));
            const modes = Object.keys(frequencies).filter(k => frequencies[k] == maxFreq);
            mode = Number(modes[0]);
        }

        return mode;
    }

    getQuartiles() {
        const n = this.count;
        const cumulatives = this.getCumulativeBelow();
        const frequencies = this.getFrequencies();

        if (this.hasIntervals) {
            const getQuartileGrouped = k => {
                const quartilePos = k * n / 4;
                let quartileClassIndex = 0;
                for (let i = 0; i < cumulatives.length; i++) {
                    if (cumulatives[i] >= quartilePos) {
                        quartileClassIndex = i;
                        break;
                    }
                }
                const freqObj = frequencies[quartileClassIndex];
                const L = freqObj.min;
                const F = quartileClassIndex > 0 ? cumulatives[quartileClassIndex - 1] : 0;
                const f = freqObj.frequency;
                const w = freqObj.max - freqObj.min;

                return L + ((quartilePos - F) / f) * w;
            }

            const Q1 = getQuartileGrouped(1);
            const Q3 = getQuartileGrouped(3);

            return {
                Q1: Q1,
                Q2: this.getMedian(),
                Q3: Q3
            }

        } else {
            function findCumulativeIndex(pos, cumulatives) {
                for (let i = 0; i < cumulatives.length; i++) {
                    if (cumulatives[i] >= pos) return i;
                }
                return cumulatives.length - 1;
            }

            const q1Pos = n / 4;
            const q3Pos = 3 * n / 4;

            const cumulativeIndexQ1 = findCumulativeIndex(q1Pos, cumulatives);
            const cumulativeIndexQ3 = findCumulativeIndex(q3Pos, cumulatives);
            const items = Object.keys(frequencies).map(Number).sort((a, b) => a - b);

            return {
                Q1: items[cumulativeIndexQ1],
                Q2: this.getMedian(),
                Q3: items[cumulativeIndexQ3]
            }
        }
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
                cumulativeBelow: this.getCumulativeBelow(),
                arithmeticMean: this.getArithmeticMean(),
                geometricMean: this.getGeometricMean(),
                harmonicMean: this.getHarmonicMean(),
                median: this.getMedian(),
                mode: this.getMode(),
                quartiles: this.getQuartiles()
            },
        };
    }
}
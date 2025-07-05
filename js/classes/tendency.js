import { FrequencyDistribution } from "./frequency-distribution";

export class Tendency extends FrequencyDistribution{
    constructor(rawData, hasInterval){
        super(rawData, hasInterval);
    }

    getArithmeticMean() {}

    getMedian(){}

    getMode() {}

    getGeometricMean() {}

    getHarmonicMean() {}

    getQuartiles() {}
}
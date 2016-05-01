export default class Size {
    /**
     * @param {Number} [width]
     * @param {Number} [height]
     * @param {Number} [depth]
     * @constructor
     */
    constructor(width, height, depth) {
        this.width = parseFloat(width) || 0;
        this.height = parseFloat(height) || 0;
        this.depth = parseFloat(depth) || 0;
    }

    /**
     * Get area
     * @returns {number}
     */
    getArea() {
        return this.width * this.height;
    }

    /**
     * Get volume
     * @returns {number}
     */
    getVolume() {
        return this.width * this.height * this.depth;
    }

}
import Point from 'math/point';
import Size from 'math/size';

export default class Rect {
    /**
     * @param {Number} [width]
     * @param {Number} [height]
     * @param {Number} [depth]
     * @constructor
     */
    constructor(size, position) {
        this.position = position || new Point(0,0)
        this.size = size || new Point(0,0)
    }

}
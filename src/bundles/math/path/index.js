import Point from 'math/point';

export default class Path {
    /**
     * @constructor
     * @param {Array} [points]
     */
    constructor(points) {
        this.points = points || [];
    }

    /**
     * Add a point to the path
     * @param {Point} point
     */
    add(point) {
        this.points.push(point);
        return this;
    }

    /**
     * Get the path with percent
     * @param {Number} percent Percent between 0 and 1
     * @return {Path}
     */
    pathAtPercent(percent) {
        return this.pathAtDistance(this.size * percent);
    }

    /**
     * Get the path with a distance
     * @param {Number} distance
     * @return {Path}
     */
    pathAtDistance(distance) {
        var path = new Path([this.points[0]]);

        if(this.points.length < 2) {
            return path;
        }

        var offset = 0,
            last,
            size = 0;
        
        for(var i = 1; i < this.points.length; i++) {
            offset = size;
            last = path.points[path.length - 1];
            size += last.distance(this.points[i]);

            // Found
            if(size >= distance) {
                path.add(last.pointWithVectorAndDistance(last.vectorWithPoint(this.points[i]), distance - offset));
                return path;
            }

            path.add(this.points[i]);
        }

        // Out
        return path;
    }

    /**
     * Get the path size
     * @return {Number}
     */
    get size() {
        if(this.points.length < 2) {
            return 0;
        }

        var size = 0,
            last = this.points[0];

        for(var i = 1; i < this.points.length; i++) {
            size += last.distance(this.points[i]);
            last = this.points[i];
        }

        return size;
    }

    get length() {
        return this.points.length;
    }
}
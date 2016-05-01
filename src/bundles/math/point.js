export default class Point {
    /**
     * @param {Number} [x]
     * @param {Number} [y]
     * @param {Number} [z]
     * @constructor
     */
    constructor(x, y, z) {
        this.x = parseFloat(x) || 0;
        this.y = parseFloat(y) || 0;
        this.z = parseFloat(z) || 0;
    }

    /**
     * Get distance between 2 points
     * @param {Point} point
     * @return {Number}
     */
    distance(point) {
        return Math.sqrt(this.distanceSquared(point));
    }

    /**
     * Get magnitude between 2 position
     * @param {Point} point
     * @returns {number}
     */
    distanceSquared(point) {
        return Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2) + Math.pow(this.z - point.z, 2);
    }

    /**
     * Get vector between two points
     * @params {Point} point
     * @return {Point}
     */
    vectorWithPoint(point) {
        return new Point(point.x - this.x, point.y - this.y);
    }

    /**
     * Get angle from with a points
     * @param {Point} p1
     * @param {Point} p2
     * @return {number}
     */
    angleWithPoints(p1, p2) {
        var a = p1.distance(p2),
            b = this.distance(p1),
            c = this.distance(p2);

        return Math.acos((Math.pow(a, 2) - Math.pow(b, 2) - Math.pow(c, 2)) / (-2 * b * c));
    }

    /**
     * Get point 2D from a vector and a distance
     * @params {Point} vector
     * @params {number} distance
     * @return {Point}
     */
    pointWithVectorAndDistance(vector, distance) {
        // TODO: 3d point
        var angle = Math.atan2(vector.y, vector.x);
        return new Point(distance * Math.cos(angle) + this.x,distance * Math.sin(angle) + this.y);
    }

    /**
     * Return the distance from a point to a segment
     * @param {Point} p1 the start of the segment
     * @param {Point} p2 end of the segment
     * @return {Number} the distance from the given point to the segment
     */
    distanceWithSegment(p1, p2) {
        return this.distance(this.pointWithSegement(p1, p2));
    }

    /**
     * Return the nearest point for a segment
     * @param {Point} p1 the start of the segment
     * @param {Point} p2 end of the segment
     * @return {Point}
     */
    pointWithSegement(p1, p2) {
        var l2 = p1.distanceSquared(p2);
        if (l2 == 0) return p1;
        var t = ((this.x - p1.x) * (p2.x - p1.x) + (this.y - p1.y) * (p2.y - p1.y)) / l2;
        if (t < 0) return p1;
        if (t > 1) return p2;
        return new Point(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));
    }

    /**
     * Rotate the point around 0;0
     * @param angle
     */
    pointWithRotation(angle) {
        // TODO 3d
        return new Point(
            this.x * Math.cos(angle) + this.y * Math.sin(angle),
            - this.x * Math.sin(angle) + this.y * Math.cos(angle)
        );
    }
}
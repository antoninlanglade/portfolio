import Point from 'math/point';
import Size from 'math/size';
import Rect from 'math/rect';
import $ from 'jquery';


export default class Cover {
    /**
     * Cover
     * @param {Size|undefined} element
     * @param {Size|undefined} container
     * @constructor
     */
    constructor(element, container, scale) {
        this.container = container || new Size();
        this.element = element || new Size();
        this.scale = scale || 1;
    }

    /**
     * Dispose
     */
    dispose() {
        this.container.dispose();
        this.container = null;

        this.element.dispose();
        this.element = null;

        this.transform = null;
    }

    /**
     * Get cover scale
     * @return {number}
     */
    getScale(supScale) {
        // Scales
        var scaleX = (this.container.width / this.element.width);
        var scaleY = (this.container.height / this.element.height);

        var scale = scaleY > scaleX?scaleY:scaleX;
        scale = scale * this.scale;
        return scale;
    }

    /**
     * Get cover size
     * @param scale
     * @returns {Size}
     */
    getSize(scale) {
        scale = scale || this.getScale();
        var size = new Size();
        size.width = this.element.width * scale;
        size.height = this.element.height * scale;
        return size;
    }

    /**
     * Get cover position
     * @param size
     * @returns {Point}
     */
    getPosition(size) {
        var position = new Point();
        position.x = (this.container.width - size.width) * .5;
        position.y = (this.container.height - size.height) * .5;

        if(position.y > - .01)
            position.y = 0;
        if(position.x > - .01)
            position.x = 0;

        return position;
    }

    /**
     * Get cover position and size
     * @return {Rect}
     */
    getPositionAndSize() {
        var size = this.getSize(),
            position = this.getPosition(size),
            rect = new Rect(size, position);

        return rect;
    }

    /**
     * Get crop area
     * @return {Rect}
     */
    getElementCropArea() {
        var scale = this.getScale(),
            rect = new Rect();

        rect.size.width = this.container.width / scale;
        rect.size.height = this.container.height / scale;

        rect.position.x = (this.element.width - rect.size.width) * .5;
        rect.position.y = (this.element.height - rect.size.height) * .5;

        return rect;
    }

    /**
     * Apply the cover to the canvas context 2d target
     * @param {CanvasRenderingContext2D} target
     * @param {HTMLElement} source
     */
    applyToContext(target, source) {
        var rect = this.getElementCropArea();
        target.drawImage(source, rect.position.x, rect.position.y, rect.size.width, rect.size.height, 0, 0, this.container.width, this.container.height);
        return this;
    }

    /**
     * Apply the cover to the html element target
     * @param {HTMLElement} target
     */
    applyToHtmlElement(target) {

        var rect = this.getPositionAndSize();
        target.style.width = rect.size.width+'px';
        target.style.height = rect.size.height+'px';
        target.style.top = rect.position.y+'px';
        target.style.left = rect.position.x+'px';

        return this;
    }
}
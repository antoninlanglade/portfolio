import React from 'react';

export default class CanvasComponent extends React.Component {
    constructor(props) {
        super(props);

        // Animation
        this._requestId = null;
        this._animate = this._animate.bind(this);

        // States
        this.states = {

        };
    }

    componentDidMount() {
        this.canvas = React.findDOMNode(this);
        this.context = this.canvas.getContext('2d');

        // Resize
        window.onresize = this.resize.bind(this);
        this.resize();

        // Play
        this.play();
    }

    componentWillUnmount() {
        this.pause();
        window.onresize = null;
    }

    /**
     * Resize component
     */
    resize() {
        var width = window.innerWidth,
            height = window.innerHeight;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Start animation renderer
     */
    play() {
        if (this._requestId === null) {
            this._lastDraw = Date.now();
            this._animate();
        }
    }

    /**
     * Stop animation renderer
     */
    pause() {
        if(this._requestId) {
            window.cancelAnimationFrame(this._requestId);
            this._requestId = null;
        }
    }

    /**
     * Loop animation
     * @private
     */
    _animate() {
        var time = Date.now(),
            dt = time - this._lastDraw;

        this._requestId = window.requestAnimationFrame(this._animate);
        this._update(dt);
        this._draw();
        this._lastDraw = time;
    }

    /**
     * Update the word for the delta time
     * @param {Number} dt
     * @private
     */
    _update(dt) {
        // TODO
    }

    /**
     * Draw new frame
     * @private
     */
    _draw() {
        // TODO
    }

    render() {
        return (
            <canvas />
        );
    }
}
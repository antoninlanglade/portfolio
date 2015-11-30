import {AbstractLoader} from './';

export class AudioLoader extends AbstractLoader {
	/**
	 * Constructor
	 * @param  {Object} params
	 */
	constructor(params) {
		super(params);
		this.asset = new Audio();
	}

	/**
	 * Load callback
	 * @param  {Function} onComplete callback
	 * @param  {Function} onError callback   
	 */
	load(onComplete, onError) {
		super.load(onComplete, onError);
		this.asset.addEventListener('canplay',this.onCanPlay.bind(this));
        this.asset.addEventListener('error',this.onDetectError.bind(this));
        this.asset.src = this.value;
	}

	/**
	 * When audio can play
	 */
	onCanPlay() {
		this.onComplete();
		this.removeEvents();
	}

	/**
	 * When audio loading error detect
	 */
	onDetectError() {
		this.onError();
		this.removeEvents();
	}

	/**
	 * Remove all events
	 */
	removeEvents() {
		this.asset.removeEventListener('canplay', this.onCanPlay);
		this.asset.removeEventListener('error', this.onDetectError);
	}
}

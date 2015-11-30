import {AbstractLoader} from './';

export class VideoLoader extends AbstractLoader {
	/**
	 * Constructor
	 * @param  {Object} params
	 */
	constructor(params) {
		super(params);
		this.asset = document.createElement('video');
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
	 * When video can play
	 */
	onCanPlay() {
		this.onComplete();
		this.removeEvents();
	}

	/**
	 * When video loading error detect
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

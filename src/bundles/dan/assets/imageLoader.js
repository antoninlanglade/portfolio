import {AbstractLoader} from './';

export class ImageLoader extends AbstractLoader {
	/**
	 * Constructor
	 * @param  {Object} params
	 */
	constructor(params) {
		super(params);
		this.asset = new Image();
		this.onLoad = this.onLoad.bind(this);
		this.onDetectError = this.onDetectError.bind(this);
	}

	/**
	 * Load callback
	 * @param  {Function} onComplete callback
	 * @param  {Function} onError callback   
	 */
	load(onComplete, onError) {
		super.load(onComplete, onError);

		this.asset.addEventListener('load', this.onLoad);
        this.asset.addEventListener('error', this.onDetectError);
        this.asset.src = this.value;
	}

	/** 
	 * Image Loaded
	 */
	onLoad() {
		this.removeEventListeners();
		this.onComplete();
	}

	/**
	 * When image loading error detect
	 */
	onDetectError() {
		this.removeEventListeners();
		this.onError();
	}

	/**
	 * Remove all events
	 */
	removeEventListeners() {
		this.asset.removeEventListener('load', this.onLoad);
        this.asset.removeEventListener('error', this.onDetectError);
	}
}

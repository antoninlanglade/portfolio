export class AbstractLoader {
	/**
	 * Constructor
	 * @param  {Object} params
	 */
	constructor(params) {
		this.value = params.value || null;
		this.asset = null;
		this.attributes = params.attributes || {};
	}	
	/**
	 * Load callback
	 * @param  {Function} onComplete callback
	 * @param  {Function} onError callback   
	 */
	load(onComplete,onError) {
		this.onComplete = onComplete;
		this.onError = onError;
	}

	/**
	 * Return the asset
	 * @return {DOMNode} Dom Node of AssetItem
	 */
	getAsset() {
		return this.asset;
	}
}

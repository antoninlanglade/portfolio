import {AbstractLoader} from './';

export class FunctionLoader extends AbstractLoader {
	/**
	 * Constructor
	 * @param  {Object} params
	 */
	constructor(params) {
		super(params);
		this.asset = this.value;
	}
	
	/**
	 * Load callback
	 * @param  {Function} onComplete callback
	 * @param  {Function} onError callback   
	 */
	load(onComplete, onError) {
		super.load(onComplete, onError);
		this.asset().then(() => {
			this.onComplete();
		}).catch((reason) => {
            this.onError(reason);
        });
	}
}

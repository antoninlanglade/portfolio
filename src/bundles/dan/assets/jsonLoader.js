import $ from 'jquery';
import {AbstractLoader} from './';

export class JSONLoader extends AbstractLoader {
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
		
        $.ajax({
             url: this.value, 
             success: (content) => {
             	this.asset = content;
                this.onComplete(this.asset);
             },
             error : (reason) => {
                 this.onError(reason);
             }
         });
	}
}

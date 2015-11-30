import $ from 'jquery';
import _ from '_';
import {assets} from './';
import {logger} from 'dan/logger';

    
// Loader Manager
export class Loader {
	/**
	 * [constructor description]
	 * @param  {String} $elContainer globalContainer of the Loader
	 * @param  {String} $elPercent  percent container of the Loader
	 * @param  {String} group of the Loader
	 * @return {Loader}              
	 */
    constructor(params) {
        this.$elContainer = $(params.$elContainer);
        this.$elPercent = $(params.$elPercent);
        this.percent = 0;
        this.group = params.group || 'DANFW_DEFAULT';
        this.autoStart = params.autoStart !== void(0) ? params.autoStart : true;
        this.isFinish = false;

        this.start = this.start.bind(this);
        this.progress = this.progress.bind(this);
        this.complete = this.complete.bind(this);
        
        assets.on('START', this.group, this.start); 
        assets.on('PROGRESS', this.group, this.progress);
        assets.on('COMPLETE', this.group, this.complete);
        
    }
  	
  	/**
  	 * Start group signal
  	 */
  	start() {
  		this.show();
      this.percent = 0;
      this.isFinish = false;
  	}

  	/**
  	 * Progress group signal
  	 */
  	progress(percent) {
  		var self = this;
      
  	}

  	/**
  	 * Complete group signal
  	 */
  	complete(percent) {
      this.isFinish = true;
      this.hide();
  		
  	}

  	/**
  	 * Show container
  	 */
  	show() {
  		this.$elContainer.show();
  	}

  	/**
  	 * Hide container
  	 */
  	hide() {
  		this.$elContainer.fadeOut();
  	}

}

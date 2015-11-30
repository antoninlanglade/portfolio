import $ from 'jquery';
import _ from '_';
import {logger} from 'dan/logger';
import {ImageLoader} from './imageLoader';
import {VideoLoader} from './videoLoader';
import {AudioLoader} from './audioLoader';
import {FunctionLoader} from './functionLoader';
import {JSONLoader} from './jsonLoader';
import assetType from './assetType.json';

export class AssetItem {
    /**
     * Constructor
     * @param  {String} Value (URL or Function)
     * @param  {String} Optional name
     */
    constructor(value, name, group, attributes) {
        this.promise = null;
        this._state = AssetItem.loadState.START;
        this.group = group || AssetItem.DEFAULT_GROUP;
        this.name = (name === void(0) || name === null) ? _.uniqueId('assetItem_') : name;
        this.value = value;
        this.content = null;
        this.attributes = attributes || {};
        this.setupLoader();

    }
    
    /**
     * Setup loader checking different extension
     */
    setupLoader() {
        var self = this;
        var opts = {
            value : self.value,
            attributes : self.attributes
        };

        // Check Assets Types
        if (typeof self.value == 'function') {
            self.loader = new FunctionLoader(opts);
        }
        else if (this.checkTypes('image')) {
            self.loader = new ImageLoader(opts);
            
        }
        else if (this.checkTypes('video')) {
            self.loader = new VideoLoader(opts);
        }
        
        else if (this.checkTypes('audio')) {
            self.loader = new AudioLoader(opts);
        }
        else if (this.checkTypes('json')) {
            self.loader = new JSONLoader(opts);
        }
        
        this.content = this.loader.getAsset();
    }

    /**
     * Check if type of asset is allowed
     * @param  {String} type
     * @return {Bool} correctType Exist or not
     */
    checkTypes(type) {
        var correctType = false;

        _.forEach(assetType[type], (assetType) => {
            if(this.value.indexOf(assetType) > -1) {
                correctType = true;
                return false;
            }
        });
        return correctType;
    }

    /**
     * Set the loading state 
     * @param {AssetItem.loadState} state
     */
    setState(state) {
        this._state = state;
    }

    /**
     * Return the current state of the asset
     * @return {AssetItem.loadState} state
     */
    getState() {
        return this._state;
    }

    /**
     * Lunch loading of an asset
     * @return {Promise} Return the promise of loading
     */
    load() {
        
        var self = this;
        if (this._state === AssetItem.loadState.COMPLETE) {
            this.promise = new Promise(function (resolve, reject) {
                resolve(self);            
            });
        }
        else if (this._state !== AssetItem.loadState.PROGRESS) {
            self._state = AssetItem.loadState.PROGRESS;

            this.promise = new Promise(function(resolve, reject) {
                // Options Loader
                self.loader.load(function(content){
                    self.content = self.loader.getAsset();
                    resolve(self);
                },function(reason){
                    reject(reason);
                });
                
            }).catch(function(reason) {
                self._state = AssetItem.loadState.ERROR;
                logger.warn('AssetItem','Error' ,reason);
            });
        }

        return this.promise;
    }

    /**
     * Clean the asset
     */
    clean() {
        this.promise = null;
        this.content = null;
    }
}
// Default Group
AssetItem.DEFAULT_GROUP = 'DANFW_DEFAULT';
// Loading State
AssetItem.loadState = {
    START : 'start',
    PROGRESS : 'progress',
    COMPLETE : 'complete',
    ERROR : 'error'
};
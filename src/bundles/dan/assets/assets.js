import $ from 'jquery';
import _ from '_';
import {AssetItem} from './assetItem';
import {Signal} from 'signals';
import {logger} from 'dan/logger';

// Assets Manager
class Assets {
    /**
     * Constructor
     */
    constructor() {
        this.stack = {};
        this.groups = {};
        this.groupsLoading = {};
        this.countItems = 0;
        this.loadState = {
            START : 'start',
            PROGRESS : 'progress',
            COMPLETE : 'complete',
            ERROR : 'error'
        };
    }

    /**
     * Add items to the loading stack
     * @param {String|Array} Value to add (URLs or functions)
     * @param {String} Optionnal name for AssetItem
     */
    add(value, name, group, attributes) {
        var stackItem;
        var self = this;
        var promises = [];
        var stackItems = [];

        // Setting default group
        if (group === void(0)) {
            group = AssetItem.DEFAULT_GROUP;
        }

        // Check existing assets and names
        if (this.isAssetExist(value)) {
            // logger.warn('Asset',`Existing asset for name "${name}" in Asset Manager`); 
        }
        if (name !== void(0) && this.isNameExist(name)) {
            // logger.warn('Asset',`Existing name "${name}" in Asset Manager`); 
            return this.stack[name].load();
        }

        // Push items only if name does not exist in stack
        var pushItem = (value, name, group, attributes) => {
            if (name === void(0) || !this.isNameExist(name)) {
                stackItem = new AssetItem(value, name, group, attributes);
                this.stack[stackItem.name] = stackItem;
                stackItems.push(stackItem);    
            }
        };

        // Create & Normalize object depending on params passed to the function
        if (typeof value === 'string') {
            pushItem(value, name, group, attributes);
        }
        else if (typeof value === AssetItem) {
            stackItem = value;
            this.stack[stackItem.name] = stackItem;
            stackItems.push(stackItem);
        }
        else if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                var currentItem = value[i];
                pushItem(currentItem, name, group, attributes);
            }
        }
        else if (typeof value === 'function') {
            pushItem(value, name, group, attributes);
        }
        else if (typeof value === 'object') {
            for (var name in value) {
                var currentItem = value[name];
                pushItem(currentItem, name, group, attributes);
            }
        }
        
        // Start only if groups are complete else add in current progress loop
        _.forEach(stackItems,(item) => {
            if (!this.isGroupLoading(item.group)) {
                _.defer((name, value) => {
                    // logger.log('Loader', 'Start', item.group);
                    this.groups[item.group][this.loadState.START].dispatch();
                    this.countItems = 0;
                },item.name,item.value);
                return false;
            } 
        });

        // Create groups signals
        this.createGroups(group);
        
        // Load AssetItem (deferred all dispatch for asynchronism issues)
        _.defer(() => {
            _.forEach(stackItems, (item) => {
                item.load().then(function(itemLoaded) {
                    self.countItems++;
                    itemLoaded._state = AssetItem.loadState.COMPLETE;
                    var percent = self.getPercentGroupLoading(itemLoaded.group);
                    if (self.isGroupFinish(group)) {
                        // logger.log('Loader', 'Progress', itemLoaded.name, percent);
                        self.groups[itemLoaded.group][self.loadState.PROGRESS].dispatch(percent);
                        logger.log('Loader', 'Complete', itemLoaded.group);
                        self.groups[itemLoaded.group][self.loadState.COMPLETE].dispatch(percent);
                        self.groupsLoading[itemLoaded.group] += self.countItems;
                    }
                    else {
                        // logger.log('Loader', 'Progress', itemLoaded.name, percent);
                        self.groups[itemLoaded.group][self.loadState.PROGRESS].dispatch(percent);
                    }
                });
            });
        });
        
        // Push all promises of loading
        _.forEach(stackItems, (item) => {
            promises.push(item.load());
        });

        // Return Promise of loading
        return Promise.all(promises).then((items) => { 
            if (items.length > 1) {
                return items;
            }
            else {
                return items[0];
            }
        });
    }

    /**
     * Create groups (and loadState signals) if does not exist
     * @param  {String} group name
     */
    createGroups(group) {
        if (!this.isGroupExist(group)){
            this.groups[group] = {};    
            this.groupsLoading[group] = 0;
            _.each(this.loadState, (item) => {
                this.groups[group][item] = new Signal();
            });
        }
    }
    /**
     * Check if item already load
     * @param  {String} Asset's name
     * @return {AssetItem.loadState} State of loading
     */
    isNameExist(name) {
        return this.stack[name] !== void(0);
    }

    /**
     * Check if an asset value exist
     * @param  {String||Function}  URLs or Functions
     * @return {Boolean} Exist or not
     */
    isAssetExist(asset) {
        var exist = false;
        _.each(this.stack, function(stackItem) {
            if (stackItem.value === asset) {
                exist = true;
            }
        });
        return exist;
    }

    /**
     * Check if a group exist
     * @param  {String}  Group name
     * @return {Boolean} Exist or not
     */
    isGroupExist(group) {
        return this.groups[group] !== void(0)
    }

    /**
     * Check if a group is loading
     * @param  {String}  Group name
     * @return {Boolean} Finish or not
     */
    isGroupLoading(group) {
        var progress = false;
        _.each(this.stack,function (stackItem) {
            if (stackItem.group === group){
                progress |= stackItem.getState() === AssetItem.loadState.PROGRESS;
            }
        });
        return progress;
    }

    /**
     * Check if a group is loaded
     * @param  {String}  Group name
     * @return {Boolean} Finish or not
     */
    isGroupFinish(group) {
        var finish = true;
        _.each(this.stack,function (stackItem) {
            if (stackItem.group === group){;
                finish &= stackItem.getState() === AssetItem.loadState.COMPLETE;    
                return finish;
            }
        });
        return finish;
    }

    /**
     * Get an AssetItem from his value
     * @param  {String}  Asset Value
     * @return {AssetItem} AssetItem
     */
    getAssetFromValue(value) {
        var asset = null;
        _.each(this.stack, function(stackItem) {
            if (stackItem.value === value) {
                asset = stackItem;
            }
        });        
        return asset;
    }

    /**
     * Get an asset from name
     * @param  {String} Asset's name
     * @param  {Bool} Bool to get the content
     * @return {AssetItem|$Content} AssetItem from name or $Content depending of the bool content
     */
    getAssetFromName(name, content) {
        if (!this.isNameExist(name)) {
            logger.warn('Asset',`Name "${name}" does not exist`);
            return null;
        }
        if (!content) {
            return this.stack[name];
        }
        else {
            return this.stack[name].content;
        }
    }

    /**
     * Get percent loading of assets in a group
     * @param  {String} Group name
     * @return {Float} Percent Load depending on Total items in a group
     */
    getPercentGroupLoading(group) {
        var totalItems = 0;

        if (!this.isGroupExist(group)) {
            logger.warn('Asset',`Group "${group}" does not exist`);
            return null;
        }

        _.forEach(this.stack,(stackItem) => {
            if (stackItem.group === group) {
                totalItems++;
            }
        });
        
        // Subtract items already load
        totalItems -= this.groupsLoading[group];
        // console.log('total ',totalItems, ' currentLoad ',this.countItems);
              // console.log(`PERCENT ${totalItems}`);
        return Math.min(100, Math.max(0, ~~((this.countItems * 100 / totalItems)*100)/100));
    }

    /**
     * On method to listen the loadstate signals
     * @param  {String}   event    
     * @param  {String}   group    
     * @param  {Function} callback 
     */
    on(event, group, callback){
        if (this.loadState[event] === void(0)) {
            logger.warn('Asset','Wrong Event for Assets.on()');
            return null;
        }
        if (typeof group === 'function') {
            callback = group;
            group = AssetItem.DEFAULT_GROUP;
        }
        this.createGroups(group);
        this.groups[group][event.toLowerCase()].add(callback);
    }

    /**
     * Off method to remove listener off the loadstate signals
     * @param  {String}   event    
     * @param  {String}   group    
     * @param  {Function} callback 
     */
    off(event, group, callback){        
        if (this.loadState[event] === void(0)) {
            logger.warn('Asset','Wrong Event for Assets.off()');
            return null;
        }
        if (typeof group === 'function') {
            callback = group;
            group = AssetItem.DEFAULT_GROUP;
        }
        // If event in params
        if (event === void(0)) {
            _.each(this.groups,function (group) {
                for(var key in group){
                    group[key].removeAll();
                }
            });
        }

        // If event in params
        else if (group === void(0)) {
            _.each(this.groups,function (group) {
                for(var key in group){
                    if (key === event.toLowerCase()) {
                        group[key].removeAll();
                    }
                }
            });
        }
        // If event & group in params
        else if (callback === void(0) && this.isGroupExist(group)) {
            for(var key in this.groups[group]){
                if (key === event.toLowerCase()) {
                    this.groups[group][key].removeAll();
                }
            }
        }
    }

    /**
     * Clean stack from a name or all stack.
     * @param  {String} Asset's name
     */
    clean(name) {
        var self = this;
        // Clean from name
        if (name && this.isNameExist(name)) {
            this.stack[name].clean();
            this.stack = _.omit(this.stack, name);
        }
        // Clean All
        else {
            _.each(this.stack, function (item) {
                item.clean();
            });
            this.stack = {};    
        }
    }
}

export var assets = new Assets();


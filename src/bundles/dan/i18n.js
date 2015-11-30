import _ from '_';
import $ from 'jquery';
import async from 'async';
import EventEmitter from 'events';
import {logger} from 'dan/logger';

/**
 * I18n
 */
export class I18n extends EventEmitter {
    constructor(options) {
        super(options);

        options = _.defaults(options || {}, {
            locale: null, // current locale
            files: [], // localized files
            path: '/locales/' // locales path
        });

        this.data = {}; // Locales
        this._locale = options.locale;
        this.files = options.files;
        this.path = options.path;
        this.setMaxListeners(1000);
        this.sync();
    }

    /**
     * Alias for removeListener
     */
    off() {
        this.removeListener.apply(this, arguments);
    }

    /**
     * Get locale
     * @returns {string}
     */
    get locale() {
        return this._locale;
    }

    /**
     * Set locale
     * @param {string} locale
     */
    set locale(locale) {
        if(_.isString(locale) && this._locale !== locale) {
            this._locale = locale;
            this.sync().then(() => {
                logger.log('i18n', 'locale', locale);
                this.emit('change');
            });
        }
    }

    /**
     * Add a localized file
     * @param {string} file
     */
    addFile(file) {
        if(_.isString(file)) {
            this.files.push(file);
            this.files = _.uniq(this.files);
            return this.sync();
        }
        else {
            throw new Error('Invalid file: '+file);
        }
    }

    /**
     * Synchronise
     * @param {string|array} [locale] Force locale(s)
     * @param {string|array} [file] File(s) to synchronise
     * @return {Promise}
     */
    sync(locale, file) {
        locale = locale || this.locale;
        var files = [].concat(file || this.files);
        return new Promise((resolve, reject) => {
            // No locale
            if(_.isNull(locale)) {
                return resolve();
            }

            // Setup
            var process = [];
            _.each([].concat(locale), (locale) => {
                this.data[locale] = this.data[locale] || {};
                var data = this.data[locale];

                // Check
                _.each(files, (file) => {
                    var value = data[file];
                    // New
                    if(_.isUndefined(value)) {
                        ((file) => {
                            var path = this.path+locale+'/'+file+'.json';
                            value = new Promise((resolve, reject) => {
                                $.ajax({
                                    url: path,
                                    dataType: 'json'
                                }).done(function(response) {
                                    data[file] = response;
                                    resolve();
                                }).fail(function() {
                                    reject('Invalid localized file '+path);
                                });
                            });
                            data[file] = value;
                        })(file);
                    }

                    // Progress
                    if(value instanceof Promise) {
                        process.push(function(callback) {
                            value.then(callback).catch(reject);
                        });
                    }
                });
            });

            // Process
            if(process.length == 0) {
                resolve();
            }
            else {
                async.parallel(process, function() {
                    resolve();
                });
            }
        });
    }

    /**
     * Flush data
     * @param {boolean} [files] Flush files also (default false)
     * @returns {object} Data's snapshot before the flush
     */
    flush(files) {
        var data = this.data;
        this.data = []; // Data
        files && (this.files = []); // Files
        return data;
    }

    /**
     * Localize a text
     * @param {string} key
     * @param {object} [params]
     * @param {string} [file]
     * @param {string} [locale]
     * @return {string}
     */
    localize(key, params, file, locale) {
        locale = locale || this.locale;
        file = file || this.files[0];
        params = params || {};

        var data = this.data[locale],
            output = data && data[file] && _.has(data[file], key)?_.get(data[file], key):key;

        // Parameters
        if(_.isString(output)) {
            for(var id in params) {
                output = output.replace(new RegExp(`\\\{${id}\\\}`, 'g'), params[id]);
            }
        }

        return output;
    }

    /**
     * Test if the file is in the cache
     * @param {string} file
     * @param {string} locale
     * @return {boolean}
     */
    hasFile(file, locale) {
        locale = locale || this.locale;
        file = file || this.files[0];
        var data = this.data[locale];
        return !!(data && data[file] && !(data[file] instanceof Promise));
    }
}

export var i18n = new I18n();
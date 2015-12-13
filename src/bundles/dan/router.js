import page from 'page';
import async from 'async';
import _ from '_';
import $ from 'jquery';
import logger from 'dan/logger';
import {i18n} from 'dan/i18n';
import {ensure} from 'dan/modules';
import EventEmitter from 'events';
import Is from 'dan/is';

var TARGET = {
    SELF: "_self",
    BLANK: "_blank"
};

export class Router extends EventEmitter {
    constructor(options) {
        super(options);

        options = _.defaults(options || {}, {
            i18n: i18n,
            file: 'routes',
            path: '/'
        });

        this.i18n = options.i18n;
        this.file = options.file;
        this.path = options.path;
        this.hasStart = false;
        this.routes = {};
        this.route = null;
        this.ctx = null;
        this.locales = [];
        this.middleware = [];
        this.app = null;

        // Locale update
        i18n.addListener('change', () => {
            this.sync();
        });
    }

    /**
     * Alias for removeListener
     */
    off() {
        this.removeListener.apply(this, arguments);
    }

    /**
     * Add a middleware function
     * @param {function} middleware
     */
    use(middleware) {
        this.middleware.push(middleware);
    }

    /**
     * Add a new route
     * @param {String} route
     * @param {String|function} controller
     * @param {Object} [options]
     */
    add(route, controller, options) {
        options = options || {};
        this.routes[route] = _.isString(controller) ? (ctx) => {
            ensure(controller).then((content) => {
                this.app.setPage(content, _.assign(ctx.params, options));
            });
        } : controller;
        this.hasStart && this.sync();
    }

    /**
     * Start the router
     * @return promise
     */
    start() {
        return new Promise((resolve, reject) => {
            this.sync().catch((e) => {
                console.log('router sync error:', e);
            }).then(() => {
                // Anchors
                if (Is.lteie9) {
                    history.redirect(null, this.path);
                }

                // Init
                if (!this.hasStart) {
                    this.hasStart = true;
                    page({
                        click: false
                    });
                }

                resolve();
            }).catch(reject);
        });
    }

    /**
     * Synchronise routes
     * @param {string} [locale]
     * @returns {Promise}
     */
    sync(locale) {
        var locales = [].concat(locale || i18n.locale);
        return new Promise((resolve, reject) => {
            i18n.sync(locales, this.file).then(() => {
                _.each(locales, (locale) => {
                    if (this.locales.indexOf(locale) === -1) {
                        this.locales.push(locale);
                        _.each(this.routes, (controller, route) => {
                            var routeName = route;
                            // Fix guid issue
                            if (route !== "guid") {
                                // Add / Refresh
                                route = i18n.localize(route, null, this.file, locale);
                                
                                route = (this.path + route).replace(/\/\//, '/');
                                logger.log('router', 'Add', route);
                                page(route, (ctx) => {
                                    async.each(this.middleware, function (middleware, callback) {
                                        middleware(ctx, callback);
                                    }, () => {
                                        controller(ctx);
                                        this.route = routeName;
                                        this.ctx = ctx;
                                        this.emit('change');
                                    });
                                });
                            }
                        });
                    }
                });

                resolve();
            }).catch(reject);
        });
    }

    /**
     * Go to the route or link
     * @param {String|HTMLElement} href
     * @param {String} [target] (default: _self)
     */
    goto(href, target) {
        href = _.isString(href) ? href : $(href).attr('href');
        target = _.isString(target || TARGET.SELF) ? target || TARGET.SELF : $(target).attr('target');

        // Self
        if (target === TARGET.SELF) {
            if (href.indexOf('://') === -1) {
                page((href.indexOf('/') === 0?'':'/')+href);
            }
            else {
                window.location.href = href;
            }
        }
        // Blank
        else {
            window.open(href);
        }
    }

    /**
     * Get route with route name
     * @param {String} name
     * @param {params} [params]
     * @param {locale} [locale]
     * @return {string|Promise}
     */
    getRoute(name, params, locale) {
        params = params || {};

        // Setup params
        var setup = (route) => {
            _.each(params, function (param, key) {
                route = route.replace(new RegExp(':' + key + '(\\?|\\*)?', 'i'), param);
            });
            return (this.path + route).replace(new RegExp('/?:[a-z0-9]+\\??', 'ig'), '').replace(/\/\//g, '/');
        };

        // With locale
        if (locale) {
            return new Promise((resolve, reject) => {
                this.sync(locale).then(() => {
                    resolve(setup(i18n.localize(name, null, this.file, locale)));
                });
            });
        }
        // Current locale
        else {
            return setup(i18n.localize(name, {}, this.file));
        }
    }

    /**
     * Test if the route is register
     * @param {string} [locale]
     */
    hasLocale(locale) {
        locale = locale || i18n.locale;
        return i18n.hasFile(this.file, locale);
    }
}

export var router = new Router();
/**
 * DAN Frameworks
 * [default] Dev server
 * [build] Build project
 */

// Config
var config = require('./gulp.config.js');
var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch')
var replace = require('gulp-replace');
var jsonminify = require('gulp-jsonminify');
var prompt = require('gulp-prompt');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');
var htmlmin = require('gulp-html-minifier');
var webpack = require('webpack');
var express = require('express');
var tinylr = require('tiny-lr')();
var del = require('del');
var async = require('async');
var fs = require('fs');
var _ = require('lodash');
var minimist = require('minimist');
var ftp = require('vinyl-ftp');
var runSequence = require('run-sequence');
var notifier = require('node-notifier');

// Argv
var argv = require('minimist')(process.argv.slice(2));
if (argv.debug) {
    config.debug = argv.debug || config.debug;
    gutil.log('Debug mode', gutil.colors.green('On'));

    // Webpack
    config.webpack.resolve.alias.react = config.webpack.resolve.alias.react.replace('.min', '');
    config.webpack.resolve.alias['react-dom'] = config.webpack.resolve.alias['react-dom'].replace('.min', '');
    config.webpack.module.noParse[0] = config.webpack.module.noParse[0].replace('.min', '');
}
if (argv.remote) {
    config.remote = argv.remote || config.remote;
    gutil.log('Remote env', gutil.colors.magenta(config.remote));
}
if (argv.path) {
    config.path.project = argv.path;
    gutil.log('Project path', gutil.colors.magenta(config.path.project));
}

// Locales
var exclude = ['.DS_Store', 'thumbs.db'];
_.each(fs.readdirSync(config.path.locales), function (locale) {
    if (exclude.indexOf(locale) === -1) {
        config.locales.push(locale);
    }
});

// Build
gulp.task('build', [
    'prompt:path'
], function (callback) {
    var tasks = [];

    // Clean
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('clean'), '...');

        del([config.path.tmpDist, config.path.dist], {
            dot: true
        }).then(function () {
            callback();
        });
    });

    // Copy
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('copy src'), '...');

        gulp.src(config.path.src + '**/*')
            .pipe(gulp.dest(config.path.tmpDist))
            .on('end', callback)
    });

    // Path
    tasks.push(function (callback) {
        _.each(config.webpack.resolve.alias, function (path, key) {
            config.webpack.resolve.alias[key] = path.replace(config.path.src, __dirname + '/' + config.path.tmpDist);
        });
        callback();
    });

    // Config CSS
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('setup css'), '...');

        return gulp.src(config.path.tmpDist + 'config/styles.scss')
            .pipe(replace(/\$path: '\/';/g, "$path: '" + config.path.project + "';"))
            .pipe(gulp.dest(config.path.tmpDist + 'config'))
            .on('end', callback);
    });

    // Setup modules
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('setup modules'), '...');
        setupModules(callback);
    });

    // Webpack
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('webpack'), '...');

        config.webpack.output.path = config.path.dist + '/js/';
        config.webpack.output.publicPath = config.path.project + 'js/';
        config.webpack.entry.main = config.path.tmpDist + "/main.js";

        webpack(config.webpack).run(function (err, stats) {
            if (err) {
                gutil.log(gutil.colors.red(err));
            }
            callback();
        });
    });

    // Uglify
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('uglify'), '...');

        gulp.src(config.path.dist + '**/*')
            .pipe(uglify())
            .pipe(size({
                showFiles: true,
                gzip: true
            }))
            .pipe(gulp.dest(config.path.dist))
            .on('end', callback);
    });

    // Locales
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('copy locales'), '...');

        gulp.src(config.path.locales + '**/*')
            .pipe(jsonminify())
            .pipe(size({
                showFiles: true,
                gzip: true
            }))
            .pipe(gulp.dest(config.path.dist + 'locales'))
            .on('end', callback);
    });

    // Assets
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('copy assets'), '...');

        gulp.src(removeExcludeFiles(config.path.assets + '**/*', config.path.assets), {dot: true})
            .pipe(gulp.dest(config.path.dist))
            .on('end', callback)
    });

    // Images
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('imagemin'), '...');
        gulp.src(config.path.dist + '**/*.{jpg,jpeg,svg,png}')
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{
                    removeViewBox: false
                }],
                use: []
            }))
            .pipe(size({
                showFiles: true
            }))
            .pipe(gulp.dest(config.path.dist))
            .on('end', callback);
    });

    // Index
    tasks.push(function (callback) {
        gutil.log('Starting', gutil.colors.green('setup index'), '...');
        setupIndex(config.path.dist.replace(/\/$/, ''), callback, 'prod');
    });

    // Process
    async.series(tasks, function () {
        gutil.log(gutil.colors.green('Build complete ') + gutil.colors.magenta(config.path.dist));
        callback();
    })
});

gulp.task('prompt:path', function () {
    if (argv.path) {
        return true;
    }
    return gulp.src(config.path.assets + 'index.html')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'path',
            message: 'Enter project path',
            default: config.path.project
        }, function (res) {
            config.path.project = res.path;
        }));
});

// Dev
gulp.task('default', [
    'dev:server'
], function () {
    gutil.log('Dev server ' + gutil.colors.green('On'), gutil.colors.magenta('http://localhost:' + config.port.dev));
});

// Webpack watch
gulp.task('webpack:watch', function (callback) {
    del(config.path.tmp).then(function () {
        config.webpack.output.path = config.path.tmp + 'js/';
        config.webpack.devtool = 'inline-source-map';

        var compiler = webpack(config.webpack);
        var start = true;

        var reload = function (file) {
            // Livereload
            if (file) {
                process.stdout.write(".");
                tinylr.changed({
                    body: {
                        files: file ? [file.path] : []
                    }
                });
            }
        }, reloadIndex = function (file, callback) {
            setupIndex(config.path.tmp, function () {
                callback && callback(file);
            }, 'dev');
        }, reloadModules = function (file, callback) {
            setupModules(function () {
                callback && callback(file);
            });
        };

        // Error report
        var handleError = function () {};

        // Webpack
        var watcher;
        var watchWebpack = function() {
            setupModules(function() {
                watcher = compiler.watch({}, function (err, stats) {
                    if (err) {
                        return showError('Webpack', 'watch', err);
                    }

                    if (stats.hasErrors()) {
                        return showError('Webpack', 'compilation', stats.toString({
                            hash: false,
                            version: false,
                            timings: false,
                            assets: false,
                            chunks: false,
                            chunkModules: false,
                            modules: false,
                            cached: false,
                            reasons: false,
                            source: false,
                            errorDetails: true,
                            chunkOrigins: false,
                            modulesSort: false,
                            chunksSort: false,
                            assetsSort: false
                        }));
                    }

                    if (start) {
                        start = false;
                        reloadModules(null, function () {
                            reloadIndex(null, function () {
                                callback();
                            });
                        });
                    }
                    else {
                        reload({
                            path: 'js/main.js'
                        });
                    }
                });
            });
        };
        watchWebpack();

        // Assets
        watch(config.path.locales + '**/*', reload).on('error', handleError);
        watch(config.path.assets + '**/*', reload).on('error', handleError);

        // Index
        watch(config.path.assets + 'index.html', function (file) {
            reloadIndex(file, reload);
        }).on('error', handleError);

        // Modules
        watch(config.path.src + 'modules.json', function (file) {
            reloadModules(file, reload);
        });

        // Webpack
        watch(__dirname+'/webpack.config.js', function() {
            watcher.close(function() {
                watcher = watchWebpack();
            });
        });
    });
});

// Dev server
gulp.task('dev:server', [
    'webpack:watch'
], function (callback) {
    var app = express();

    // Livereload
    app.use(require('connect-livereload')({
        port: config.port.livereload
    }));

    // Assets
    app.use(express.static(config.path.tmp));
    app.use(express.static(config.path.assets));
    app.use('/locales', express.static(config.path.locales));

    // SRC
    app.get(/^\/js/, function (req, res) {
        res.sendFile(config.path.src + req.url.replace(/^\/?js/, ''));
    });

    // Routes
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/' + config.path.tmp + 'index.html');
    });

    app.listen(config.port.dev, function () {
        tinylr.listen(config.port.livereload);
        callback();
    }).on('error', expressError(config.port.dev));
});

// Dist server
gulp.task('build:server', [
    'build'
], function (callback) {
    var app = express();

    // Assets
    app.use(config.path.project, express.static(config.path.dist));

    // Routes
    app.get('*', function (req, res) {
        res.sendFile(config.path.dist + 'index.html');
    });

    app.listen(config.port.dist, function () {
        gutil.log('Server On http://localhost:' + config.port.dist + config.path.project);
        callback();
    }).on('error', expressError(config.port.dist));
});

// Deploy
gulp.task('deploy', function (cb) {
    var envs = loadJSON('./deploy.config.json');
    var list = _.keys(envs);
    if (config.remote) {
        if (list.indexOf(config.remote) === -1) {
            throw new Error(gutil.colors.red('Unknown remote environment: ') + gutil.colors.magenta(config.remote));
        }
        deploy(config.remote);
    }
    else {
        gulp.src('./deploy.config.json').pipe(
            prompt.prompt({
                type: 'list',
                name: 'name',
                message: 'Choose env to deploy',
                choices: list
            }, function (res) {
                deploy(res.name);
            }));
    }
    function deploy(name) {
        var env = envs[name];
        var conn = ftp.create({
            host: env.host,
            user: env.username,
            password: env.password,
            log: gutil.log
        });

        var globs = removeExcludeFiles(config.path.dist + "/**", config.path.dist);

        return gulp.src(globs, {base: config.path.dist, buffer: false, dot: true})
            .pipe(conn.dest(env.path))
            .on('end', cb);
    }
});

// Build & Deploy
gulp.task('build:deploy', function (cb) {
    runSequence('build', 'deploy', cb);
});

// Backup
gulp.task('backup', function (cb) {
    var envs = loadJSON('./deploy.config.json');
    var list = _.keys(envs);
    if (config.remote) {
        if (list.indexOf(config.remote) === -1) {
            throw new Error('Unknown remote', config.remote);
        }
        backup(config.remote);
    }
    else {
        gulp.src('./deploy.config.json').pipe(
            prompt.prompt({
                type: 'list',
                name: 'name',
                message: 'Choose env to backup',
                choices: list
            }, function (res) {
                backup(res.name);
            }));
    }
    function backup(name) {
        var env = envs[name];
        var conn = ftp.create({
            host: env.host,
            user: env.username,
            password: env.password,
            log: gutil.log
        });

        var folderName = name + '/' + getDate();
        return conn.src(env.path + '**', {dot: true})
            .pipe(gulp.dest(config.path.backup + folderName))
            .on('end', cb);
    }
});

/**
 * Setup index
 * @param {string} dest
 * @param {function} [callback]
 * @param {String} [env]
 */
function setupIndex(dest, callback, env) {
    return gulp.src(config.path.assets + 'index.html')
        .pipe(replace(/locales: \[\]/g, "locales: ['" + config.locales.join("','") + "']"))
        .pipe(replace(/locale: null/g, "locale: '" + config.locales[0] + "'"))
        .pipe(replace(/\{path\}/g, config.path.project))
        .pipe(replace(/\{env\}/g, env))
        .pipe(gulp.dest(dest))
        .on('end', callback);
}

/**
 * Setup modules
 * @param {function} [callback]
 */
function setupModules(callback) {
    var json = config.path.src + 'modules.json',
        js = config.path.src + 'bundles/dan/modules/modules.js';
    try {
        var modules = _.map(loadJSON(json), function (value, key) {
            return '"' + key + '": function() { return new Promise(function(resolve, reject) { require.ensure([], (require) => { resolve(require("' + value + '")); }); }); }';
        }).join(",");

        modules = 'export default { '+modules+' };';

        del(js).then(function () {
            fs.writeFile(js, modules, function (err) {
                if (err) {
                    throw err;
                }
                else {
                    callback();
                }
            });
        });
    }
    catch(error) {
        showError('Modules error', json, 'is not a valid JSON');
        callback();
    }
}

/**
 * Load JSON from path
 * @param {string} path
 */
function loadJSON(path) {
    if (!fs.existsSync(path)) {
        throw new Error(gutil.colors.red('File not found: ') + gutil.colors.magenta(path));
    }
    return JSON.parse(fs.readFileSync(path));
}

/**
 * Return the current date
 * @return {string}
 */
function getDate() {
    var date = new Date();
    return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1) + '-' + formatNumber(date.getDate()) + '-' + formatNumber(date.getHours()) + 'h' + formatNumber(date.getMinutes()) + 'm' + formatNumber(date.getSeconds()) + 's';
}

/**
 * Format the number to string
 * @param {int} number
 * @param {int} [size] (default: 2)
 */
function formatNumber(number, size) {
    size = size || 2;
    var output = number + '';

    while (output.length < size) {
        output = '0' + output;
    }

    return output;
}

/**
 * Remove excludes files from globs
 * @param {String|Array} globs
 * @param {String} path
 * @returns {Array}
 */
function removeExcludeFiles(globs, path) {
    var excludesFiles = exclude.map(function(file) {
        return '!'+path+file;
    });
    return excludesFiles.concat(globs);
}

/**
 * Express error callback
 * @param {int} port
 * @return {function}
 */
function expressError(port) {
    return function(err) {
        if(err.code === 'EADDRINUSE') {
            showError('Express', 'Port', gutil.colors.magenta(port)+' already in use')
        }
        else {
            throw err;
        }
    }
}

function showError(title, type, description) {
    notifier.notify({
        title: title,
        message: type+' error',
        icon: __dirname+'/docs/danFW/dan.png'
    });
    return gutil.log(title, gutil.colors.red('error'), type, description);
}
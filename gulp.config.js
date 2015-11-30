module.exports = {
    debug: false,
    locales: [],
    webpack: require('./webpack.config.js'),
    port: {
        dev: 9000,
        dist: 9000,
        livereload: random(__dirname, 0, 32000)+32000,
        remote: null
    },
    path: {
        project: '/',
        dist: __dirname+'/dist/',
        src: __dirname+'/src/',
        assets: __dirname+'/assets/',
        locales: __dirname+'/locales/',
        tmp: './.tmp/',
        tmpDist: './.tmp-dist/',
        backup: __dirname+'/backup/'
    }
};

// Random hash
function random(hash, min, max) {
    var hashCode = function(str) {
        var hash = 0;
        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };
    return (hashCode(hash) % (max - min)) + min;
}
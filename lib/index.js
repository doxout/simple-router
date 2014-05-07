var stack = require('connect-stack');
var compile = require('./compile');
var Promise = require('bluebird');
var reqMixins = require('./req-mixins');


function filter(test, mw) {
    if (mw.length <= 3)
        return function reqFilter(req, res, next) {
            var match = test(req)
            if (!match) return next();
            return mw(req, res, next);
        }
    else
        return function reqFilter(err, req, res, next) {
            var match = test(req)
            if (!match) return next(err);
            return mw(err, req, res, next);
        }
}

function tryCatchMw(mw, req, res, next) {
    try {
        return mw(req, res, next);
    } catch(e) {
        next(e);
    }
}

function tryCatchMw2(mw, err, req, res, next) {
    try {
        return mw(err, req, res, next);
    } catch(e) {
        next(e);
    }
}



function bind1(f, o) { return function(a) { return f.call(o, a); } }

function wrap(mw) {
    if (typeof(mw) !== 'function')
        throw new TypeError('Invalid middleware, must be a function');

    var mwlen = mw.length;
    if (mwlen <= 3) {
        return function wrapped(req, res, next) {
            var promise = tryCatchMw(mw, req, res, next);
            if (promise != null && typeof(promise.then) === 'function')
                Promise.cast(promise).bind(res).then(res.answer, next);
        }
    }
    else {
        return function wrapped(err, req, res, next) {
            var promise = tryCatchMw2(mw, err, req, res, next);
            if (promise != null && typeof(promise.then) === 'function')
                Promise.cast(promise).bind(res).then(res.answer, next);
        }
    }
}

function createMethodFilter(method, match) {

    return function filter(req) {
        if (method !== 'ALL' && req.method !== method) return false;
        var matches = match(req.path);
        if (matches != null && matches.names !== null) {
            for (var k = 0; k < matches.names.length; ++k)
                if (matches.names[k] != null)
                    req.params[matches.names[k]] = matches.values[k];
        }
        return matches;
    }
}

function createUseFilter(path) {
    return function filter(req) {
        for (var k = 0; k < path.length; ++k)
            if (req.url.charCodeAt(k) !== path.charCodeAt(k))
                return false;
        if (!req.originalUrl) req.originalUrl = req.url;
        req.url = req.url.slice(path.length);
        return true;
    }
}

function Router() {
    if (!(this instanceof Router))
        return new Router();
    this.route = stack();
    this.route.push(reqMixins);

}
function reportError(err) {
    if (!err) {
        err = new Error("Not found");
        err.code = 404;
    }
    if (err.stack)
        console.error(err.stack);
    else
        console.error(err);
}

Router.prototype.server = function Router$server() {
    var self = this;
    return function createdServer(req, res, next) {
        self.route(req, res, next || reportError);
    }
}

var methods = ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'PATCH', 'HEAD', 'ALL'];

methods.forEach(function eachMethod(method) {
    Router.prototype[method.toLowerCase()] = function Router$addHandler(path) {
        if (typeof(path) !== 'string')
            throw new TypeError("Only string paths are supported");
        var middlewares = [].slice.call(arguments, 1);
        var mw = filter(createMethodFilter(method, compile(path)),
                        stack(middlewares.map(wrap)));

        this.route.push(mw);
    }
});

Router.prototype.use = function Router$use(path) {
    var haspath = (typeof(path) === 'string');
    var middlewares = [].slice.call(arguments, haspath ? 1 : 0);
    var mw = stack(middlewares.map(wrap));
    if (haspath)
        mw = filter(createUseFilter(path), mw);
    this.route.push(mw);
}

module.exports = Router;

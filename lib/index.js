
var stack = require('connect-stack');
var XRegExp = require('xregexp').XRegExp;
var compile = require('./compile');
var Promise = require('bluebird');

function filter(test, mw) {
    return function(req, res, next) {
        var match = test(req) 
        if (match === null) return next();
        return mw(req, res, next);
    }
}


function wrap(mw) {
    if (typeof(mw) !== 'function')
        throw new TypeError('Invalid middleware, must be a function');
    
    return function(req, res, next) {
        var promise = mw(req, res, next);
        if (promise != null && typeof(promise.then) === 'function')
            Promise.cast(promise).bind(res).then(res.answer, res.answer);
    }
}



function createFilter(method, regex) {
    return function filter(req) {
        if (method !== null && req.method !== method) 
            return false;
        var match = regex.xexec(req.url);
        if (match === null) return false;
        return match;
    }
}

function Router() {
    this.route = stack();
    var self = this;
}

['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'PATCH', 'HEAD'].forEach(function(method) {
    Router.prototype[method.toLowerCase()] = function(path) {
        var middlewares = [].slice.call(arguments, 1);
        var mw = filter(createFilter(method, compile(path)), 
                        stack(middlewares.map(wrap)));
        this.route.push(mw);
    }
});





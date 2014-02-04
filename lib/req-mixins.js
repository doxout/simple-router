var answer = require('./answer');
var url = require('fast-url-parser');
var querystring = require('querystring');

var ReadableStream = require('stream').Readable;

module.exports = function reqMixins(req, res, next) {
    var parsed;
    if ((parsed = req._parsedUrl) == null) {
        var parseWhich = req.originalUrl != null ? req.originalUrl : req.url;
        parsed = url.parse(parseWhich);
        if (parsed.auth && !parsed.protocol && ~parsed.href.indexOf('//')) {
            // This parses pathnames, and a strange pathname like //r@e should work
            parsed = url.parse(req.url.replace(/@/g, '%40'));
        }
        req._parsedUrl = parsed;
    }
    if (req.query == null && req._parsedUrl.query !== null) {
        req.query = querystring.parse(parsed.query);
    }
    if (req.params == null) {
        req.params = {}; 
    }
    if (req.originalUrl != null) {
        req.path = req._parsedUrl.pathname
            .substr(req.originalUrl.length - req.url.length);
    } else {
        req.path = req._parsedUrl.pathname;
    }
    if (typeof(res.answer) !== 'function')
        res.answer = answer;
    next();
}



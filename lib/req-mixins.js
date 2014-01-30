var answer = require('./answer');
var url = require('fast-url-parser');
var querystring = require('querystring');

var ReadableStream = require('stream').Readable;

module.exports = function reqMixins(req, res, next) {
    var parsed;
    if ((parsed = req._parsedUrl) == null) {
        parsed = url.parse(req.url);
        if (parsed.auth && !parsed.protocol && ~parsed.href.indexOf('//')) {
            // This parses pathnames, and a strange pathname like //r@e should work
            parsed = url.parse(req.url.replace(/@/g, '%40'));
        }
        req._parsedUrl = parsed;
    }
    if (req.query == null && parsed.query !== null) {
        req.query = querystring.parse(parsed.query);
    }
    if (typeof(res.answer) !== 'function')
        res.answer = answer;
    next();
}



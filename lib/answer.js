
var nenv = process.env['NODE_ENV'];
var ReadableStream = require('stream').Readable;

function fixargs(code, headers, data) {
    var ans, ctype;
    if (data == null) {
        data = headers;
        headers = {};
    }
    if ((data == null) && typeof code !== 'number') {
        data = code;
        code = 200;
    }
    if (typeof data === 'string') {
        ctype = 'text/html; charset=utf-8';
    } else if (data instanceof Error) {
        code = data.code || 500;
        ctype = 'application/json';
        ans = {
            message: data.message
        };
        if (nenv === 'development' || nenv === 'test') {
            ans.stack = data.stack;
            ans.stackPlus = new Error().stack;
        }
        data = JSON.stringify(ans);
    } else if ((data != null) && 
               !(data instanceof Buffer) && 
               (typeof(data.pipe)  !== 'function')) {
        ctype = 'application/json';
        data = JSON.stringify(data);
    }
    if (ctype != null && !headers['content-type']) {
        headers['content-type'] = ctype;
    }
    return {
        code: code,
        headers: headers,
        data: data
    };
}

module.exports = function answer(code, headers, data) {
    var args = fixargs(code, headers, data);
    this.writeHead(args.code, args.headers);
    if (args.data != null) {
        if (typeof(args.data.pipe) === 'function')
            args.data.pipe(this);
        else
            this.end(args.data);
    } else {
        this.end();
    }
}


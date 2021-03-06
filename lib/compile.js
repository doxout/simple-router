
var reg = /^\/([:*])([^/]+)$/;

var translate = require('./flask-compat');

function compileSegment(names, types) {
    return function (segment) {
        if (reg.test(segment)) {
            return segment.replace(reg, function replacer(match, kind, name) {
                types.push(kind);
                names.push(name);
                if (kind === '*') {
                    names.push(null);
                    return '(([/].*)?)[/]?';
                }
                return '[/]([^/]+)[/]?';
            });
        } else {
            // escape regex
            return segment.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        }
    }
}

function compile(path) {
    if (/<.+>/.test(path))
        path = translate(path);
    var names = [], types = [];
    var compiled = path.match(/([/][^/]*)/g)
        .map(compileSegment(names, types))
        .join('');
    var xreg = new RegExp('^' + compiled + '$');
    return function test(str) {
        if (str === null) return null;
        var m = str.match(xreg);
        if (!m) return null;
        return {
            names: names,
            values: m.slice(1)
        };
    };
}

module.exports = compile;

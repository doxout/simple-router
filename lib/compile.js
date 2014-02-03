
var reg = /\/([:*])([^/]+)/g;

var translate = require('./flask-compat');

function compile(path) {
    if (/<.+>/.test(path)) 
        path = translate(path);
    var names = [];
    var compiled = path.replace(reg, function replacer(match, kind, name) {
        names.push(name);
        if (kind == ':')
            return '[/]([^/]+)[/]?' 
        else
            return '[/]?(.*)[/]?' 
    });
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

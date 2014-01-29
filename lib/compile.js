
var reg = /\/([:*])([^/]+)/g;

function compile(path) {
    var names = [];
    var compiled = path.replace(reg, function replacer(match, kind, name) {
        names.push(name);
        var segmentMatch = kind == ':' ? '[^/]' : '.'; 
        return '[/]?(' + segmentMatch + '*)[/]?' 
    });
    var xreg = new RegExp('^' + compiled + '$');
    return function(str) {
        if (str === null) return null;       
        var m = str.match(xreg);
        if (!m) return null;
        var o = {};
        for (var k = 0; k < names.length; ++k) {
            o[names[k]] = m[k+1];
        }
        return o;
    };
}

module.exports = compile;

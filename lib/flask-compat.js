
var warned = false;

// backward-compat with flask router
function translate(path) {
    var replacement = path
        .replace(/<path(\([^)]+\))?:([^>]+)>/g, '/*$2')
        .replace(/<([^:>]*:)?([^>]+)>/g, ':$2')
    if (!warned) {
        warned = true;
        var stack = new Error().stack.split('\n').slice(3).join('\n');
        console.warn("Warning, simple-router obsoletes flask-style routes. ");
        console.warn("The route", path);
        console.warn("can be rewritten like this:", replacement);
        console.warn("Subsequent warnings will be supressed");
        console.warn(stack);
    }
    return replacement;
}

module.exports = translate;


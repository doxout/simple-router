
// backward-compat with flask router
function translate(path) {
    return path
        .replace(/<([^:(>]+)(\([^)]+\))?:path>/g, '/*$1')
        .replace(/<([^:>]+):?[^>]*>/g, ':$1')
}

module.exports = translate;


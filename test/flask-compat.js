var t = require('blue-tape');
var translate = require('../lib/flask-compat');

function translates(x, y) {
    t.test(x, function(t) {
        t.equals(translate(x), y, 'should translate correctly');
        t.end();
    });
}

translates('/a/<b>/c', '/a/:b/c');
translates('/a/<b>', '/a/:b');
translates('/a/<b>/<c>', '/a/:b/:c');
translates('/a<path:b>/c', '/a/*b/c');
translates('/a<path(optional=true):b>/c', '/a/*b/c');
translates('/a<path:b>/<c>', '/a/*b/:c');
translates('/a/<notpath:path>', '/a/:path');


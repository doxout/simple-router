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
translates('/a<b:path>/c', '/a/*b/c');
translates('/a<b(optional=true):path>/c', '/a/*b/c');
translates('/a<b:path>/<c>', '/a/*b/:c');
translates('/a/<b:notpath>', '/a/:b');


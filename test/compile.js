var t = require('blue-tape');
var compile = require('../lib/compile');

function matches(b, route, path, params) {
    if (b !== false) {
        params = path; path = route; route = b; b = true;
    }
    t.test(route + ' -> ' + path, function(t) {
        if (b) {
            var extract = compile(route)(path);
            t.ok(extract, 'should match');
            if (params) {
                var o = {};
                for (var k = 0; k < extract.names.length; ++k) 
                    o[extract.names[k]] = extract.values[k];
                t.deepEquals(o, params);
            }

        } else {
            t.notOk(compile(route)(path), 'should not match');
        }        
        t.end();
    });
}

matches('/a/:b', '/a/b', {b:'b'});
matches('/a/:b', '/a/b/', {b:'b'});

matches(false, '/a/:b', '/a');
matches(false, '/a/:b', '/a/');

matches('/a/*b', '/a',    {b:''});
matches('/a/*b', '/a/',   {b:''});
matches('/a/*b', '/a/b',  {b:'b'});
matches('/a/*b', '/a/b/', {b:'b/'});
matches('/a/*b', '/a/b/c',{b:'b/c'});


matches('/a/:b/:c', '/a/b/c',  {b:'b', c:'c'});
matches('/a/:b/:c', '/a/b/c/', {b:'b', c:'c'});

matches('/a/*b/:c', '/a/b/c/d', {b:'b/c', c: 'd'});
matches('/a/*b/:c', '/a/d',     {b: '', c:'d'});
matches('/a/*b/:c', '/a/b/d',   {b:'b', c:'d'});


matches('/a/$b/:c', '/a/$b/c', {c: 'c'});


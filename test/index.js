var t = require('blue-tape');
//var t = require('tape');
var Promise = require('bluebird');
var router = require('../lib/index');



var app = router();

app.post('/error', function(req, res) {
    res.answer(new Error("Unable to post found"));
});

app.get('/throw', function(req, res) {
    throw new Error("Thrown error");
});

app.get('/string', function(req, res) {
    res.answer(req.query.content);
});

app.get('/stream', function(req, res) {
    res.answer(through());
});


app.get('/file/*path/:id', function(req, res) {
    console.log("/file/path/id/id route");
    console.log(req.query);
    return Promise.cast(req.query);
});

app.use('/specific', function(req, res, next) {
    req.throughSpecific = true;
    next();
});

app.get('/specific/throw', function(req, res) {
    throw new Error("Thrown error at /specific");
});

app.get('/specific/throw', function(err, req, res, next) {
    res.answer({
        caughtSpecific: true, 
        throughSpecific: req.throughSpecific
    });
});

app.get('/flask<path:path>/<id>', function(req, res) {
    res.answer(req.query);
});


app.use(function(err, req, res, next) {
    res.answer(err);
});

function test(method, url) {
    var defer = Promise.defer();
    var data = [], code, headers;
    function head(code_, headers_) {
        code = code_;
        headers = headers_;
    }
    function write(d) {
        if (d) data.push(d.toString());
    }
    function end(d) {
        write(d);
        defer.resolve({code: code, headers: headers, body: data.join('')});
    }
    app.route({
        method: method,
        url: url,
    }, {
        writeHead:head,
        write: write,
        end: end
    }, function(err) {
        console.error("Error managed to get through");
        if (err) defer.reject(err);
        else defer.reject(new Error("No route was hit"));
    });
    return defer.promise;
}


t.test('simple test', function(t) {
    return test('GET', '/file/path/to/id/123?test=1').then(function(res) {
        var j = JSON.parse(res.body);
        t.equals(j.path, 'path/to/id')
        t.equals(j.id, '123')
        t.equals(j.test, '1')
    });
});


t.test('error response', function(t) {
    return test('POST', '/error').then(function(res){
        var j = JSON.parse(res.body);
        t.ok(j.message, 'should have an error message');
    });
});


t.test('throw response', function(t) {
    return test('GET', '/throw').then(function(res) {
        var j = JSON.parse(res.body);
        t.ok(j.message, 'should have an error message');
    });
});

t.test('throw response with specific MW', function(t) {
    return test('GET', '/specific/throw').then(function(res) {
        var j = JSON.parse(res.body);
        t.ok(j.throughSpecific, 'should have went through /specific');
        t.ok(j.caughtSpecific, 'should be caught by /specific/throw');
    });
});


t.test('adding invalid middelware', function(t) {
    t.throws(function() {
        app.use('string', 'string');
    }, 'should throw with invalid middleware');
    t.end();
});


t.test('string response', function(t) {
    return test('GET', '/string?content=hello').then(function(res) {
        t.equals(res.body, 'hello', 'should answer with the same content');
        t.end();
    });
});

t.test('flask route', function(t) {
    return test('GET', '/flask/to/some/id').then(function(res) {
        var j = JSON.parse(res.body);
        t.equals(j.path, 'to/some', 'should extract path');
        t.equals(j.id, 'id', 'should extract id');
        t.end();
    });
});


//TODO: test stream

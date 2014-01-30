var t = require('blue-tape');
var Promise = require('bluebird');
var router = require('../lib/index');

var app = router();


app.get('/file/*path/id/:id', function(req, res) {
    console.log("/file/path/id/id route");
    console.log(req.query);
    return Promise.cast(req.query);
});

app.post('/p', function(req, res) {
    res.answer(new Error("Unable to post found"));
});
app.get('/p', function(req, res) {
    return Promise.cast("p");
});

function test(method, url) {
    return new Promise(function(resolve, reject) {
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
            resolve({code: code, headers: headers, body: data.join('')});
        }
        app.route({
            method: method,
            url: url,
        }, {
            writeHead:head,
            write: write,
            end: end
        }, function(err) {
            if (err) reject(err);
            else reject(new Error("No route was hit"));
        });
    });
}


t.test('simple test', function(t) {
    return test('GET', '/file/path/to/id/123?test=1').then(function(res) {
        var j = JSON.parse(res.body);
        t.equals(j.path, 'path/to')
        t.equals(j.id, '123')
        t.equals(j.test, '1')
    });
});



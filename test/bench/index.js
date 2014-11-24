var Promise = require('bluebird');
var router = require('../../lib/index');

var app = router();


var o = {
    then: function(f, r) {
        f({hello: 'World'});
        return this;
    }
}

app.get('/file/*path/id/:id', function(req, res) {
    return Promise.cast(req.query);
});

app.use('/test', function(req, res) {
    res.end(JSON.stringify({hello: 'World'}));
});

app.use('/answer', function(req, res) {
    res.answer({hello: 'World'});
});

app.use('/promise', function(req, res) {
    return Promise.resolve({hello: 'World'});
});

app.use('/thenable', function(req, res) {
    return o;
});


app.use('/exit', function() {
    process.exit();
});

require('http').createServer(app.server()).listen(8001);
require('http').createServer(function(req, res) {
    res.end(JSON.stringify({"hello":"world"}));
}).listen(8002);


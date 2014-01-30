var Promise = require('bluebird');
var router = require('../../lib/index');

var app = router();

app.get('/file/*path/id/:id', function(req, res) {
    return Promise.cast(req.query);
});

app.use('/test', function(req, res) {
    res.end(JSON.stringify({hello: 'World'}));
});

app.use('/answer', function(req, res) {
    res.answer({helo: 'World'});
});

app.use('/promise', function(req, res) {
    return Promise.cast({helo: 'World'});
});

app.use('/exit', function() {
    process.exit();
});

require('http').createServer(app.server()).listen(8001);


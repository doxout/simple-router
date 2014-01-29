# promised router

Simple-router is a middleware-compatible router with
promises support.

```js
var app = simpleRouter();

app.use(middleware);

// modifies req.url
app.use('/path', middleware);
app.use('/path', middleware1, middleware2);

// doesnt modify anything
app.get('/user/:id', authMiddleware, function(req) {
  // supports returning promises
  return User.get(req.query.id);
});

// supports complex path specifiers
app.get('/file/*path/:version', function(req) {
    return File.for(req.query.path).getVersion(req.query.version);
});

// supports GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
// also supports ALL

```

# simple router

Simple-router is a middleware-compatible router with support for promises.

# example

```js
var app = simpleRouter();

app.use(middleware);

// modifies req.url
app.use('/path', middleware);
app.use('/path', middleware1, middleware2);

// doesnt modify req.url
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

http.createServer(app.server()).listen(8081);

```

# api

### app.use([path], middleware...)

Install a sub-router or a global middleware. req.url will be rewritten


### app.<method>(routeSpec, middleware...)

Add a handler for the specified method that calls the specified middleware 
function.

Express and connect middleware should work.

Middleware functions may also return a promise. Promise results are handled
via the response mixin `res.answer`

## req mixins

### `req.originalUrl` 

Useful if the router was installed using `someRouter.use('/path', otherRouter)`.
In those cases, `req.url` will be rewritten within `otherRouter`. The segment 
`'/path'` will be removed from the url. You can use req.originalUrl to access 
the original url.

### `req.path`

The path part of req.url without the query string

### `req.query`, `req.params`

The query parameters of `req.url`, as well as any named parameters contained in
the path as matched by the route spec. For example

`app.get('/post/:id')`

will result with the addition of `req.query.id`

## res mixins

### res.answer([code], [headers], data)

Send a response. Available types for data:

* Buffer - Sent as is
* Stream - Piped to the response
* Error e - Sends the error to the client. 
  * e.code becomes the status code. Defaults to 500 
  * `content-type` hedaer becomes `text/json` if unspecified
  * data contains:
    * message - the error message
    * stack - the error stack (only `NODE_ENV=development` or `NODE_ENV=test`)
* String - sent as is
  * assumes hedaers `content-type: text/html; charset=utf-8` unless specified

All types except `Error` default to error code 200.


# route specs

Route specs are strings. The following syntax is currently supported

### `/base/:name` 

Matches one path segment. 

Examples: 
* `/base/` - doesnt match
* `/base/2` - results with `req.query.name = req.params.name = 2`
* `/base/2/` - same as above 
* `/base/2/b` - doesnt match

### `/base/*name`

Matches zero or more path segments

Examples:
* `/base` -> `{name: ''}`
* `/base/` -> `{name: ''}`
* `/base/path` -> `{name: 'path'}`
* `/base/path/` -> `{name: 'path'}`
* `/base/path/to/` -> `{name: 'path/to'}`

# license

MIT


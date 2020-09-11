express-urlredirect
==================

URL redirect middleware for express.


```shell
yarn install express-urlredirect
npm install --save express-urlredirect
```


## Examples

Redirect using a regular expression, redirecting `/i123` to `/items/123`.

```js
app.use(redirect(/^\/i(\w+)/, '/items/$1'));
```

Redirect specifying status code, redirecting `/i123` to `/items/123` with status code 302.

```js
app.use(redirect(/^\/i(\w+)/, '/items/$1', 302));
```

Rewrite using route parameters, references may be named
or numeric. For example redirect `/foo..bar` to `/commits/foo/to/bar`:

```js
app.use(redirect('/:src..:dst', '/commits/$1/to/$2'));
app.use(redirect('/:src..:dst', '/commits/:src/to/:dst'));
```

You may also use the wildcard `*` to soak up several segments,
for example `/js/vendor/jquery.js` would become
`/public/assets/js/vendor/jquery.js`:

```js
app.use(redirect('/js/*', '/public/assets/js/$1'));
```

In the above examples, the original query string (if any) is left untouched.
The regular expression is applied to the full url, so the query string
can be modified as well:

```js
app.use(redirect('/file\\?param=:param', '/file/:param'))
```

The query string delimiter (?) must be escaped for the regular expression
to work.

## New in version 1.1

```js
app.use(redirect('/path', '/anotherpath?param=some'))
```

now updates req.query, so `req.query.param == 'some'`.


## New in version 1.2

redirect can be used as a route middleware as in
```js
app.get('/route/:var', redirect('/rewritten/:var'));

app.get('/rewritten/:var', someMw);
```

Instead of passing control to next middleware, it passes control to next route.


## Debugging

Set environment variable `DEBUG=express-urlredirect`

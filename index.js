const debug = require('debug')('express-urlredirect');
const { pathToRegexp, parse } = require('path-to-regexp');
const URL = require('url');

module.exports = redirect;

/**
 * Redirect `src` to `dst`.
 *
 * @param {String|RegExp} src
 * @param {String} dst
 * @param {Number} statusCode
 * @return {Function}
 * @api public
 */

function redirect(src, dst, statusCode) {
  let re;
  let map;
  const fixedSrc = typeof src === 'string' ? src.replace(/\*$/, '(.*)') : src;
  if (dst) {
    re = pathToRegexp(fixedSrc, []);
    map = parse(fixedSrc).map(entry => entry.name).filter(Boolean);
    debug(`redirect ${fixedSrc} -> ${dst}`);
  } else {
    debug(`redirect current route -> ${fixedSrc}`);
  }

  return function(req, res, next) {
    const orig = req.url;
    let match;
    if (dst) {
      match = re.exec(orig);
      if (!match) {
        return next();
      }
    }
    let newUrl = (dst || src).replace(/\$(\d+)|(?::(\w+))/g, function(
      _,
      n,
      name
    ) {
      if (name) {
        if (match) return match[map.indexOf(name) + 1];
        else return req.params[name];
      } else if (match) {
        return match[n];
      } else {
        return req.params[n];
      }
    });
    debug(`redirect ${orig} -> ${newUrl}`);
    let query = {};
    if (newUrl.indexOf('?') > 0) {
      query = URL.parse(newUrl, true).query;
      debug('redirect updated new query', query);
      newUrl = newUrl.slice(0, newUrl.indexOf('?'));
    }
    const newUrlWithQuery = URL.format({
      pathname: newUrl,
      query,
    });
    if (statusCode) {
      return res.redirect(statusCode, newUrlWithQuery);
    }
    return res.redirect(newUrlWithQuery);
  };
}
import debugFunc from 'debug';
import * as express from 'express';
import { pathToRegexp, parse, Path } from 'path-to-regexp';
import URL from 'url';

const debug = debugFunc('express-urlredirect');

type Maybe<T> = T | null | undefined;

/**
 * Redirect `src` to `dst`.
 *
 * @param {String|RegExp} src
 * @param {String} dst
 * @param {Number} statusCode
 * @return {Function}
 * @api public
 */

export default function redirect(src?: string, dst?: string, statusCode?: number) {
  let re: RegExp;
  let map;
  const fixedSrc = src?.replace(/\*$/, '(.*)') ?? '';
  if (dst) {
    re = pathToRegexp(fixedSrc, []);
    map = parse(fixedSrc)
      .map(entry => (typeof entry === 'string' ? '' : entry?.name))
      .filter(Boolean);

    debug(`redirect ${fixedSrc} -> ${dst}`);
  } else {
    debug(`redirect current route -> ${fixedSrc}`);
  }

  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const orig = req.url;
    let match;
    if (dst) {
      match = re.exec(orig);
      if (!match) {
        return next();
      }
    }
    let newUrl = (dst ?? src ?? '').replace(/\$(\d+)|(?::(\w+))/g, function (_, n, name) {
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

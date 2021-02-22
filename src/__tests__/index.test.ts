import redirect from '../';

describe('redirect tests', () => {
  let redirectFunc;
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      url: '/',
      params: {},
      query: {},
    };
    res = {
      redirect: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function testNegativeCase(redirectFunc, req, res, next) {
    req.url = '/otherPath';

    redirectFunc(req, res, next);

    expect(res.redirect).not.toHaveBeenCalled();
  }

  describe('redirecting with a status code', () => {
    beforeEach(() => {
      redirectFunc = redirect('/foo', '/bar', 301);
    });

    it('redirects if path matches', () => {
      req.url = '/foo';
      redirectFunc(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(301, '/bar');
    });

    it('does not redirect if path does not match', () => {
      testNegativeCase(redirectFunc, req, res, next);
    });
  });

  describe('redirecting using route parameters (capture group)', () => {
    beforeEach(() => {
      redirectFunc = redirect('/:src..:dst', '/commits/$1/to/$2');
    });

    it('redirects if path matches', () => {
      req.url = '/foo..bar';

      redirectFunc(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/commits/foo/to/bar');
    });

    it('does not redirect if path does not match', () => {
      testNegativeCase(redirectFunc, req, res, next);
    });
  });

  describe('redirecting using route parameters (named parameters)', () => {
    beforeEach(() => {
      redirectFunc = redirect('/:src..:dst', '/commits/:src/to/:dst');
    });

    it('redirects if path matches', () => {
      req.url = '/foo..bar';

      redirectFunc(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/commits/foo/to/bar');
    });

    it('does not redirect if path does not match', () => {
      testNegativeCase(redirectFunc, req, res, next);
    });
  });

  describe('using the wildcard * to soak up several segments', () => {
    beforeEach(() => {
      redirectFunc = redirect('/js/*', '/public/assets/js/$1');
    });

    it('redirects if path matches', () => {
      req.url = '/js/vendor/jquery.js';

      redirectFunc(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/public/assets/js/vendor/jquery.js');
    });

    it('does not redirect if path does not match', () => {
      testNegativeCase(redirectFunc, req, res, next);
    });
  });

  describe('redirecting the url using the original query string', () => {
    beforeEach(() => {
      redirectFunc = redirect('/file\\?param=:param', '/file/:param');
    });

    it('redirects if path matches', () => {
      req.url = '/file?param=file1';

      redirectFunc(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/file/file1');
    });

    it('does not redirect if path does not match', () => {
      testNegativeCase(redirectFunc, req, res, next);
    });
  });

  describe('adding query parameters to the query object output', () => {
    beforeEach(() => {
      redirectFunc = redirect('/path', '/anotherpath?param=some');
    });

    it('adds to query parameters if path matches', () => {
      req.url = '/path';

      redirectFunc(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/anotherpath?param=some');
    });

    it('does not add to query parameters if path does not match', () => {
      testNegativeCase(redirectFunc, req, res, next);
      expect(req.query).toEqual({});
    });
  });

  it('can be used with route middleware (capture group)', () => {
    redirectFunc = redirect('/rewritten/$1');

    req.url = '/route/route1';
    req.params = ['', 'route1'];

    redirectFunc(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith('/rewritten/route1');
  });

  it('can be used with route middleware (named parameters)', () => {
    redirectFunc = redirect('/rewritten/:var');

    req.url = '/route/route1';
    req.params = { var: 'route1' };

    redirectFunc(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith('/rewritten/route1');
  });
});

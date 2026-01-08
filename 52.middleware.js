/**
 * Simplified Middleware System (Express-like)
 *
 * Middleware functions are functions with a fixed interface that can be chained:
 *
 * app.use('/user/:id', function (req, res, next) {
 *   next()
 * }, function (req, res, next) {
 *   next(new Error('sth wrong'))
 * })
 *
 * You are asked to create a simplified Middleware system:
 *
 * type Request = object
 * type NextFunc =  (error?: any) => void
 * type MiddlewareFunc = (req: Request, next: NextFunc) => void
 * type ErrorHandler = (error: Error, req: Request, next: NextFunc) => void
 *
 * class Middleware {
 *   use(func: MiddlewareFunc | ErrorHandler) {
 *     // do any async operations
 *     // call next() to trigger next function
 *   }
 *   start(req: Request) {
 *     // trigger all functions with a req object
 *   }
 * }
 *
 * Example usage:
 *
 * const middleware = new Middleware()
 * middleware.use((req, next) => {
 *   req.a = 1
 *   next()
 * })
 * middleware.use((req, next) => {
 *   req.b = 2
 *   next()
 * })
 * middleware.use((req, next) => {
 *   console.log(req)
 * })
 * middleware.start({})
 * // Output: {a: 1, b: 2}
 *
 * Notice that use() could also accept an ErrorHandler (with 3 arguments).
 * The error handler is triggered if next() is called with an extra argument or an uncaught error happens:
 *
 * const middleware = new Middleware()
 * // throw an error at first function
 * middleware.use((req, next) => {
 *   req.a = 1
 *   throw new Error('sth wrong')
 *   // or `next(new Error('sth wrong'))`
 * })
 * // since error occurs, this is skipped
 * middleware.use((req, next) => {
 *   req.b = 2
 * })
 * // since error occurs, this is skipped
 * middleware.use((req, next) => {
 *   console.log(req)
 * })
 * // since error occurs, this is called
 * middleware.use((error, req, next) => {
 *   console.log(error)
 *   console.log(req)
 * })
 * middleware.start({})
 * // Output:
 * // Error: sth wrong
 * // {a: 1}
 */
var Middleware = /** @class */ (function () {
    function Middleware() {
        this.middlewares = [];
    }
    Middleware.prototype.use = function (func) {
        this.middlewares.push(func);
    };
    Middleware.prototype.start = function (req) {
        var stack = this.middlewares;
        var idx = 0;
        var next = function (err) {
            while (idx < stack.length) {
                var fn = stack[idx++];
                if (err) {
                    // Error handler: 3 args
                    if (fn.length === 3) {
                        try {
                            fn(err, req, next);
                        }
                        catch (e) {
                            next(e);
                        }
                        return;
                    }
                }
                else {
                    // Normal middleware: 2 args
                    if (fn.length < 3) {
                        try {
                            fn(req, next);
                        }
                        catch (e) {
                            next(e);
                        }
                        return;
                    }
                }
            }
        };
        next();
    };
    return Middleware;
}());
var middleware = new Middleware();
middleware.use(function (req, next) {
    req.a = 1;
    throw new Error("sth wrong");
    // or `next(new Error('sth wrong'))`
});
// since error occurs, this is skipped
middleware.use(function (req, next) {
    req.b = 2;
});
// since error occurs, this is skipped
middleware.use(function (req, next) {
    console.log(req);
});
// since error occurs, this is called
middleware.use(function (error, req, next) {
    console.log(error);
    console.log(req);
});
middleware.start({});

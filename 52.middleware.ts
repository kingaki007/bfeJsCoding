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

// type Request = object;
type NextFunc = (error?: any) => void;
type MiddlewareFunc = (req: Request, next: NextFunc) => void;
type ErrorHandler = (error: Error, req: Request, next: NextFunc) => void;

class Middleware {
    private middlewares: Array<MiddlewareFunc | ErrorHandler> = [];

    use(func: MiddlewareFunc | ErrorHandler) {
        this.middlewares.push(func);
    }

    start(req: Request) {
        const stack = this.middlewares;
        let idx = 0;

        const next = (err?: any) => {
            while (idx < stack.length) {
                const fn = stack[idx++];
                if (err) {
                    // Error handler: 3 args
                    if (fn.length === 3) {
                        try {
                            (fn as ErrorHandler)(err, req, next);
                        } catch (e) {
                            next(e);
                        }
                        return;
                    }
                } else {
                    // Normal middleware: 2 args
                    if (fn.length < 3) {
                        try {
                            (fn as MiddlewareFunc)(req, next);
                        } catch (e) {
                            next(e);
                        }
                        return;
                    }
                }
            }
        };

        next();
    }
}

const middleware = new Middleware();

middleware.use((req, next) => {
    req.a = 1;
    throw new Error("sth wrong");
    // or `next(new Error('sth wrong'))`
});
// since error occurs, this is skipped
middleware.use((req, next) => {
    req.b = 2;
});
// since error occurs, this is skipped
middleware.use((req, next) => {
    console.log(req);
});
// since error occurs, this is called
middleware.use((error, req, next) => {
    console.log(error);
    console.log(req);
});
middleware.start({} as unknown as Request);

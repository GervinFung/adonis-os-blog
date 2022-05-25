// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
// ref: https://github.com/vercel/next.js/blob/canary/examples/api-routes-cors/lib/init-middleware.js

const initMiddleware = (middleware) => (req, res) =>
    new Promise((resolve, reject) => {
        middleware(req, res, (result) =>
            result instanceof Error ? reject(result) : resolve(result)
        );
    });

export default initMiddleware;

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
// ref: https://github.com/vercel/next.js/blob/canary/examples/api-routes-cors/lib/init-middleware.js
import type { NextApiRequest, NextApiResponse } from 'next';

const initMiddleware =
    <T>(
        middleware: (
            req: NextApiRequest,
            res: NextApiResponse<T>,
            callback: (result: unknown) => void
        ) => void
    ) =>
    (req: NextApiRequest, res: NextApiResponse<T>) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result: unknown) =>
                result instanceof Error ? reject(result) : resolve(result)
            );
        });

export default initMiddleware;

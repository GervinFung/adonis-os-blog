import initMiddleware from '../../middleware';
import Cors from 'cors';

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
);

export default cors;

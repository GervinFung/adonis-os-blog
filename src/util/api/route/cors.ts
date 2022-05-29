import initMiddleware from '../../middleware';
import Cors from 'cors';

const cors = <T>() =>
    initMiddleware<T>(
        Cors({
            methods: ['GET'],
        })
    );

export default cors;

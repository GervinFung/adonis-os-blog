import parseAsInsertPost from './insert';
import parseAsUpdatePost from './update';

const postOpetaionParser = () => ({
    parseAsUpdatePost,
    parseAsInsertPost,
});

export default postOpetaionParser;

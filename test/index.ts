import testHistory from './history';
import testBlogPostParser from './parser/blog/post';
import testBlogPostsParser from './parser/blog/posts';
import testHistoryParser from './parser/history';
import testType from './parser/type';
import testMongo from './database/mongo';
import testAdminPropsParser from './parser/admin';
import testValidation from './common/validation';

testHistory();
testHistoryParser();
testBlogPostsParser();
testBlogPostParser();
testAdminPropsParser();
testType();
testMongo();
testValidation();

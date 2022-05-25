import testHistory from './history';
import testBlogPostParser from './parser/blog/post';
import testBlogPostsParser from './parser/blog/posts';
import testHistoryParser from './parser/history';
import testType from './parser/type';
import testMongo from './util/api/database/mongo';

testHistory();
testHistoryParser();
testBlogPostsParser();
testBlogPostParser();
testType();
testMongo();

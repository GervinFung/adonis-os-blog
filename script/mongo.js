db = db.getSiblingDB('admin');

db.createUser({
    user: 'runner',
    pwd: 'mongodb',
    roles: [{ role: 'root', db: 'admin' }, 'readWrite'],
});

db.auth('runner', 'mongodb');

db = db.getSiblingDB('blog');

// program db
db.createCollection('post');
db.createCollection('authRecord');

db = db.getSiblingDB('testBlog');

// test db
db.createCollection('post');
db.createCollection('authRecord');

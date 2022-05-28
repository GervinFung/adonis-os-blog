import { ObjectId } from 'mongodb';

type Post = Readonly<{
    id: ObjectId;
    timeCreated: Date;
    timeUpdated: Date | undefined;
    timePublished: Date | undefined;
    content: string;
    description: string;
    title: string;
}>;

type AllPosts = ReadonlyArray<Omit<Post, 'content'>>;

type PublishedPost = Pick<Post, 'content' | 'description' | 'title'> &
    Readonly<{
        timePublished: Date;
    }>;

type InsertPost = Pick<
    Post,
    'timeCreated' | 'content' | 'description' | 'title'
>;

type QueryInsertPost = Omit<InsertPost, 'timeCreated'>;

type UpdatePost = Pick<
    Post,
    'timeUpdated' | 'content' | 'description' | 'title' | 'timePublished'
>;

type QueryUpdatePost = Pick<Post, 'id'> & Omit<UpdatePost, 'timeUpdated'>;

type ReadPost = PublishedPost;

type ShowPosts = ReadonlyArray<
    Readonly<{
        id: string;
    }> &
        Omit<PublishedPost, 'content'>
>;

type ChangeIdToMongoId<
    T extends {
        id: ObjectId;
    }
> = Omit<T, 'id'> &
    Readonly<{
        _id: ObjectId;
    }>;

type ChangeHexIdToMongoId<
    T extends {
        id: string;
    }
> = Omit<T, 'id'> &
    Readonly<{
        _id: ObjectId;
    }>;

type MongoIdToId<
    T extends {
        _id: ObjectId;
    }
> = Omit<T, '_id'> &
    Readonly<{
        id: ObjectId;
    }>;

export type {
    ShowPosts,
    InsertPost,
    UpdatePost,
    ReadPost,
    ChangeIdToMongoId,
    ChangeHexIdToMongoId,
    QueryUpdatePost,
    QueryInsertPost,
    MongoIdToId,
    AllPosts,
};

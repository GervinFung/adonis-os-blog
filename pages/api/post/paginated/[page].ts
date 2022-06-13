import type { NextApiRequest, NextApiResponse } from 'next';
import promisifyMongoDb from '../../../../src/database/mongo';
import {
    AdminHandlePosts,
    UserReadPosts,
} from '../../../../src/common/type/post';
import blogPropsParser from '../../../../src/parser/blog';
import cors from '../../../../src/util/api/route/cors';
import adminPropsParser from '../../../../src/parser/admin';
import authApi from '../../../../src/auth/api';

type Response = UserReadPosts | AdminHandlePosts;

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { query } = req;
    const { paginated } = blogPropsParser();
    const { postCollection } = await promisifyMongoDb;

    const { auth, posts } = adminPropsParser();

    const token = auth.parseAsNullableToken(query.token);
    const skip = paginated.parseAsPage(query.page) - 1;

    if (!token) {
        return res.status(200).json({
            totalPosts: await postCollection.totalPublishedPosts(),
            posts: await postCollection.showManyPublished({
                skip,
            }),
        });
    }

    await authApi.verifyIdToken(token);

    const type = posts.parseAsPostQueryOption(query.queryOption);

    switch (type) {
        case 'published':
            return res.status(200).json({
                type,
                totalPosts: await postCollection.totalPublishedPosts(),
                posts: await postCollection.showManyPublished({
                    skip,
                }),
            });
        case 'unpublished':
            return res.status(200).json({
                type,
                totalPosts: await postCollection.totalUnpublishedPosts(),
                posts: await postCollection.showManyUnpublished({
                    skip,
                }),
            });
        case 'deleted':
            return res.status(200).json({
                type,
                totalPosts: await postCollection.totalDeletedPosts(),
                posts: await postCollection.showManyDeleted({
                    skip,
                }),
            });
    }
};

import { equal } from '../util';
import { createInitialHistory, createHistory } from '../../src/history';

const testHistory = () => {
    describe('History Stack', () => {
        it('should throw error when attempting to create history that did not fulfill the conditions, otherwise create it', () => {
            // 1. Empty stack, index for navigation is not -1
            expect(() =>
                createHistory({ stack: [], indexNavigation: 0 })
            ).toThrowError();
            // 2. Non-empty stack, index for navigation is -1
            expect(() =>
                createHistory({
                    stack: [{ type: 'posts', page: 1 }],
                    indexNavigation: -1,
                })
            ).toThrowError();
            // 3. Non-empty stack, index for navigation is not -1
            expect(
                createHistory({
                    stack: [{ type: 'posts', page: 1 }],
                    indexNavigation: 0,
                })
            ).toBeTruthy();
            // 4. Empty stack, index for navigation is -1
            expect(
                createHistory({ stack: [], indexNavigation: -1 })
            ).toBeTruthy();
        });
        it('should push stack', () => {
            const history = [1, 2, 3, 4, 5].reduce(
                (history, page) =>
                    history.push({
                        type: 'posts',
                        page,
                    }),
                createInitialHistory()
            );
            expect(history.current()).toStrictEqual({
                type: 'posts',
                page: 5,
            });
            expect(
                history.stack.every(
                    (history, index) =>
                        history.type === 'posts' && history.page === index + 1
                )
            ).toBe(true);
        });
        it('should push and not overwrite item if index for navigation is largest index possible by traversing forward', () => {
            const iteration = [1, 2, 3, 4, 5];
            const postIds = ['test', 'random', 'stuff', 'backward', 'traverse'];

            const history = iteration.reduce(
                (history) => history.forward(),
                iteration.reduce(
                    (history) => history.backward(),
                    postIds.reduce(
                        (history, id) =>
                            history.push({
                                type: 'post',
                                id,
                            }),
                        createInitialHistory()
                    )
                )
            );

            const push = {
                type: 'posts',
                page: 1,
            } as const;
            // should only push at here
            const newHistory = history.push(push);
            expect(newHistory.current()).toBe(push);
            expect(newHistory.stack).toStrictEqual([
                ...postIds.map((id) => ({
                    type: 'post',
                    id,
                })),
                push,
            ]);
        });
        it('should push and overwrite item once index for navigation is less than largest index possible by traversing backward', () => {
            const history = [1, 2, 3, 4, 5].reduce(
                (history) => history.backward(),
                ['test', 'random', 'stuff', 'backward', 'traverse'].reduce(
                    (history, id) =>
                        history.push({
                            type: 'post',
                            id,
                        }),
                    createInitialHistory()
                )
            );

            const overwrite = {
                type: 'posts',
                page: -1,
            } as const;
            // should overwrite at here
            const newHistory = history.push(overwrite);
            expect(newHistory.current()).toBe(overwrite);
            expect(newHistory.stack).toStrictEqual([
                { type: 'post', id: 'test' },
                overwrite,
            ]);
        });
        it('should retrieve item via forward and backward-tranversing', () => {
            const postIds = ['test', 'random', 'stuff', 'backward', 'traverse'];
            const max = postIds.length;
            const history = postIds.reduce(
                (history, id) =>
                    history.push({
                        type: 'post',
                        id,
                    }),
                createInitialHistory()
            );

            // test backward traversing
            const traversedBackwardHistory = postIds
                .filter((_, index) => index < max - 1)
                .reverse()
                .reduce((history, id) => {
                    const newHistory = history.backward();
                    const current = newHistory.current();
                    if (
                        current &&
                        !(
                            current.type === 'post' &&
                            current.id === id &&
                            equal(
                                newHistory.forward().current(),
                                history.current()
                            )
                        )
                    ) {
                        throw new Error(
                            `item does not match for ${newHistory}`
                        );
                    }
                    return newHistory;
                }, history);

            const backward = {
                type: 'post',
                id: 'test',
            } as const;
            // expect the current state to be accurate after traversing backward
            expect(traversedBackwardHistory.current()).toStrictEqual(backward);
            // expect the backward traversing to return 1st history after it exhausted all backward-traverseable history, regardless of call count
            expect(traversedBackwardHistory.backward().current()).toStrictEqual(
                backward
            );
            expect(traversedBackwardHistory.backward().current()).toStrictEqual(
                backward
            );

            // test forward traversing
            const traversedForwardHistory = postIds
                .filter((_, index) => index !== 0)
                .reduce((history, id) => {
                    const newHistory = history.forward();
                    const current = newHistory.current();
                    if (
                        current &&
                        !(current.type === 'post' && current.id === id)
                    ) {
                        throw new Error(
                            `item does not match for ${newHistory}`
                        );
                    }
                    return newHistory;
                }, traversedBackwardHistory);

            // test forward traversing
            const traverse = {
                type: 'post',
                id: 'traverse',
            };
            // expect the current state to be accurate after traversing forward
            expect(traversedForwardHistory.current()).toStrictEqual(traverse);
            // expect the forward traversing to return 1st history after it exhausted all forward-traverseable history, regardless of call count
            expect(traversedForwardHistory.forward().current()).toStrictEqual(
                traverse
            );
            expect(traversedForwardHistory.forward().current()).toStrictEqual(
                traverse
            );
        });
    });
};

export default testHistory;

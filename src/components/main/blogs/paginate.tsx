import * as React from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { css } from '@emotion/css';
import usePagination from '../../../hook/pagination';

const Pagination = ({
    totalPage,
    currentPage,
    numberOfResults,
    onClick,
}: Readonly<{
    totalPage: number;
    currentPage: number;
    numberOfResults: number;
    onClick: (page: number) => void;
}>) => {
    const { paginationRange } = usePagination({
        currentPage,
        totalPage,
        siblingCount: 1,
    });

    const paginationContainer = css`
        border-radius: 50%;
        padding: 4px;
        display: grid;
        place-items: center;
        margin: 8px;
        @media (max-width: 460px) {
            margin: 4px;
        }
        @media (max-width: 330px) {
            margin: 2px;
        }
    `;

    const numberPaginationContainer = (disallowed: boolean) => css`
        :hover {
            background-color: whitesmoke;
        }
        color: #121212;
        cursor: ${disallowed ? 'not-allowed' : 'pointer'};
        ${paginationContainer};
    `;

    const currentPaginationContainer = css`
        background-color: black;
        cursor: pointer;
        ${paginationContainer};
    `;

    const paginationCircle = css`
        height: 24px;
        width: 24px;
        display: grid;
        place-items: center;
    `;

    const PaginationButton = ({
        className,
        page,
    }: Readonly<{
        className?: string;
        page: number | string;
    }>) => (
        <div
            className={css`
                text-align: center;
                color: #535353;
                ${paginationCircle};
                ${className ?? ''};
            `}
        >
            {page}
        </div>
    );

    const endOfSpectrumNavigation = css`
        color: #535353;
        ${paginationCircle};
    `;

    return (
        <>
            <div
                className={css`
                    width: 100%;
                    padding: 36px 0 0 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `}
            >
                <div
                    className={numberPaginationContainer(
                        !numberOfResults || currentPage === 1
                    )}
                >
                    <IoChevronBackOutline
                        className={endOfSpectrumNavigation}
                        onClick={() => {
                            if (currentPage > 1) {
                                onClick(currentPage - 1);
                            }
                        }}
                    />
                </div>
                {paginationRange.map((page) =>
                    currentPage === page ? (
                        <div className={currentPaginationContainer} key={page}>
                            <PaginationButton
                                className={css`
                                    color: #fff;
                                `}
                                page={page}
                            />
                        </div>
                    ) : typeof page === 'number' ? (
                        <div
                            key={page}
                            onClick={() => onClick(page)}
                            className={numberPaginationContainer(
                                !numberOfResults
                            )}
                        >
                            <PaginationButton page={page} />
                        </div>
                    ) : (
                        <div
                            className={css`
                                color: #fff;
                                ${paginationContainer};
                            `}
                            key={page}
                        >
                            <PaginationButton page={page} />
                        </div>
                    )
                )}
                <div
                    className={numberPaginationContainer(
                        !numberOfResults || currentPage === totalPage
                    )}
                >
                    <IoChevronForwardOutline
                        className={endOfSpectrumNavigation}
                        onClick={() => {
                            if (currentPage < totalPage) {
                                onClick(currentPage + 1);
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default Pagination;

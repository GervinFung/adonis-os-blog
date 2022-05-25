import * as React from 'react';
import { css } from '@emotion/css';

const DateTime = () => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ] as const;

    const generateNewDate = () => {
        const date = new Date();
        const monthIndex = date.getMonth();
        const month = months[monthIndex];
        if (!month) {
            throw new Error(`month at index of ${monthIndex} is undefined`);
        }
        const [time] = date.toTimeString().split(' ');
        if (!time) {
            throw new Error(`time is undefined for date of ${date}`);
        }
        return {
            date: date.getDate(),
            month,
            time,
        };
    };

    const [state, setState] = React.useState({
        dateTime: generateNewDate() as Readonly<{
            date: number;
            month: typeof months[number];
            time: string;
        }>,
    });

    const { dateTime } = state;

    React.useEffect(() => {
        const interval = setInterval(() => {
            setState((prev) => ({
                ...prev,
                dateTime: generateNewDate(),
            }));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const convertTimeToReadableForm = () => {
        const { date, month, time } = dateTime;
        return `${month.substring(0, 3)} ${date} ${time}`;
    };

    return (
        <div
            className={css`
                width: 100%;
                display: grid;
                place-items: center;
                margin: 0 0 0 auto;
            `}
        >
            {convertTimeToReadableForm()}
        </div>
    );
};

export default DateTime;

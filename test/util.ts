const equal = (x: any, y: any) => {
    if (x === y) {
        return true;
    }

    if (
        !(x instanceof Object) ||
        !(y instanceof Object) ||
        x.constructor !== y.constructor
    ) {
        return false;
    }

    for (const p in x) {
        if (!x.hasOwnProperty(p) || x[p] === y[p]) {
            continue;
        }

        if (
            !y.hasOwnProperty(p) ||
            typeof x[p] !== 'object' ||
            !equal(x[p], y[p])
        ) {
            return false;
        }
    }

    for (const p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
};

export { equal };

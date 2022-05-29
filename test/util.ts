// ref: https://stackoverflow.com/questions/39282873/object-hasownproperty-yields-the-eslint-no-prototype-builtins-error-how-to
const hasOwnProperty = (obj: Object, prop: any) =>
    Object.prototype.hasOwnProperty.call(obj, prop);

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
        if (!hasOwnProperty(x, p) || x[p] === y[p]) {
            continue;
        }

        if (
            !hasOwnProperty(y, p) ||
            typeof x[p] !== 'object' ||
            !equal(x[p], y[p])
        ) {
            return false;
        }
    }

    for (const p in y) {
        if (hasOwnProperty(y, p) && !hasOwnProperty(x, p)) {
            return false;
        }
    }
    return true;
};

export { equal };

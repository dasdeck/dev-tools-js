import _ from 'lodash';
import fuzzy from 'fuzzyset.js';

export function stringFuzzyEqual(a, b, threshold = 0.5) {

    let f = fuzzy();
    f.add(a);
    const res = f.get(b);
    return res && res[0][0] >= threshold;
}

const prototypes = {
    String: {
        equalsFuzzy(otherString, threshold = 0.5) {
            return stringFuzzyEqual(this, otherString, threshold);
        }
    }
}

export function register() {
    global = window ? window : global;
    _.forEach(prototypes, (methods, type) => {
        _.forEach(methods, (method, key) => {
            if (global[type].prototype[key] && global[type].prototype[key] !== method) {
                throw type + ' already has a method' + key;
            }
            global[type].prototype[key] = method;
        });

    });

}

export function unregister() {
    _.forEach(prototypes, (methods, type) => {
        _.forEach(methods, (method, key) => {
            if (global[type].prototype[key] === method) {
                delete global[type].prototype[key];
            }
        });
    });

}

export function reOrderObject(obj, order, graceful = true) {
    let orderedObj = {};
    const origKeys = Object.keys(obj);
    if (graceful) {
        order = _.concat(order, _.difference(origKeys, order));
    } else if (origKeys.length !== order.keys) {
        throw "order array must conatin equal amount of keys"
    }

    _.forEach(order, key => {
        orderedObj[key] = obj[key];
    })
    return orderedObj;
}

export function walk(obj, callback) {
    _.forEach(obj, (val, key) => {
        callback(val, key);
        if (typeof val === 'object') {
            walk(val, callback);
        }
    })
}

export function isEqualFuzzy(a, b, threshold = 0.5) {
    return _.isEqualWith(a, b, (a, b) => {
        if (typeof a === 'string' && typeof b === 'string') {
            return stringFuzzyEqual(a, b, threshold);
        }
    })
}
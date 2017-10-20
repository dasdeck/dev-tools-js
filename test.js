import _ from 'lodash';
import * as devtools from './index';
import sinon from 'sinon';

beforeEach(() => {

})

test('lodash forEach on strings', () => {

    const callback = sinon.spy(() => {});
    const string = "abcdefg";
    _.forEach(string, callback);

    expect(callback.called).toBe(true);
    expect(callback.callCount).toBe(string.length);
})

test('walk does walk all items', () =>  {

    const callback = sinon.spy(() => {});
    const testObj = {
        a: "A",
        b: [
            1,
            "1",
            { c: 'Cee' }
        ],
        c: {
            d: "defg"
        }
    }

    devtools.walk(testObj, callback);

    expect(callback.callCount).toBe(8);

})

test('equal strings are equal with fuzzy', () => {
    expect(devtools.stringFuzzyEqual('a', 'a')).toBeTruthy();
})
test('unequal strings are unequal with fuzzy', () => {
    expect(devtools.stringFuzzyEqual('a', 'b')).toBeFalsy();
})

test('string prototype stuff', () => {

    String.prototype.equalsFuzzy = function() {};
    expect(devtools.register).toThrow();
    devtools.unregister();
    expect(devtools.register).toThrow();

    delete String.prototype.equalsFuzzy;

    expect('test'.equalsFuzzy).toBeUndefined();
    devtools.register();
    expect('test'.equalsFuzzy).toBeTruthy();
    devtools.register();
    expect('test'.equalsFuzzy).toBeTruthy();

    expect('test'.equalsFuzzy('test')).toBeTruthy();

    expect('a'.equalsFuzzy('b')).toBeFalsy();

    devtools.unregister();
    expect('test'.equalsFuzzy).toBeUndefined();

})
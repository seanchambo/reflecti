import classNames from '../src/classNames';

test('null', () => {
  expect(classNames(undefined)).toBe(null);
  expect(classNames(null)).toBe(null);
});

test('with string and number', () => {
  expect(classNames('test')).toBe('test');
  expect(classNames('test foo')).toBe('test foo');
  expect(classNames(3)).toBe('3');
});

test('with array of string and number', () => {
  expect(classNames(['test', 'foo'])).toBe('test foo');
  expect(classNames(['test', 3])).toBe('test 3');
});

test('with object', () => {
  expect(classNames({ test: true, foo: true })).toBe('test foo');
  expect(classNames({ test: true, foo: false })).toBe('test');
});

test('array of objects', () => {
  expect(classNames([{ test: true }, { foo: true }])).toBe('test foo');
  expect(classNames([{ test: true }, { foo: false }])).toBe('test');
});

test('mixture of types', () => {
  expect(classNames(['bar', { test: true }, { foo: true }])).toBe('bar test foo');
  expect(classNames([null, true, false, 3, { test: true }, { foo: false }])).toBe('3 test');
});

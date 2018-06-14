import { r } from '../src';

test('empty vnode', () => {
  expect(r('div')).toEqual({
    type: 'div',
    attributes: {},
    children: [],
    key: null,
  });
});

test('vnode with a single child', () => {
  expect(r('div', {}, ['foo'])).toEqual({
    type: 'div',
    attributes: {},
    children: ['foo'],
    key: null,
  });

  expect(r('div', {}, 'foo')).toEqual({
    type: 'div',
    attributes: {},
    children: ['foo'],
    key: null,
  });
});

test('positional String/Number children', () => {
  expect(r('div', {}, 'foo', 'bar', 'baz')).toEqual({
    type: 'div',
    attributes: {},
    children: ['foo', 'bar', 'baz'],
    key: null,
  });

  expect(r('div', {}, 0, 'foo', 1, 'baz', 2)).toEqual({
    type: 'div',
    attributes: {},
    children: ['0', 'foo', '1', 'baz', '2'],
    key: null,
  });

  expect(r('div', {}, 'foo', r('div', {}, 'bar'), 'baz', 'quux')).toEqual({
    type: 'div',
    attributes: {},
    key: null,
    children: [
      'foo',
      {
        type: 'div',
        attributes: {},
        key: null,
        children: ['bar'],
      },
      'baz',
      'quux',
    ],
  });
});

test('vnode with attributes', () => {
  const attributes = {
    id: 'foo',
    class: 'bar',
    style: {
      color: 'red',
    },
  };

  expect(r('div', attributes, 'baz')).toEqual({
    attributes,
    type: 'div',
    children: ['baz'],
    key: null,
  });
});

test('skip null and Boolean children', () => {
  const expected = {
    type: 'div',
    attributes: {},
    children: [],
    key: null,
  };

  expect(r('div', {}, true)).toEqual(expected);
  expect(r('div', {}, false)).toEqual(expected);
  expect(r('div', {}, null)).toEqual(expected);
});

test('with a key', () => {
  expect(r('div', { key: 'test' }, null)).toEqual({
    type: 'div',
    attributes: { key: 'test' },
    children: [],
    key: 'test',
  });
});

test('type as a function (JSX components)', () => {
  const component = (props, children) => r('div', props, children);

  expect(r(component, { id: 'foo' }, 'bar')).toEqual({
    type: component,
    attributes: { id: 'foo' },
    children: ['bar'],
    key: null,
  });

  expect(r(component, { id: 'foo' }, [r(component, { id: 'bar' })])).toEqual({
    type: component,
    attributes: { id: 'foo' },
    key: null,
    children: [
      {
        type: component,
        attributes: { id: 'bar' },
        children: [],
        key: null,
      },
    ],
  });
});

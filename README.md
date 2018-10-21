# patch-method

[![Build Status](https://travis-ci.org/buschtoens/patch-method.svg)](https://travis-ci.org/buschtoens/patch-method)
[![npm version](https://badge.fury.io/js/patch-method.svg)](http://badge.fury.io/js/patch-method)
[![Download Total](https://img.shields.io/npm/dt/patch-method.svg)](http://badge.fury.io/js/patch-method)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![dependencies](https://img.shields.io/david/buschtoens/patch-method.svg)](https://david-dm.org/buschtoens/patch-method)
[![devDependencies](https://img.shields.io/david/dev/buschtoens/patch-method.svg)](https://david-dm.org/buschtoens/patch-method)

This package allows you to patch class methods in a fully type-safe way. This is
especially useful to create decorators that "mixin" methods.

### `patchMethod`

Allows you to override any method on a given class. Enforces that the passed
`methodName` actually *is* a method, and enforces that your hook `fn` has the
same type signature as the original method.

The first argument to `fn` is a `superMethod` callback that is bound to the
instance of the class. This way you can optionally call the original method
implementation and also alter the arguments.

```ts
import patchMethod from 'patch-method';

class Foo {
  bar(value: number) {
    console.log(`Received: ${value}`);
    return number
  }
}

patchMethod(Foo, 'bar', function(superMethod, value) {
  console.log(`${this.constructor.name}#bar was called with ${value}.`)
  return superMethod(value + 1)
})

const foo = new Foo
foo.bar(10)
// => 'Foo#bar was called with 10.'
// => 'Received: 11'
// => 11
```

### `beforeMethod`

Register a hook to be executed before the original method is run.
Gets passed the original arguments the method was called with.
The return value of the hook is ignored.

```ts
import { beforeMethod } from 'patch-method';

class Foo {
  bar(value: number) {
    return number
  }
}

beforeMethod(Foo, 'bar', function(value) {
  console.log(`${this.constructor.name}#bar was called with ${value}.`)
})

const foo = new Foo
foo.bar(10)
// => 'Foo#bar was called with 10.'
// => 'Received: 10'
// => 10
```

### `afterMethod`

Register a hook to be executed right after the original method is run.
Gets passed the original arguments the method was called with.
Also gets passed the return value of the method as the first parameter.
The return value of the hook is ignored.

```ts
import { afterMethod } from 'patch-method';

class Foo {
  bar(value: number) {
    return number
  }
}

afterMethod(Foo, 'bar', function(returnValue, value) {
  console.log(`${this.constructor.name}#bar was called with ${value}.`)
})

const foo = new Foo
foo.bar(10)
// => 'Received: 10'
// => 'Foo#bar was called with 10.'
// => 10
```

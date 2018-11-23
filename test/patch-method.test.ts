import defaultExport, { patchMethod, beforeMethod, afterMethod } from '../src/patch-method'

describe('patchMethod', () => {
  it('default export is equal to named `patchMethod` export', () => {
    expect(defaultExport).toStrictEqual(patchMethod)
  })

  it('works', () => {
    class Foo {
      bar(value: string) {
        return value
      }
    }

    patchMethod(Foo, 'bar', function(superMethod, value) {
      expect(this).toBeInstanceOf(Foo)
      expect(value).toEqual('test')
      return superMethod(value) + 'called'
    })

    const foo = new Foo()

    expect(foo.bar('test')).toEqual('testcalled')
  })

  it('works with derived classes', () => {
    class Base {
      bar(value: string) {
        return value
      }
    }

    class Derived extends Base {}

    patchMethod(Derived, 'bar', function(superMethod, value) {
      expect(this).toBeInstanceOf(Derived)
      expect(value).toEqual('test')
      return superMethod(value) + 'called'
    })

    const derived = new Derived()

    expect(derived.bar('test')).toEqual('testcalled')
  })

  it('works on base classes of derived classes', () => {
    class Base {
      bar(value: string) {
        return value
      }
    }

    class Derived extends Base {}

    patchMethod(Base, 'bar', function(superMethod, value) {
      expect(this).toBeInstanceOf(Derived)
      expect(value).toEqual('test')
      return superMethod(value) + 'called'
    })

    const derived = new Derived()

    expect(derived.bar('test')).toEqual('testcalled')
  })

  it('works with derived classes that override', () => {
    class Base {
      bar(value: string) {
        return `base -> ${value}`
      }
    }

    class Derived extends Base {
      bar(value: string) {
        return `derived -> ${super.bar(value)}`
      }
    }

    patchMethod(Base, 'bar', function(superMethod, value) {
      expect(this).toBeInstanceOf(Derived)
      expect(value).toEqual('patched:derived -> test')
      return superMethod(`patched:base -> ${value}`)
    })

    patchMethod(Derived, 'bar', function(superMethod, value) {
      expect(this).toBeInstanceOf(Derived)
      expect(value).toEqual('test')
      return superMethod(`patched:derived -> ${value}`)
    })

    const derived = new Derived()

    expect(derived.bar('test')).toEqual(
      'derived -> base -> patched:base -> patched:derived -> test'
    )
  })

  it('accepts a fallback method', () => {
    class Foo {
      // @ts-ignore
      bar: (value: string) => string
    }

    patchMethod(
      Foo,
      'bar',
      function(superMethod, value) {
        expect(this).toBeInstanceOf(Foo)
        expect(value).toEqual('test')
        return superMethod(value) + 'called'
      },
      function(value) {
        expect(this).toBeInstanceOf(Foo)
        expect(value).toEqual('test')
        return 'fallback' + value
      }
    )

    const foo = new Foo()

    expect(foo.bar('test')).toEqual('fallbacktestcalled')
  })
})

describe('beforeMethod', () => {
  it('works', () => {
    class Foo {
      bar(value: string) {
        return value
      }
    }

    beforeMethod(Foo, 'bar', function(value) {
      expect(this).toBeInstanceOf(Foo)
      expect(value).toEqual('test')
    })

    const foo = new Foo()

    expect(foo.bar('test')).toEqual('test')
  })
})

describe('afterMethod', () => {
  it('works', () => {
    class Foo {
      bar(value: string) {
        return value
      }
    }

    afterMethod(Foo, 'bar', function(returnValue, value) {
      expect(this).toBeInstanceOf(Foo)
      expect(returnValue).toEqual('test')
      expect(value).toEqual('test')
    })

    const foo = new Foo()

    expect(foo.bar('test')).toEqual('test')
  })
})

import patchMethod, { beforeMethod, afterMethod } from '../src/patch-method'

describe('patchMethod', () => {
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

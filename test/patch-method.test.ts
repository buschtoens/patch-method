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
      return superMethod(value)
    })

    const foo = new Foo()

    expect(foo.bar('test')).toEqual('test')
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

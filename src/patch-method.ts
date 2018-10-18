/**
 * Gets the types of the parameters of function `T` as an array.
 */
type Parameters<T> = T extends (...args: infer T) => any ? T : never

/**
 * A constructor function / class basically.
 */
type Constructor<T> = new (...args: any[]) => T

/**
 * Gets the instance type of a constructor.
 */
type ConstructorReturnType<T extends Constructor<any>> = T extends Constructor<infer U> ? U : never

/**
 * All values on the object `Obj`.
 */
type Values<Obj> = Obj[keyof Obj]

/**
 * All keys of `Obj` that have a value of type `T`.
 */
type PropertiesOfType<Obj, T> = Values<{ [K in keyof Obj]: Obj[K] extends T ? K : never }>

/**
 * Allows you to easily hook into / extend a method on a class.
 *
 * ```ts
 * class Foo {
 *   bar(hello: string): boolean {
 *     return true;
 *   }
 * }
 *
 * patchMethod(Foo, 'bar', function(superMethod, hello) {
 *   console.log('Do something here.');
 *   return superMethod(hello);
 * });
 * ```
 *
 * @param klass The class to hook into.
 * @param methodName The name of the method on the class to hook into.
 * @param fn The hook to execute.
 */
export default function patchMethod<
  Class extends Constructor<any>,
  Instance extends ConstructorReturnType<Class>,
  K extends PropertiesOfType<Instance, Function>,
  SuperMethod extends Extract<Instance[K], Function>
>(
  klass: Class,
  methodName: K,
  fn: (
    this: Instance,
    superMethod: SuperMethod,
    ...args: Parameters<SuperMethod>
  ) => ReturnType<SuperMethod>
): Class {
  const superMethod: SuperMethod = klass.prototype[methodName]

  klass.prototype[methodName] = function(
    this: Instance,
    ...args: Parameters<SuperMethod>
  ): ReturnType<SuperMethod> {
    return fn.call(this, superMethod.bind(this), ...args)
  }

  return klass
}

/**
 * Executes the hook before the super method is executed.
 *
 * ```ts
 * class Foo {
 *   bar(hello: string): boolean {
 *     return true;
 *   }
 * }
 *
 * beforeMethod(Foo, 'bar', function(hello) {
 *   console.log('Do something here.');
 * });
 * ```
 *
 * @param klass The class to hook into.
 * @param methodName The name of the method on the class to hook into.
 * @param fn The hook to execute.
 */
export function beforeMethod<
  Class extends Constructor<any>,
  Instance extends ConstructorReturnType<Class>,
  K extends PropertiesOfType<Instance, Function>,
  SuperMethod extends Instance[K]
>(klass: Class, methodName: K, fn: (this: Instance, ...args: Parameters<SuperMethod>) => any) {
  return patchMethod(klass, methodName, function(superMethod, ...args) {
    fn.call(this, ...args)
    return superMethod(...args)
  })
}

/**
 * Executes the hook after the super method has been executed.
 *
 * ```ts
 * class Foo {
 *   bar(hello: string): boolean {
 *     return true;
 *   }
 * }
 *
 * afterMethod(Foo, 'bar', function(hello) {
 *   console.log('Do something here.');
 * });
 * ```
 *
 * @param klass The class to hook into.
 * @param methodName The name of the method on the class to hook into.
 * @param fn The hook to execute.
 */
export function afterMethod<
  Class extends Constructor<any>,
  Instance extends ConstructorReturnType<Class>,
  K extends PropertiesOfType<Instance, Function>,
  SuperMethod extends Instance[K]
>(klass: Class, methodName: K, fn: (this: Instance, ...args: Parameters<SuperMethod>) => any) {
  return patchMethod(klass, methodName, function(superMethod, ...args) {
    const returnValue = superMethod(...args)
    fn.call(this, ...args)
    return returnValue
  })
}

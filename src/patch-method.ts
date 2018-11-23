import { Constructor, PropertiesOfType } from './type-helpers'

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
export function patchMethod<
  Class extends Constructor<any>,
  Instance extends InstanceType<Class>,
  K extends PropertiesOfType<Instance, Function>,
  SuperMethod extends Extract<Instance[K], Function>
>(
  klass: Class,
  methodName: K,
  fn: (
    this: Instance,
    superMethod: SuperMethod,
    ...args: Parameters<SuperMethod>
  ) => ReturnType<SuperMethod>,
  fallback?: (this: Instance, ...args: Parameters<SuperMethod>) => ReturnType<SuperMethod>
): Class {
  const superMethod: SuperMethod = klass.prototype[methodName] || fallback

  klass.prototype[methodName] = function(
    this: Instance,
    ...args: Parameters<SuperMethod>
  ): ReturnType<SuperMethod> {
    return fn.call(this, superMethod.bind(this), ...args)
  }

  return klass
}

export default patchMethod

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
  Instance extends InstanceType<Class>,
  K extends PropertiesOfType<Instance, Function>,
  SuperMethod extends Instance[K]
>(
  klass: Class,
  methodName: K,
  fn: (this: Instance, ...args: Parameters<SuperMethod>) => any,
  fallback?: (this: Instance, ...args: Parameters<SuperMethod>) => ReturnType<SuperMethod>
) {
  return patchMethod(
    klass,
    methodName,
    function(superMethod, ...args) {
      fn.call(this, ...args)
      return superMethod(...args)
    },
    fallback
  )
}

/**
 * Executes the hook after the super method has been executed and passes the
 * return value to the hook.
 *
 * ```ts
 * class Foo {
 *   bar(hello: string): boolean {
 *     return true;
 *   }
 * }
 *
 * afterMethod(Foo, 'bar', function(returnValue, hello) {
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
  Instance extends InstanceType<Class>,
  K extends PropertiesOfType<Instance, Function>,
  SuperMethod extends Instance[K]
>(
  klass: Class,
  methodName: K,
  fn: (
    this: Instance,
    returnValue: ReturnType<SuperMethod>,
    ...args: Parameters<SuperMethod>
  ) => any,
  fallback?: (this: Instance, ...args: Parameters<SuperMethod>) => ReturnType<SuperMethod>
) {
  return patchMethod(
    klass,
    methodName,
    function(superMethod, ...args) {
      const returnValue = superMethod(...args)
      fn.call(this, returnValue, ...args)
      return returnValue
    },
    fallback
  )
}

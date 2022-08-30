import Ember from 'ember';
import { expectTypeOf } from 'expect-type';

class LifetimeHooks extends Ember.Object {
  resource: {} | undefined;

  init() {
    this._super();
    this.resource = {};
  }

  willDestroy() {
    this.resource = undefined;
    this._super();
  }
}

class MyObject30 extends Ember.Object {
  constructor() {
    super();
  }
}

class MyObject31 extends Ember.Object {
  constructor(properties: object) {
    super(properties);
  }
}

class Foo extends Ember.Object {
  @Ember.computed()
  get a() {
    return '';
  }

  set a(newVal: string) {
    /* no-op */
  }

  b = 5;

  baz() {
    const y = this.b; // $ExpectType number
    const z = this.a; // $ExpectType ComputedProperty<string, string>
    this.b = 10;
    this.get('b').toFixed(4); // $ExpectType string
    this.set('a', 'abc').split(','); // $ExpectType string[]
    this.set('b', 10).toFixed(4); // $ExpectType string

    this.setProperties({ b: 11 });
    // this.setProperties({ b: '11' }); // @ts-expect-error
    this.setProperties({
      a: 'def',
      b: 11,
    });
  }
}

export class Foo2 extends Ember.Object {
  name = '';

  changeName(name: string) {
    // This is checking for assignability; `expectTypeOf` doesn't work correctly
    // here because TS isn't resolving `this['name']` eagerly, and so it is not
    // (currently) possible for the type utility to match it.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const x: string = Ember.set(this, 'name', name);

    // TODO: it would be nice if we can get this to work correctly; it is
    // unclear why the version on the namespace does *not* work correctly but
    // the standalone version *does*. However, the Ember namespace should be
    // little used (and hopefully we will deprecate it soon), and `get` itself
    // is in much the same bucket: 99% of cases are *either* totally unsafe deep
    // key access like `get(foo, 'bar.baz.quux')` which we do not support at all
    // *or* they can be trivially codemodded to direct property access.
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const y: string = Ember.get(this, 'name');

    this.setProperties({
      name,
    });
    Ember.setProperties(this, {
      name,
    });
  }

  bar() {
    Ember.notifyPropertyChange(this, 'name');
    // @ts-expect-error
    Ember.notifyPropertyChange(this);
    // @ts-expect-error
    Ember.notifyPropertyChange('name');
    // @ts-expect-error
    Ember.notifyPropertyChange(this, 'name', 'bar');
  }
}

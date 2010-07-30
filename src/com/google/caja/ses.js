// Copyright (C) 2007 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview the SES runtime library.
 * It is written in Javascript, not SES, and would be rejected by the SES
 * translator. This module exports two globals intended for normal use:<ol>
 * <li>"___" for use by the output of the SES translator and by some
 *     other untranslated Javascript code.
 * <li>"ses" providing some common services to the SES programmer.
 * </ol>
 * <p>It also exports the following additional globals:<ul>
 * <li>"safeJSON" why is this being exported?
 * <li>"AS_TAMED___" and "AS_FERAL___" are exported only to catch any
 *     attempts to tame or untame the global object.
 * </ul>
 *
 * @author metaweta@gmail.com
 * @requires this, json_sans_eval
 * @provides ___, ses, safeJSON, AS_TAMED___, AS_FERAL___
 * @overrides Array, Boolean, Date, Function, Number, Object, RegExp, String
 * @overrides Error, EvalError, RangeError, ReferenceError, SyntaxError,
 *   TypeError, URIError
 * @overrides escape, JSON
 */

var ___, ses, safeJSON, AS_TAMED___, AS_FERAL___;

(function () {
  // ES5/3 does not support FF2 or 3.0 because of
  // https://bugzilla.mozilla.org/show_bug.cgi?id=507453
  if (arguments[-2] !== void 0) {
    // TODO: Make this an error.
    alert('Firefox versions below 3.5 not supported.');
  }
  if (Object.create) {
    throw new Error('Already an ES5 platform.');
  }
  
  // Provide original definitions for closures.
  var Object___ = Object;
  var Array___ = Array;
  var String___ = String;
  var Number___ = Number;
  var Boolean___ = Boolean;
  
  /**
   * Caja-specific properties
   * 
   * Caja combines all numeric properties and uses the special name
   * {@code NUM___} to refer to the single property descriptor.
   * Numeric properties must be enumerable data properties.
   * If the special descriptor is absent, it defaults to
   * {writable:true, configurable:true, enumerable:true, get:void 0, set:void 0}
   * 
   * {@code obj[name + '_v___'] === obj}  means that {@code name} is
   *                                      a data property on {@code obj}.
   * {@code obj.hasOwnProperty___(name + '_v___') &&
   *       obj[name + '_v___'] === false} means that {@code name} is an
   *                                      accessor property on {@code obj}.
   * {@code obj[name + '_w___'] === obj}  means that {@code name} is
   *                                      writable (fastpath).
   * {@code obj[name + '_gw___'] === obj} means that {@code name} is
   *                                      writable (grant).
   * {@code obj[name + '_c___'] === obj}  means that {@code name} is
   *                                      configurable.
   * {@code obj[name + '_e___'] === obj}  means that {@code name} is
   *                                      enumurable.
   * {@code obj[name + '_g___']}          is the getter for 
   *                                      {@code name} on {@code obj}.
   * {@code obj[name + '_s___']}          is the setter for 
   *                                      {@code name} on {@code obj}.
   * {@code obj[name + '_m___'] === obj}  means that {@code name} is
   *                                      callable as a method (fastpath).
   * 
   * To prevent accidental misinterpretation of the above inherited
   * attribute descriptors, whenever any are defined for a given
   * {@code obj} and {@code name}, all eight must be. If {@code name}
   * is a string encoding of a number (i.e., where {@code name ===
   * String(+name)}), then all of the above attributes must not be
   * defined directly for {@code name}. Instead, the effective
   * attributes of {@code name} are covered by the actual attributes
   * of {@code 'NUM___'}.
   * 
   * {@code obj.ne___ === obj}            means that {@code obj} is not
   *                                      extensible.
   * {@code obj.z___ === obj}             means that {@code obj} is frozen.
   * {@code '___' in obj}                 means that {@code obj} is a global
   *                                      object and shouldn't be used as
   *                                      'this'.
   * {@code obj.UNCATCHABLE___ === true}  means that {@code obj} may not be
   *                                      caught by a cajoled {@code catch}.
   * 
   * {@code obj.v___(p)}                  = {@code obj.[[Get]](p)}
   * {@code obj.w___(p,v)}                = {@code obj.[[Put]](p,v)}
   * {@code obj.c___(p)}                  = {@code obj.[[Delete]](p)}
   * {@code obj.m___(p, [as])}            invokes {@code p} as a method safely;
   *                                      it may set the {@code '_m___'}
   *                                      fastpath on {@code obj}.
   * 
   * {@code g.f___(dis, [as])}            is the tamed version of {@code g}, 
   *                                      though it uses {@code apply}'s
   *                                      interface.
   * {@code g.i___(as)}                   = g.f___(___.USELESS, [as]) 
   * {@code g.new___(as)}                 is the tamed version of {@code g}
   *                                      used for constructing an object of
   *                                      class {@code g}.
   * {@code ___.tamesTo(feral, tamed)}    installs inverse properties
   *                                      {@code feral.TAMED_TWIN___ = tamed},
   *                                      {@code tamed.FERAL_TWIN___ = feral}.
   * {@code g.AS_TAMED___}                constructs a tamed twin for {@code g}
   *                                      and calls {@code ___.tamesTo}.
   * {@code g.AS_FERAL___}                constructs a feral twin for {@code g}
   *                                      and calls {@code ___.tamesTo}
   * {@code ___.tame(obj)}                uses the {@code *_TWIN___} fastpath.
   *                                      if possible; if that fails, it uses
   *                                      the inherited {@code AS_TAMED___}
   *                                      method.
   * {@code ___.untame(obj)}              is similar, but goes the other way.
   * 
   */

  Array.prototype.slice___ = Array.prototype.slice;
  if (!Array.slice) {
    Array.slice___ = function (dis, startIndex, endIndex) {
        return Array___.prototype.slice___.call___(dis, startIndex, endIndex);
      };
  } else {
    Array.slice___ = Array.slice;
  }
  Array.prototype.push___ = Array.prototype.push;
  Array.prototype.shift___ = Array.prototype.shift;
  Array.prototype.concat___ = Array.prototype.concat;

  ////////////////////////////////////////////////////////////////////////
  // Primitive objective membrane
  ////////////////////////////////////////////////////////////////////////

  /**
   * Records that f is t's feral twin and t is f's tame twin.
   * <p>
   * A <i>feral</i> object is one safe to make accessible to trusted
   * but possibly innocent uncajoled code. A <i>tame</i> object is one
   * safe to make accessible to untrusted cajoled
   * code. ___tamesTo(f, t) records that f is feral, that t is tamed,
   * and that they are in one-to-one correspondence so that 
   * ___.tame(f) === t and ___.untame(t) === f.
   * <p>
   * All primitives already tame and untame to themselves, so tamesTo
   * only accepts non-primitive arguments. The characteristic of being
   * marked tame or feral only applies to the object itself, not to
   * objects which inherit from it. TODO(erights): We should probably
   * check that a derived object does not get markings that conflict
   * with the markings on its base object.
   * <p>
   * Initialization code can express some taming decisions by calling
   * tamesTo to preregister some feral/tame pairs. 
   * <p>
   * Unlike the subjective membranes created by Domita, in this one,
   * the objects in a tame/feral pair point directly at each other,
   * and thereby retain each other. So long as one is non-garbage the
   * other will be as well. 
   */
  function tamesTo(f, t) {
    var ftype = typeof f;
    if (!f || (ftype !== 'function' && ftype !== 'object')) { 
      throw new TypeError('Unexpected feral primitive: ', f); 
    }
    var ttype = typeof t;
    if (!t || (ttype !== 'function' && ttype !== 'object')) {
      throw new TypeError('Unexpected tame primitive: ', t); 
    }

    if (f.TAMED_TWIN___ === t && t.FERAL_TWIN___ === f) { 
      // Just a transient diagnostic until we understand how often
      // this happens.
      log('multiply tamed: ' + f + ', ' + t);
      return; 
    }

    // TODO(erights): Given that we maintain the invariant that 
    // (f.TAMED_TWIN___ === t && hasOwnProp(f, 'TAMED_TWIN___')) iff
    // (t.FERAL_TWIN___ === f && hasOwnProp(t, 'FERAL_TWIN___')), then we
    // could decide to more delicately rely on this invariant and test
    // the backpointing rather than hasOwnProp below.

    if (f.TAMED_TWIN___ && f.hasOwnProperty___('TAMED_TWIN___')) { 
      throw new TypeError('Already tames to something: ', f); 
    }
    if (t.FERAL_TWIN___ && t.hasOwnProperty___('FERAL_TWIN___')) { 
      throw new TypeError('Already untames to something: ', t); 
    }
    if (f.FERAL_TWIN___ && f.hasOwnProperty___('FERAL_TWIN___')) { 
      throw new TypeError('Already tame: ', f); 
    }
    if (t.TAMED_TWIN___ && t.hasOwnProperty___('TAMED_TWIN___')) { 
      throw new TypeError('Already feral: ', t); 
    }

    f.TAMED_TWIN___ = t;
    t.FERAL_TWIN___ = f;
  }

  /**
   * ___.tamesToSelf(obj) marks obj as both tame and feral.
   * <p>
   * Most tamed objects should be both feral and tame, i.e.,
   * safe to be accessed from both the feral and tame worlds.
   * <p>
   * This is equivalent to tamesTo(obj, obj) but a bit faster by
   * exploiting the knowledge that f and t are the same object.
   */
  function tamesToSelf(obj) {
    var otype = typeof obj;
    if (!obj || (otype !== 'function' && otype !== 'object')) { 
      throw new TypeError('Unexpected primitive: ', obj); 
    }
    if (obj.TAMED_TWIN___ === obj && obj.FERAL_TWIN___ === obj) { 
      // Just a transient diagnostic until we understand how often
      // this happens.
      log('multiply tamed: ' + obj);
      return; 
    }

    // TODO(erights): Given that we maintain the invariant that 
    // (f.TAMED_TWIN___ === t && hasOwnProp(f, 'TAMED_TWIN___')) iff
    // (t.FERAL_TWIN___ === f && hasOwnProp(t, 'FERAL_TWIN___')), then we
    // could decide to more delicately rely on this invariant and test
    // the backpointing rather than hasOwnProp below.
    if (obj.TAMED_TWIN___ && hasOwnProp(obj, 'TAMED_TWIN___')) { 
      throw new TypeError('Already tames to something: ', obj); 
    }
    if (obj.FERAL_TWIN___ && hasOwnProp(obj, 'FERAL_TWIN___')) { 
      throw new TypeError('Already untames to something: ', obj); 
    }

    obj.TAMED_TWIN___ = obj.FERAL_TWIN___ = obj;
  }

  /**
   * 
   * Returns a tame object representing f, or undefined on failure.
   * <ol>
   * <li>All primitives tame and untame to themselves. Therefore,
   *     undefined is only a valid failure indication after checking
   *     that the argument is not undefined. 
   * <li>If f has a registered tame twin, return that.
   * <li>If f is marked tame, then f already is a tame object 
   *     representing f, so return f.
   * <li>If f has an AS_TAMED___() method, call it and then register 
   *     the result as f's tame twin. Unlike the tame/feral
   *     registrations, this method applies even if it is inherited.
   * <li>If f is a Record, call tameRecord(f). We break Records out as
   *     a special case since the only thing all Records inherit from
   *     is Object.prototype, which everything else inherits from as
   *     well. 
   * <li>Indicate failure by returning undefined.
   * </ol>
   * Record taming does not (yet?) deal with record inheritance. 
   * <p>
   * The AS_TAMED___() methods may assume that they are called only by
   * tame() and only on unmarked non-primitive objects. They must
   * therefore either return another unmarked non-primitive object
   * (possibly the same one) or undefined for failure. On returning
   * successfully, tame() will register the pair so AS_TAMED___() does
   * not need to. 
   */
  function tame(f) {
    var ftype = typeof f;
    if (!f || (ftype !== 'function' && ftype !== 'object')) { 
      return f; 
    }
    var t = f.TAMED_TWIN___;
    // Here we do use the backpointing test as a cheap hasOwnProp test.
    if (t && t.FERAL_TWIN___ === f) { return t; }

    var realFeral = f.FERAL_TWIN___;
    if (realFeral && realFeral.TAMED_TWIN___ === f) {
      // If f has a feral twin, then f itself is tame.
      log('Tame-only object from feral side: ' + f);
      return f;
    }
    if (f.AS_TAMED___) {
      t = f.AS_TAMED___();
      if (t) { tamesTo(f, t); }
      return t;
    }
    if (isRecord(f)) {
      t = tameRecord(f);
      // tameRecord does not actually have any possibility of failure,
      // but we can't assume that here.
      if (t) { tamesTo(f, t); }
      return t;
    }
    return undefined;
  }

  /**
   * Returns a feral object representing t, or undefined on failure.
   * <ol>
   * <li>All primitives tame and untame to themselves. Therefore,
   *     undefined is only a valid failure indication after checking
   *     that the argument is not undefined. 
   * <li>If t has a registered feral twin, return that.
   * <li>If t is marked feral, then t already is a feral object 
   *     representing t, so return t.
   * <li>If t has an AS_FERAL___() method, call it and then register 
   *     the result as t's feral twin. Unlike the tame/feral
   *     registrations, this method applies even if it is inherited.
   * <li>If t is a Record, call untameRecord(t).
   * <li>Indicate failure by returning undefined.
   * </ol>
   * Record untaming does not (yet?) deal with record inheritance. 
   * <p>
   * The AS_FERAL___() methods may assume that they are called only by
   * untame() and only on unmarked non-primitive objects. They must
   * therefore either return another unmarked non-primitive object
   * (possibly the same one) or undefined for failure. On returning
   * successfully, untame() will register the pair so AS_FERAL___() does
   * not need to. 
   */
  function untame(t) {
    var ttype = typeof t;
    if (!t || (ttype !== 'function' && ttype !== 'object')) { 
      return t; 
    }
    var f = t.FERAL_TWIN___;
    // Here we do use the backpointing test as a cheap hasOwnProp test.
    if (f && f.TAMED_TWIN___ === t) { return f; }

    var realTame = t.TAMED_TWIN___;
    if (realTame && realTame.FERAL_TWIN___ === t) {
      // If t has a tamed twin, then t itself is feral.
      log('Feral-only object from tame side: ' + t);
      return t;
    }
    if (t.AS_FERAL___) {
      f = t.AS_FERAL___();
      if (f) { tamesTo(f, t); }
      return f;
    }
    if (isRecord(t)) {
      f = untameRecord(t); // TODO: untameRecord isn't defined yet
      // untameRecord does not actually have any possibility of
      // failure, but we can't assume that here.
      if (f) { tamesTo(f, t); }
      return f;
    }
    return undefined;
  }

  ////////////////////////////////////////////////////////////////////////
  // Taming helpers to be called only by tame() and untame().
  ////////////////////////////////////////////////////////////////////////

  AS_TAMED___ = function() {
      throw new Error('Internal: global object almost leaked');
    };

  AS_FERAL___ = function() {
      var err = new Error('Internal: global object leaked');
      err.UNCATCHABLE___ = true;
      throw err;
    };

  /**
   * Used in lieu of an AS_TAMED___() method for Records.
   * <p>
   * Assume f is an unmarked Record. Recursively tame all its
   * mentionable enumerable[*] own properties, being careful to
   * handle cycles. Failure to tame a property value only causes
   * that property to be omitted. Freeze the resulting record. If
   * the original record were frozen and all properties tame to
   * themselves, then the Record should tame to itself. 
   * 
   * <p>[*] Clarify that "enumerable" here is at the uncajoled level
   * of abstraction and is distinct from the emulated enumerability
   * presented to cajoled code.
   */
  function tameRecord(f) {
    var t = {};
    var changed = !isFrozen(f);
    // To handle cycles, provisionally mark f as taming to a fresh
    // t going in and see how the rest tames. Set up a try/finally
    // block to remove these provisional markings even on
    // exceptional exit.
    tamesTo(f, t);
    try {
      var keys = ownKeys(f);
      var len = keys.length;
      for (var i = 0; i < len; i++) {
        var k = keys[i];
        var fv = f[k];
        var tv = tame(fv);
        if (tv === void 0 && fv !== void 0) {
          changed = true;
        } else {
          if (fv !== tv && fv === fv) { // I hate NaNs
            changed = true;
          }
          t[k] = tv;
        }
      }
    } finally {
      delete f.TAMED_TWIN___;
      delete t.FERAL_TWIN___;
    }
    if (changed) {
      // Although the provisional marks have been removed, our caller
      // will restore them. We do it this way to make tameRecord()
      // more similar to AS_TAMED___() methods.
      return freeze(t);
    } else {
      return f;
    }
  }

  /**
   * Objects can't override this, so it can be invoked safely as a method.
   */
  Object.prototype.hasOwnProperty___ = Object.prototype.hasOwnProperty;
  Object.prototype.toString___ = Object.prototype.toString;

  /**
   * The property descriptor for numerics
   */
  Object.prototype.NUM____v___ = Object.prototype;
  Object.prototype.NUM____gw___ = false; 
  Object.prototype.NUM____w___ = false;
  Object.prototype.NUM____m___ = false;
  Object.prototype.NUM____c___ = false;
  Object.prototype.NUM____e___ = Object.prototype;
  Object.prototype.NUM____g___ = void 0;
  Object.prototype.NUM____s___ = void 0;
  Object.prototype.hasNumerics___ = function () {
      return this.NUM____v___ === this;
    };

  function isFrozen(obj) {
    return obj.z___ === obj;
  }

  /**
   * The property descriptor for array lengths
   */
  // This flag is only used when doing a dynamic lookup of the length property.
  Array.prototype.length_v___ = false;
  Array.prototype.length_gw___ = false;
  Array.prototype.length_w___ = false;
  Array.prototype.length_m___ = false;
  Array.prototype.length_c___ = false;
  Array.prototype.length_e___ = false;

  /**
   * Setter for {@code length}.  This is necessary because
   * shortening an array by setting its length may delete numeric properties.
   */
  Array.prototype.length_s___ = function (val) {
      // Freezing an array needs to freeze the length property.
      if (this.z___ === this) {
        throw new TypeError('Cannot change the length of a frozen array.');
      }
      val = ToUint32(val);
      // Since increasing the length does not add properties,
      // we don't need to check extensibility.
      if (val >= this.length) {
        return this.length = val;
      }
      // Decreasing the length may delete properties, so
      // we need to check that numerics are configurable.
      if (!this.hasNumerics___() || this.NUM____c___ === this) {
        return this.length = val;
      }
      throw new TypeError(
          'Shortening the array may delete non-configurable elements.');
    };

  /**
   * Getter for {@code length}.  Only necessary for returning
   * a property descriptor map and dynamic lookups, since reading
   * {@code length} is automatically whitelisted.
   */
  Array.prototype.length_g___ = function () { return this.length; };

  // Store the original call and apply properties
  Function.prototype.call___ = Function.prototype.call;
  Function.prototype.apply___ = Function.prototype.apply;
  /**
   * Bind this function to <tt>self</tt>, which will serve
   * as the value of <tt>this</tt> during invocation. Curry on a
   * partial set of arguments in <tt>var_args</tt>. Return the curried
   * result as a new function object.
   */
    Function.prototype.bind = markFunc(function(self, var_args) {
      var thisFunc = safeDis(this);
      var leftArgs = Array___.slice___(arguments, 1);
      function funcBound(var_args) {
        var args = leftArgs.concat___(Array___.slice___(arguments, 0));
        return thisFunc.apply___(safeDis(self), args);
      }
      // 15.3.5.2
      delete funcBound.prototype;
      funcBound.f___ = funcBound.apply___;
      funcBound.new___ = function () {
          throw "Constructing the result of a bind() not yet implemented.";
        };
      return funcBound;
    });
  Function.prototype.bind___ = Function.prototype.bind;
  // Set up safer versions
  Function.prototype.call = markFunc(function (dis, var_args) {
      return this.apply___(safeDis(dis), Array___.slice___(arguments,1));
    });
  Function.prototype.apply = markFunc(function (dis, as) {
      return this.apply___(safeDis(dis), Array___.slice___(as));
    });

  // Replace global, {@code undefined} and {@code null} by
  // {@code USELESS} for use as {@code this}.
  function safeDis(dis) {
    if (dis === null || dis === void 0) { return USELESS; }
    if (Type(dis) !== 'Object') { return dis; }
    if ('___' in dis) { 
      var err = new Error('Internal: toxic global!'); 
      err.UNCATCHABLE___ = true;
      throw err;
    }
    return dis;
  }

  /**
   * Functions tame to themselves by default.
   */
  Function.prototype.AS_TAMED___ = function defaultTameFunc() {
      var f = this;
      if (isFunction(f)) { return f; }
      return void 0;
    };

  /**
   * Functions untame to themselves by default.
   */
  Function.prototype.AS_FERAL___ = function defaultUntameFunc() {
      var t = this;
      if (isFunction(t)) { return t; }
      return void 0;    
    };

  var endsWith__ = /__$/;
  var endsWith_e___ = /(.*?)_e___$/;
  var endsWith_v___ = /(.*?)_v___$/;
  var startsWithNUM___ = /^NUM___/;

  function assertValidPropertyName(P) {
    if (endsWith__.test(P)) { 
      throw new TypeError('Properties may not end in double underscore.');
    }
  }

  function callFault(var_args) {
    var err = new Error('Internal: toxic function encountered!');
    err.UNCATCHABLE___ = true;
    throw err;
  }

  /**
   * Returns the getter, if any, associated with the accessor property
   * {@code name}. 
   * 
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string or a number.
   * Postcondition:
   * If {@code name} is a number, a string encoding of a number, or
   * the string {@code 'NUM___'}, then we must return {@code undefined}.
   */
  function getter(obj, name) {
    return obj[name + '_g___'];
  }

  /**
   * Returns the setter, if any, associated with the accessor property
   * {@code name}. 
   * 
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string or a number.
   * Postcondition:
   * If {@code name} is a number, a string encoding of a number, or
   * the string {@code 'NUM___'}, then we must return {@code undefined}.
   */
  function setter(obj, name) {
    return obj[name + '_s___'];
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string or a number.
   * Postcondition:
   * If {@code name} is a number, a string encoding of a number, or
   * the string {@code 'NUM___'}, then we must return {@code false}.
   */
  function hasAccessor(obj, name) {
    var valueFlag = name + '_v___'; 
    return valueFlag in obj && !obj[valueFlag];
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string or a number.
   * Postcondition:
   * If {@code name} is a number, a string encoding of a number, or
   * the string {@code 'NUM___'}, then we must return {@code false}.
   */
  function hasOwnAccessor(obj, name) {
    var valueFlag = name + '_v___';
    return obj.hasOwnProperty___(valueFlag) && !obj[valueFlag];
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding of
   *              a number; {@code name} may be {@code 'NUM___'}. 
   */
  function grantValue(obj, name) {
    obj[name + '_v___'] = obj;
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding of
   *              a number; {@code name} may be {@code 'NUM___'}. 
   */
  function grantWrite(obj, name) {
    obj[name + '_gw___'] = obj;
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding of
   *              a number; {@code name} may be {@code 'NUM___'}. 
   */
  function fastpathWrite(obj, name) {
    obj[name + '_gw___'] = obj;
    obj[name + '_m___'] = false;
    obj[name + '_w___'] = obj;
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding of
   *              a number; {@code name} may be {@code 'NUM___'}. 
   */
  function grantConfigure(obj, name) {
    obj[name + '_c___'] = obj;
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding of
   *              a number; {@code name} may be {@code 'NUM___'}. 
   */
  function grantEnumerate(obj, name) {
    obj[name + '_e___'] = obj;
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding of
   *              a number; {@code name} may be {@code 'NUM___'}. 
   */
  function fastpathMethod(obj, name) {
    obj[name + '_w___'] = false;
    obj[name + '_m___'] = obj;
  }

  // For taming a simple function or a safe exophoric function like
  //     Array.prototype.peek = function () { return this[0]; }
  function markFunc(fn) {
    if (!isFunction(fn)) {
      throw new TypeError('Expected a function.'); 
    }
    fn.f___ = fn.apply___;
    fn.new___ = fn;
    return fn;
  }

  function markFuncFreeze(fn) {
    return freeze(markFunc(fn));
  }

  /**
   * Is the property {@code name} whitelisted as a value on {@code obj}?
   * 
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding
   *              of a number; {@code name} may be {@code 'NUM___'}.
   */
  function hasValue(obj, name) {
    // This doesn't need an "|| name === 'NUM___'" since, for all obj,
    // (obj.NUM____v___) is truthy
    return !!obj[name + '_v___'];
  }

  /**
   * Is the property {@code name} whitelisted as an own value on {@code obj}?
   * 
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding
   *              of a number; {@code name} may be {@code 'NUM___'}.
   */
  function hasOwnValue(obj, name) {
    return obj[name + '_v___'] === obj || name === 'NUM___';
  }

  /**
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding
   *              of a number; {@code name} may be {@code 'NUM___'}.
   */
  function hasOwnProperty(obj, name) {
    return obj.hasOwnProperty___(name + '_v___') || name === 'NUM___';
  }

  /**
   * Tests whether the fast-path _w___ flag is set, or grantWrite() has been
   * called, on this object itself as an own (non-inherited) attribute.
   * 
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding 
   *              of a number; {@code name} may be {@code 'NUM___'}.
   */
  function isWritable(obj, name) {
    if (obj[name + '_w___'] === obj) { return true; }
    if (obj[name + '_gw___'] === obj) {
      obj[name + '_m___'] = false;
      obj[name + '_w___'] = obj;
      return true;
    }
    // Frozen and preventExtensions implies hasNumerics
    if (name === 'NUM___' && !obj.hasNumerics___()) {
      return true;
    }
    return false;
  }

  /** 
   * Tests whether {@code grantEnumerate} has been called on the property
   * {@code name} of this object or one of its ancestors.
   * 
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding
   *              of a number; {@code name} may be {@code 'NUM___'}.
   */
  function isEnumerable(obj, name) {
    // This doesn't need an "|| name === 'NUM___'" since, for all obj,
    // (obj.NUM____e___) is truthy
    return !!obj[name + '_e___'];
  }

  /** 
   * Tests whether {@code grantConfigure} has been called on the property
   * {@code name} of this object or one of its ancestors.
   * 
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string that is not the string encoding
   *     of a number; {@code name} may be 'NUM___'.
   */
  function isConfigurable(obj, name) {
    return obj[name + '_c___'] === obj || 
        (name === 'NUM___' && !obj.hasNumerics___());
  }

  function isExtensible(obj) {
    var o; 
    try { o = ToObject(obj); // TODO: What is this about?
    } catch (e) { return false; }
    return o.ne___ !== o;
  }

  /**
   * Tests whether an assignment to {@code obj[name]} would extend the object.
   * 
   * Precondition:
   * {@code obj} must not be {@code null} or {@code undefined}.
   * {@code name} must be a string.
   */
  function wouldExtend(obj, name) {
    // Would assigning to a numeric index extend the object?
    if (isNumericName(name)) {
      return !obj.hasOwnProperty___(name);
    }
    // If name is an own data property, then writing to it won't extend obj.
    if (hasOwnValue(obj, name)) { return false; }
    // If name is an inherited accessor property, invoking the
    // setter won't extend obj. (In any uncajoled setter where it
    // might, the taming must throw an error instead.) 
    if (obj[name + '_s___']) { return false; }
    return true;
  }

  function isFunction(obj) {
    return Object___.prototype.toString___.call___(obj) === '[object Function]';
  }

  function allEnumKeys(obj) {
    var i, m, result = [];
    for (i in obj) {
      if (isNumericName(i)) {
        result.push(i);
      } else {
        if (startsWithNUM___.test(i)) { continue; }
        m = i.match(endsWith_e___);
        if (m) { result.push(m[1]); }
      }
    }
    return result;
  }

  function allKeys(obj) {
    var i, m, result = [];
    for (i in obj) {
      if (isNumericName(i)) {
        result.push(i);
      } else {
        if (startsWithNUM___.test(i)) { continue; }
        m = i.match(endsWith_v___);
        if (m) { result.push(m[1]); }
      }
    }
    return result;
  }

  function ownEnumKeys(obj) {
    var i, m, result = [];
    for (i in obj) {
      if (!obj.hasOwnProperty___(i)) { continue; }
      if (isNumericName(i)) {
        result.push(i);
      } else {
        if (startsWithNUM___.test(i)) { continue; }
        m = i.match(endsWith_e___);
        if (m) { result.push(m[1]); }
      }
    }
    return result;
  }

  function ownKeys(obj) {
    var i, m, result = [];
    for (i in obj) {
      if (!obj.hasOwnProperty___(i)) { continue; }
      if (isNumericName(i)) {
        result.push(i);
      } else {
        if (startsWithNUM___.test(i)) { continue; }
        m = i.match(endsWith_v___);
        if (m) { result.push(m[1]); }
      }
    }
    return result;
  }

  /**
   * Returns a new object whose only utility is its identity and (for
   * diagnostic purposes only) its name.
   */
  function Token(name) {
    name = String___(name);
    return freeze({
        toString: markFuncFreeze(function tokenToString() { 
          return name; 
        }),
        throwable___: true
      });
  }

  /**
   * When a {@code this} value must be provided but nothing is
   * suitable, provide this useless object instead.
   */
  var USELESS = Token('USELESS');

  /**
   * A unique value that should never be made accessible to untrusted
   * code, for distinguishing the absence of a result from any
   * returnable result.
   * <p>
   * See makeNewModuleHandler's getLastOutcome().
   */
  var NO_RESULT = Token('NO_RESULT');

  /**
   * Checks if {@code n} is governed by the {@code NUM___} property descriptor.
   * 
   * Preconditions:
   *   {@code typeof n === 'number'} or {@code 'string'}
   */
  function isNumericName(n) {
    return typeof n === 'number' || String___(+n) === n;
  }

  ////////////////////////////////////////////////////////////////////////
  // JSON
  ////////////////////////////////////////////////////////////////////////

  // TODO: Can all this JSON stuff be moved out of the TCB?
  function jsonParseOk(json) {
    try {
      var x = json.parse('{"a":3}');
      return x.a === 3;
    } catch (e) {
      return false;
    }
  }

  function jsonStringifyOk(json) {
    try {
      var x = json.stringify({'a':3, 'b__':4}, function replacer(k, v) {
          return (/__$/.test(k) ? void 0 : v);
        });
      return x === '{"a":3}';
    } catch (e) {
      return false;
    }
  }

  var goodJSON = {};
  goodJSON.parse = markFunc(jsonParseOk(JSON) ?
    JSON.parse : json_sans_eval.parse);
  goodJSON.stringify = markFunc(jsonStringifyOk(JSON) ?
    JSON.stringify : json_sans_eval.stringify);

  safeJSON = freeze({
      CLASS___: 'JSON',
      parse: markFunc(function (text, opt_reviver) {
        var reviver = void 0;
        if (opt_reviver) {
          opt_reviver = toFunc(opt_reviver);
          reviver = function (key, value) {
            return opt_reviver.apply___(this, arguments);
          };
        }
        return goodJSON.parse(
            json_sans_eval.checkSyntax(text, function (key) {
              return key !== 'valueOf' && 
                  key !== 'toString' && 
                  !endsWith__(key);
            }), reviver);
      }),
      stringify: markFunc(function (obj, opt_replacer, opt_space) {
        switch (typeof opt_space) {
          case 'number': case 'string': case 'undefined': break;
          default: throw new TypeError('space must be a number or string');
        }
        var replacer;
        if (opt_replacer) {
          opt_replacer = toFunc(opt_replacer);
          replacer = function (key, value) {
              if (!this.HasProperty___(key)) { return void 0; }
              return opt_replacer.apply___(this, arguments);
            };
        } else {
          replacer = function (key, value) {
              // TODO: fix this!  canReadPub doesn't exist any more
              return (this.HasProperty___(key)) ? value : void 0;
            };
        }
        return goodJSON.stringify(obj, replacer, opt_space);
      })
    });


  ////////////////////////////////////////////////////////////////////////
  // Diagnostics and condition enforcement
  ////////////////////////////////////////////////////////////////////////

  /**
   * The initial default logging function does nothing.
   * <p>
   * Note: JavaScript has no macros, so even in the "does nothing"
   * case, remember that the arguments are still evaluated.
   */
  function defaultLogger(str, opt_stop) {}
  var myLogFunc = markFuncFreeze(defaultLogger);

  /**
   * Gets the currently registered logging function.
   */
  function getLogFunc() { return myLogFunc; }

  /**
   * Register newLogFunc as the current logging function, to be called
   * by {@code ___.log(str)}.
   * <p>
   * A logging function is assumed to have the signature
   * {@code (str, opt_stop)}, where<ul>
   * <li>{@code str} is the diagnostic string to be logged, and
   * <li>{@code opt_stop}, if present and {@code true}, indicates
   *     that normal flow control is about to be terminated by a
   *     throw. This provides the logging function the opportunity to
   *     terminate normal control flow in its own way, such as by
   *     invoking an undefined method, in order to trigger a Firebug
   *     stacktrace.
   * </ul>
   */
  function setLogFunc(newLogFunc) { myLogFunc = newLogFunc; }

  /**
   * Calls the currently registered logging function.
   */
  function log(str) { myLogFunc(String___(str)); }

  /**
   * Like an assert that can't be turned off.
   * <p>
   * Either returns true (on success) or throws (on failure). The
   * arguments starting with {@code var_args} are converted to
   * strings and appended together to make the message of the Error
   * that's thrown.
   * <p>
   * TODO(erights) We may deprecate this in favor of <pre>
   *     if (!test) { throw new Error(var_args...); }
   * </pre>
   */
  function enforce(test, var_args) {
    if (!test) { throw new Error(Array___.slice___(arguments, 1).join('')); }
    return true;
  }

  /**
   * Enforces {@code typeOf(specimen) === typename}, in which case
   * specimen is returned.
   * <p>
   * If not, throws an informative TypeError
   * <p>
   * opt_name, if provided, should be a name or description of the
   * specimen used only to generate friendlier error messages.
   */
  function enforceType(specimen, typename, opt_name) {
    if (typeOf(specimen) !== typename) {
      throw new TypeError('expected ' + typename + ' instead of ' +
          typeOf(specimen) + ': ' + (opt_name || specimen));
    }
    return specimen;
  }

  /**
   * Enforces that specimen is a non-negative integer within the range
   * of exactly representable consecutive integers, in which case
   * specimen is returned.
   * <p>
   * "Nat" is short for "Natural number".
   */
  function enforceNat(specimen) {
    enforceType(specimen, 'number');
    if (Math.floor(specimen) !== specimen) {
      throw new TypeError('Must be integral: ' + specimen);
    }
    if (specimen < 0) {
      throw new TypeError('Must not be negative: ' + specimen);
    }
    // Could pre-compute precision limit, but probably not faster
    // enough to be worth it.
    if (Math.floor(specimen - 1) !== specimen - 1) {
      throw new TypeError('Beyond precision limit: ' + specimen);
    }
    if (Math.floor(specimen - 1) >= specimen) {
      throw new TypeError('Must not be infinite: ' + specimen);
    }
    return specimen;
  }

  /**
   * Returns a function that can typically be used in lieu of
   * {@code func}, but that logs a deprecation warning on first use.
   * <p>
   * Currently for internal use only, though may make this available
   * on {@code ___} or even {@code ses} at a later time, after
   * making it safe for such use. Forwards only arguments to
   * {@code func} and returns results back, without forwarding
   * {@code this}. If you want to deprecate an exophoric function,
   * deprecate a bind()ing of that function instead.
   */
  function deprecate(func, badName, advice) {
    var warningNeeded = true;
    return function() {
        if (warningNeeded) {
          log('"' + badName + '" is deprecated.\n' + advice);
          warningNeeded = false;
        }
        return func.apply___(USELESS, arguments);
      };
  }

  /**
   * Create a unique identification of a given table identity that can
   * be used to invisibly (to Cajita code) annotate a key object to
   * index into a table.
   * <p>
   * magicCount and MAGIC_TOKEN together represent a
   * unique-across-frames value safe against collisions, under the
   * normal Caja threat model assumptions. magicCount and
   * MAGIC_NAME together represent a probably unique across frames
   * value, with which can generate strings in which collision is
   * unlikely but possible.
   * <p>
   * The MAGIC_TOKEN is a unique unforgeable per-Cajita runtime
   * value. magicCount is a per-Cajita counter, which increments each
   * time a new one is needed.
   */
  var magicCount = 0;
  var MAGIC_NUM = Math.random();
  var MAGIC_TOKEN = Token('MAGIC_TOKEN_FOR:' + MAGIC_NUM);
  // Using colons in the below causes it to fail on IE since getting a
  // property whose name contains a colon on a DOM table element causes
  // an exception.
  var MAGIC_NAME = '_index;'+ MAGIC_NUM + ';';

  /**
   * 
   * Creates a new mutable associative table mapping from the
   * identity of arbitrary keys (as defined by tt>identical()</tt>) to
   * arbitrary values.
   * 
   * <p>Operates as specified by <a href=
   * "http://wiki.ecmascript.org/doku.php?id=harmony:weak_maps"
   * >weak maps</a>, including the optional parameters of the old 
   * <a href=
   * "http://wiki.ecmascript.org/doku.php?id=strawman:ephemeron_tables&rev=1269457867#implementation_considerations"
   * >Implementation Considerations</a> section regarding emulation on
   * ES3, except that, when {@code opt_useKeyLifetime} is falsy or
   * absent, the keys here may be primitive types as well.  
   * 
   * <p> To support Domita, the keys might be host objects.
   */
  function newTable(opt_useKeyLifetime, opt_expectedSize) {
    magicCount++;
    var myMagicIndexName = MAGIC_NAME + magicCount + '___';

    function setOnKey(key, value) {
      var ktype = typeof key;
      if (!key || (ktype !== 'function' && ktype !== 'object')) { 
        throw new TypeError("Can't use key lifetime on primitive keys: " + key);
      }
      var list = key[myMagicIndexName];
      // To distinguish key from objects that derive from it,
      //    list[0] should be === key
      // For odd positive i,
      //    list[i] is the MAGIC_TOKEN for a Cajita runtime (i.e., a
      //            browser frame in which the Cajita runtime has been
      //            loaded). The myMagicName and the MAGIC_TOKEN
      //            together uniquely identify a table.
      //    list[i+1] is the value stored in that table under this key.
      if (!list || list[0] !== key) {
        key[myMagicIndexName] = [key, MAGIC_TOKEN, value];
      } else {
        var i;
        for (i = 1; i < list.length; i += 2) {
          if (list[i] === MAGIC_TOKEN) { break; }
        }
        list[i] = MAGIC_TOKEN;
        list[i + 1] = value;
      }
    }

    function getOnKey(key) {
      var ktype = typeof key;
      if (!key || (ktype !== 'function' && ktype !== 'object')) { 
        throw new TypeError("Can't use key lifetime on primitive keys: " + key);
      }
      var list = key[myMagicIndexName];
      if (!list || list[0] !== key) {
        return void 0;
      } else {
        for (var i = 1; i < list.length; i += 2) {
          if (list[i] === MAGIC_TOKEN) { return list[i + 1]; }
        }
        return void 0;
      }
    }

    if (opt_useKeyLifetime) {
      return freeze({
          set: markFuncFreeze(setOnKey),
          get: markFuncFreeze(getOnKey)
        });
    }

    var myValues = [];

    function setOnTable(key, value) {
      var index;
      switch (typeof key) {
        case 'object':
        case 'function': {
          if (null === key) { myValues.prim_null = value; return; }
          index = getOnKey(key);
          if (value === void 0) {
            if (index === void 0) {
              return;
            } else {
              setOnKey(key, void 0);
            }
          } else {
            if (index === void 0) {
              index = myValues.length;
              setOnKey(key, index);
            }
          }
          break;
        }
        case 'string': {
          index = 'str_' + key;
          break;
        }
        default: { 
          index = 'prim_' + key;
          break; 
        }
      }
      if (value === void 0) {
        // TODO(erights): Not clear that this is the performant
        // thing to do when index is numeric and < length-1.
        delete myValues[index];
      } else {
        myValues[index] = value;
      }
    }

    /**
     * If the key is absent, returns {@code undefined}.
     * <p>
     * Users of this table cannot distinguish an {@code undefined}
     * value from an absent key.
     */
    function getOnTable(key) {
      switch (typeof key) {
        case 'object':
        case 'function': {
          if (null === key) { return myValues.prim_null; }
          var index = getOnKey(key);
          if (void 0 === index) { return void 0; }
          return myValues[index];
        }
        case 'string': { return myValues['str_' + key]; }
        default: { return myValues['prim_' + key]; }
      }
    }

    return freeze({
        set: markFuncFreeze(setOnTable),
        get: markFuncFreeze(getOnTable)
      });
  }

  ////////////////////////////////////////////////////////////////////////
  // Guards and Trademarks
  ////////////////////////////////////////////////////////////////////////

  /**
   * The identity function just returns its argument.
   */
  function identity(x) { return x; }

  /**
   * One-arg form is known in scheme as "call with escape
   * continuation" (call/ec), and is the semantics currently 
   * proposed for EcmaScript Harmony's "return to label".
   * 
   * <p>In this analogy, a call to {@code callWithEjector} emulates a
   * labeled statement. The ejector passed to the {@code attemptFunc}
   * emulates the label part. The {@code attemptFunc} itself emulates
   * the statement being labeled. And a call to {@code eject} with
   * this ejector emulates the return-to-label statement.
   * 
   * <p>We extend the normal notion of call/ec with an
   * {@code opt_failFunc} in order to give more the sense of a
   * {@code try/catch} (or similarly, the {@code escape} special
   * form in E). The {@code attemptFunc} is like the {@code try}
   * clause and the {@code opt_failFunc} is like the {@code catch}
   * clause. If omitted, {@code opt_failFunc} defaults to the
   * {@code identity} function. 
   * 
   * <p>{@code callWithEjector} creates a fresh ejector -- a one
   * argument function -- for exiting from this attempt. It then calls
   * {@code attemptFunc} passing that ejector as argument. If
   * {@code attemptFunc} completes without calling the ejector, then
   * this call to {@code callWithEjector} completes
   * likewise. Otherwise, if the ejector is called with an argument,
   * then {@code opt_failFunc} is called with that argument. The
   * completion of {@code opt_failFunc} is then the completion of the
   * {@code callWithEjector} as a whole.
   * 
   * <p>The ejector stays live until {@code attemptFunc} is exited,
   * at which point the ejector is disabled. Calling a disabled
   * ejector throws.
   * 
   * <p>In order to emulate the semantics I expect of ES-Harmony's
   * return-to-label and to prevent the reification of the internal
   * token thrown in order to emulate call/ec, {@code tameException}
   * immediately rethrows this token, preventing Cajita and Valija
   * {@code catch} clauses from catching it. However,
   * {@code finally} clauses will still be run while unwinding an
   * ejection. If these do their own non-local exit, that takes
   * precedence over the ejection in progress but leave the ejector
   * live.
   * 
   * <p>Historic note: This was first invented by John C. Reynolds in 
   * <a href="http://doi.acm.org/10.1145/800194.805852"
   * >Definitional interpreters for higher-order programming 
   * languages</a>. Reynold's invention was a special form as in E, 
   * rather than a higher order function as here and in call/ec.
   */
  function callWithEjector(attemptFunc, opt_failFunc) {
    var failFunc = opt_failFunc || identity;
    var disabled = false;
    var token = new Token('ejection');
    token.UNCATCHABLE___ = true;
    var stash = void 0;
    function ejector(result) {
      if (disabled) {
        throw new Error('ejector disabled');
      } else {
        // don't disable here.
        stash = result;
        throw token;
      }
    }
    markFuncFreeze(ejector);
    try {
      try {
        return callPub(attemptFunc, 'call', [USELESS, ejector]);
      } finally {
        disabled = true;
      }
    } catch (e) {
      if (e === token) {
        return callPub(failFunc, 'call', [USELESS, stash]);
      } else {
        throw e;
      }
    }
  }

  /**
   * Safely invokes {@code opt_ejector} with {@code result}.
   * <p>
   * If {@code opt_ejector} is falsy, disabled, or returns
   * normally, then {@code eject} throws. Under no conditions does
   * {@code eject} return normally.
   */
  function eject(opt_ejector, result) {
    if (opt_ejector) {
      callPub(opt_ejector, 'call', [USELESS, result]);
      throw new Error('Ejector did not exit: ', opt_ejector);
    } else {
      throw new Error(result);
    }
  }
  
  /**
   * Internal routine for making a trademark from a table.
   * <p>
   * To untangle a cycle, the guard made by {@code makeTrademark} is
   * not yet either stamped or frozen. The caller of
   * {@code makeTrademark} must do both before allowing it to
   * escape. 
   */
  function makeTrademark(typename, table) {
    typename = String___(typename);
    return freeze({
        toString: markFuncFreeze(function() { return typename + 'Mark'; }),
  
        stamp: freeze({
          toString: markFuncFreeze(function() { return typename + 'Stamp'; }),
          mark___: markFuncFreeze(function(obj) {
            table.set(obj, true);
            return obj;
          })
        }),
  
        guard: {
          toString: markFuncFreeze(function() { return typename + 'T'; }),
          coerce: markFuncFreeze(function(specimen, opt_ejector) {
            if (table.get(specimen)) { return specimen; }
            eject(opt_ejector,
                  'Specimen does not have the "' + typename + '" trademark');
          })
        }
      });
  }

  /**
   * Objects representing guards should be marked as such, so that
   * they will pass the {@code GuardT} guard.
   * <p>
   * {@code GuardT} is generally accessible as
   * {@code cajita.GuardT}. However, {@code GuardStamp} must not be
   * made generally accessible, but rather only given to code trusted
   * to use it to deem as guards things that act in a guard-like
   * manner: A guard MUST be immutable and SHOULD be idempotent. By
   * "idempotent", we mean that<pre>
   *     var x = g(specimen, ej); // may fail
   *     // if we're still here, then without further failure
   *     g(x) === x
   * </pre>
   */
  var GuardMark = makeTrademark('Guard', newTable(true));
  var GuardT = GuardMark.guard;
  var GuardStamp = GuardMark.stamp;
  freeze(GuardStamp.mark___(GuardT));  

  /**
   * The {@code Trademark} constructor makes a trademark, which is a
   * guard/stamp pair, where the stamp marks and freezes unfrozen
   * records as carrying that trademark and the corresponding guard
   * cerifies objects as carrying that trademark (and therefore as
   * having been marked by that stamp).
   * <p>
   * By convention, a guard representing the type-like concept 'Foo'
   * is named 'FooT'. The corresponding stamp is 'FooStamp'. And the
   * record holding both is 'FooMark'. Many guards also have
   * {@code of} methods for making guards like themselves but
   * parameterized by further constraints, which are usually other
   * guards. For example, {@code T.ListT} is the guard representing
   * frozen array, whereas {@code T.ListT.of(cajita.GuardT)}
   * represents frozen arrays of guards.
   */
  function Trademark(typename) {
    var result = makeTrademark(typename, newTable(true));
    freeze(GuardStamp.mark___(result.guard));
    return result;
  }
  markFuncFreeze(Trademark);

  /**
   * First ensures that g is a guard; then does 
   * {@code g.coerce(specimen, opt_ejector)}.
   */
  function guard(g, specimen, opt_ejector) {
    g = GuardT.coerce(g); // failure throws rather than ejects
    return g.coerce(specimen, opt_ejector);
  }

  /**
   * First ensures that g is a guard; then checks whether the specimen
   * passes that guard.
   * <p>
   * If g is a coercing guard, this only checks that g coerces the
   * specimen to something rather than failing. Note that trademark
   * guards are non-coercing, so if specimen passes a trademark guard,
   * then specimen itself has been marked with that trademark.
   */
  function passesGuard(g, specimen) {
    g = GuardT.coerce(g); // failure throws rather than ejects
    return callWithEjector(
      markFuncFreeze(function(opt_ejector) {
        g.coerce(specimen, opt_ejector);
        return true;
      }),
      markFuncFreeze(function(ignored) {
        return false;
      })
    );
  }

  /**
   * Given that {@code stamps} is a list of stamps and
   * {@code record} is a non-frozen record, this marks record with
   * the trademarks of all of these stamps, and then freezes and
   * returns the record.
   * <p>
   * If any of these conditions do not hold, this throws.
   */
  function stamp(stamps, record) {
    if (!isRecord(record)) {
      throw new TypeError('Can only stamp records: ' + record);
    }
    if (isFrozen(record)) {
      throw new TypeError("Can't stamp frozen objects: " + record);
    }
    stamps = Array___.slice___(stamps, 0);
    var numStamps = stamps.length >>> 0;
    // First ensure that we will succeed before applying any stamps to
    // the record.
    for (var i = 0; i < numStamps; i++) {
      if (!('mark___' in stamps[i])) {
        throw new TypeError("Can't stamp with a non-stamp: " + stamps[i]);
      }
    }
    // Looping again over the same untrusted stamps alleged-array is safe
    // assuming single-threaded execution and non-mutating accessors.
    for (var i = 0; i < numStamps; i++) {
      // Only works for real stamps, postponing the need for a
      // user-implementable auditing protocol.
      stamps[i].mark___(record);
    }
    return freeze(record);
  }

  ////////////////////////////////////////////////////////////////////////
  // Sealing and Unsealing
  ////////////////////////////////////////////////////////////////////////

  /**
   * Returns a pair of functions such that the seal(x) wraps x in an object
   * so that only unseal can get x back from the object.
   * <p>
   * TODO(erights): The only remaining use as of this writing is
   * in domita for css. Perhaps a refactoring is in order.
   *
   * @return {object} of the form
   *     { seal: function seal(x) { return Token('(box)'); },
   *       unseal: function unseal(box) { return x; } }.
   */
  function makeSealerUnsealerPair() {
    var table = newTable(true);
    var undefinedStandin = {};
    function seal(payload) {
      if (payload === void 0) {
        payload = undefinedStandin;
      }
      var box = Token('(box)');
      table.set(box, payload);
      return box;
    }
    function unseal(box) {
      var payload = table.get(box);
      if (payload === void 0) {
        throw new TypeError('Sealer/Unsealer mismatch'); 
      } else if (payload === undefinedStandin) {
        return void 0;
      } else {
        return payload;
      }
    }
    return freeze({
        seal: markFuncFreeze(seal),
        unseal: markFuncFreeze(unseal)
      });
  }

  /**
   * A call to cajita.manifest(data) is dynamically ignored, but if the
   * data expression is valid static JSON text, its value is made
   * statically available to the module loader.
   * <p>
   * TODO(erights): Find out if this is still the plan.
   */
  function manifest(ignored) {}

  /**
   * Privileged code attempting to read an imported value from a module's
   * {@code IMPORTS___}. This function is NOT available to ES5/3 code.
   * <p>
   * This delegates to {@code Get___}, and so will only read
   * those properties from module_imports that are visible to ES5/3 code.
   */
  function readImport(module_imports, name, opt_permitsUsed) {
    name = String___(name);
    if (!module_imports.HasProperty___(name)) {
      log('Linkage warning: ' + name + ' not importable');
      return void 0;
    }
    var result = module_imports.Get___(name);
    if (opt_permitsUsed) {
      enforceStaticPath(result, opt_permitsUsed);
    }
    return result;
  }

  /**
   * Receives whatever was caught by a user defined try/catch block.
   *
   * @param ex A value caught in a try block.
   * @return The value to make available to the cajoled catch block.
   */
  function tameException(ex) {
    if (ex && ex.UNCATCHABLE___) { throw ex; }
    try {
      switch (typeOf(ex)) {
        case 'string':
        case 'number':
        case 'boolean': 
        case 'undefined': {
          // Immutable.
          return ex;
        }
        case 'object': {
          if (ex === null) { return null; }
          if (ex.throwable___) { return ex; }
          if (({}).toString.call(ex) === '[object Error]') {
            return freeze(ex);
          }
          return '' + ex;
        }
        case 'function': {
          // According to Pratap Lakhsman's "JScript Deviations" S2.11
          // If the caught object is a function, calling it within the catch
          // supplies the head of the scope chain as the "this value".  The
          // called function can add properties to this object.  This implies
          // that for code of this shape:
          //     var x;
          //     try {
          //       // ...
          //     } catch (E) {
          //       E();
          //       return x;
          //     }
          // The reference to 'x' within the catch is not necessarily to the
          // local declaration of 'x'; this gives Catch the same performance
          // problems as with.

          // We return a different, powerless function instead.
          var name = '' + (ex.name || ex);
          function inLieuOfThrownFunction() {
            return 'In lieu of thrown function: ' + name;
          }
          return markFuncFreeze(inLieuOfThrownFunction, name);
        }
        default: {
          log('Unrecognized exception type: ' + (typeOf(ex)));
          return 'Unrecognized exception type: ' + (typeOf(ex));
        }
      }
    } catch (_) {
      // Can occur if coercion to string fails, or if ex has getters
      // that fail. This function must never throw an exception
      // because doing so would cause control to leave a catch block
      // before the handler fires.
      log('Exception during exception handling.');
      return 'Exception during exception handling.';
    }
  }

  ///////////////////////////////////////////////////////////////////
  // Specification
  ///////////////////////////////////////////////////////////////////

  /**
   * 4. Overview
   */

  /**
   * 4.2 Language Overview
   */

  /**
   * 8. Types
   */

  function Type(x) {
    // 8.1
    if (x === void 0) { return 'Undefined'; }
    // 8.2
    if (x === null) { return 'Null'; }
    // 8.3
    if (x === true || x === false) { return 'Boolean'; }
    var tx = typeof x;
    // 8.4
    if (tx === 'string') { return 'String'; }
    // 8.5
    if (tx === 'number') { return 'Number'; }
    // 8.6
    return 'Object';
  }

  /**
   * 8.6 Object type
   */

  // 8.6.1
  var attributeDefaults = {
      value: void 0,
      get: void 0,
      set: void 0,
      writable: false,
      enumerable: false,
      configurable: false
    };

  // 8.6.2
  function isPrimitive(x) {
    return Type(x) !== 'Object';
  }

  /**
   * 8.7 The Reference Specification Type
   */

  // 8.7.1
  function GetValue(obj, name) {
    if (obj === null || obj === void 0) {
      throw new TypeError(obj + ' has no properties.');
    }
    return obj.Get___(name);
  }
  
  // 8.7.2
  function PutValue(obj, name, val) {
    if (obj === null || obj === void 0) {
      throw new TypeError(obj + ' has no properties.');
    }
    return obj.Put___(name, val);
  }

  /**
   * 8.10 The Property Descriptor and Property Identifier Specification Types
   */

  // 8.10.1
  function IsAccessorDescriptor(Desc) {
    if (Desc === void 0) { return false; }
    if ('get' in Desc) { return true; }
    if ('set' in Desc) { return true; }
    return false;
  }

  // 8.10.2
  function IsDataDescriptor(Desc) {
    if (Desc === void 0) { return false; }
    if ('value' in Desc) { return true; }
    if ('writable' in Desc) { return true; }
    return false;
  }

  // 8.10.3
  function IsGenericDescriptor(Desc) {
    if (Desc === void 0) { return false; }
    if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) { 
      return true; 
    }
    return false;
  }

  // 8.10.4
  function FromPropertyDescriptor(Desc) {
    function copyProp(Desc, obj, name) {
      obj.DefineOwnProperty___(name, {
          value: Desc[name],
          writable: true,
          enumerable: true,
          configurable: true
        });
    }

    // 1. If Desc is undefined, then return undefined. 
    if (Desc === void 0) { return void 0; }
    // 2. Let obj be the result of creating a new object
    //    as if by the expression new Object() where Object is the standard 
    //    built-in constructor with that name.
    var obj = {};
    // 3. If IsDataDescriptor(Desc) is true, then
    if (IsDataDescriptor(Desc)) {
      // a. Call the [[DefineOwnProperty]] internal method of obj
      //    with arguments "value", Property Descriptor {
      //      [[Value]]:Desc.[[Value]], 
      //      [[Writable]]: true, 
      //      [[Enumerable]]: true,
      //      [[Configurable]]: true
      //    }, and false.
      copyProp(Desc, obj, 'value');
      // b. Call the [[DefineOwnProperty]] internal method of obj
      //    with arguments "writable", Property Descriptor {[[Value]]:
      //    Desc.[[Writable]], [[Writable]]: true, [[Enumerable]]:
      //    true, [[Configurable]]: true}, and false.
      copyProp(Desc, obj, 'writable');
    }
    // 4. Else, IsAccessorDescriptor(Desc) must be true, so
    else {
      // a. Call the [[DefineOwnProperty]] internal method of obj
      //    with arguments "get", Property Descriptor {[[Value]]:
      //    Desc.[[Get]], [[Writable]]: true, [[Enumerable]]: true,
      //    [[Configurable]]: true}, and false.
      copyProp(Desc, obj, 'get');
      // b. Call the [[DefineOwnProperty]] internal method of obj
      //    with arguments "set", Property Descriptor {[[Value]]:
      //    Desc.[[Set]], [[Writable]]: true, [[Enumerable]]: true,
      //    [[Configurable]]: true}, and false.
      copyProp(Desc, obj, 'set');
    }
    // 5. Call the [[DefineOwnProperty]] internal method of obj with
    //    arguments "enumerable", Property Descriptor {[[Value]]:
    //    Desc.[[Enumerable]], [[Writable]]: true, [[Enumerable]]: true,
    //    [[Configurable]]: true}, and false.
    copyProp(Desc, obj, 'enumerable');
    // 6. Call the [[DefineOwnProperty]] internal method of obj with
    //    arguments "configurable", Property Descriptor {[[Value]]:
    //    Desc.[[Configurable]], [[Writable]]: true, [[Enumerable]]:
    //    true, [[Configurable]]: true}, and false.
    copyProp(Desc, obj, 'configurable');
    // 7. Return obj.
    return obj;
  }

  // 8.10.5
  function ToPropertyDescriptor(Obj) {
    // 1. If Type(Obj) is not Object throw a TypeError exception.
    if (Type(Obj) !== 'Object') { 
      throw new TypeError('Expected an object.'); 
    }
    // 2. Let desc be the result of creating a new Property 
    //    Descriptor that initially has no fields.
    var desc = {};
    // 3. If the result of calling the [[HasProperty]]
    //    internal method of Obj with argument "enumerable" is true, then
    //   a. Let enum be the result of calling the [[Get]]
    //      internal method of Obj with "enumerable".
    //   b. Set the [[Enumerable]] field of desc to ToBoolean(enum).
    if (Obj.HasProperty___('enumerable')) { 
      desc.enumerable = !!GetValue(Obj, 'enumerable'); 
    }
    // 4. If the result of calling the [[HasProperty]]
    //    internal method of Obj with argument "configurable" is true, then
    //   a. Let conf  be the result of calling the [[Get]]
    //      internal method of Obj with argument "configurable".
    //   b. Set the [[Configurable]] field of desc to ToBoolean(conf).
    if (Obj.HasProperty___('configurable')) { 
      desc.configurable = !!GetValue(Obj, 'configurable'); 
    }
    // 5. If the result of calling the [[HasProperty]]
    //    internal method of Obj with argument "value" is true, then
    //   a. Let value be the result of calling the [[Get]]
    //      internal method of Obj with argument "value".
    //   b. Set the [[Value]] field of desc to value.
    if (Obj.HasProperty___('value')) {
      desc.value = GetValue(Obj, 'value'); 
    }
    // 6. If the result of calling the [[HasProperty]]
    //    internal method of Obj with argument "writable" is true, then
    // a. Let writable be the result of calling the [[Get]]
    //    internal method of Obj with argument "writable".
    // b. Set the [[Writable]] field of desc to ToBoolean(writable).
    if (Obj.HasProperty___('writable')) {
      desc.writable = !!GetValue(Obj, 'writable');
    }
    // 7. If the result of calling the [[HasProperty]]
    //    internal method of Obj with argument "get" is true, then
    if (Obj.HasProperty___('get')) {
      // a. Let getter be the result of calling the [[Get]]
      //    internal method of Obj with argument "get".
      var getter = GetValue(Obj, 'get');
      // b. If IsCallable(getter) is false and getter is not
      //    undefined, then throw a TypeError exception.
      if (!isFunction(getter) && getter !== void 0) {
        throw new TypeError('Getter attributes must be functions or undef.');
      }
      // c. Set the [[Get]] field of desc to getter.
      desc.get = getter;
    }
    // 8. If the result of calling the [[HasProperty]]
    //    internal method of Obj with argument "set" is true, then
    if (Obj.HasProperty___('set')) {
      // a. Let setter be the result of calling the [[Get]]
      //    internal method of Obj with argument "set".
      var setter = GetValue(Obj, 'set');
      // b. If IsCallable(setter) is false and setter is not
      //    undefined, then throw a TypeError exception.
      if (!isFunction(setter) && setter !== void 0) {
        throw new TypeError('Setter attributes must be functions or undef.');
      }
      // c. Set the [[Set]] field of desc to setter.
      desc.set = setter;
    }
    // 9. If either desc.[[Get]] or desc.[[Set]] are present, then
    if ('set' in desc || 'get' in desc) {
      // a. If either desc.[[Value]] or desc.[[Writable]] are present,
      //    then throw a TypeError exception.
      if ('value' in desc) { 
        throw new TypeError('Accessor properties must not have a value.'); 
      }
      if ('writable' in desc) { 
        throw new TypeError('Accessor properties must not be writable.'); 
      }
    }
    // 10. Return desc.
    return desc;
  }

  /**
   * 8.12 Algorithms for Object Internal Methods
   * 
   * Preconditions: {@code P} is a number or a string.
   */
  // 8.12.1
  // Note that the returned descriptor is for internal use only, so
  // nothing is whitelisted. 
  Object.prototype.GetOwnProperty___ = function (P) {
      var O = this;
      if (isNumericName(P)) {
        if (O.hasOwnProperty___(P)) {
          return {
              value: O[P],
              writable: isWritable(O, 'NUM___'),
              configurable: isConfigurable(O, 'NUM___'),
              enumerable: true
            };
        } else {
          return void 0;
        }
      }
      assertValidPropertyName(P);
      // 1. If O doesn't have an own property with name P, return undefined.
      if (!hasOwnProperty(O, P)) { return void 0; }
      // 2. Let D be a newly created Property Descriptor with no fields.
      var D = {};
      // 3. Let X be O's own property named P.
      // 4. If X is a data property, then
      if (hasValue(O, P)) {
        // a. Set D.[[Value]] to the value of X's [[Value]] attribute.
        D.value = O[P];
        // b. Set D.[[Writable]] to the value of X's [[Writable]] attribute
        D.writable = isWritable(O, P);
      } else {
        // 5. Else X is an accessor property, so
        // a. Set D.[[Get]] to the value of X's [[Get]] attribute.
        D.get = getter(O, P);
        // b. Set D.[[Set]] to the value of X's [[Set]] attribute.
        D.set = setter(O, P);
      }
      // 6. Set D.[[Enumerable]] to the value of X's [[Enumerable]] attribute.
      D.enumerable = isEnumerable(O, P);
      // 7. Set D.[[Configurable]] to the value of X's
      // [[Configurable]] attribute. 
      D.configurable = isConfigurable(O, P);
      // 8. Return D.
      return D;
    };

  // 8.12.3
  Object.prototype.Get___ = function (P) {
      P = String___(P);
      if (isNumericName(P)) { return this[P]; }
      assertValidPropertyName(P);
      // Is P an accessor property on this?
      var g = getter(this, P);
      if (g) { return g.f___(this); }
      // Is it whitelisted as a value?
      if (hasValue(this, P)) { return this[P]; }
      return void 0;
    };

  // 8.12.5
  Object.prototype.Put___ = function (P, V) {
      var thisExtensible = isExtensible(this);
      P = String___(P);
      assertValidPropertyName(P);
      if (!thisExtensible) {
        if (wouldExtend(this, P)) {
          throw new TypeError("Could not create the property '" + 
              P + "': " + this + " is not extensible.");
        }
      }
      // Numeric indices are never accessor properties
      // and are all governed by a single property descriptor.
      // At this point, obj is either extensible or
      // non-extensible but already has the property in question.
      if(isNumericName(P)) {
        if (isWritable(this, 'NUM___') || !this.hasNumerics___()) {
          return this[P] = V;
        } else {
          throw new TypeError("The property '" + P + "' is not writable.");
        }
      }
      assertValidPropertyName(this, P);
      // Is name an accessor property on obj?
      var s = setter(this, P);
      if (s) { return s.f___(this, [V]); }
  
      // Does the property exist and is it whitelisted as writable?
      if (isWritable(this, P)) {
        fastpathWrite(this, P);
        return this[P] = V;
      }
      // If it doesn't exist, is the object extensible?
      if (!this.hasOwnProperty___(P) && isExtensible(this)) {
        this.DefineOwnProperty___(P, {
            value: V,
            writable: true,
            configurable: true,
            enumerable: true
          });
        return V;
      }
      throw new TypeError("The property '" + P + "' is not writable.");
    };

  // 8.12.6
  /** 
   * Precondition: P is a number or string; this is to prevent testing
   * P and the string coersion having side effects.
   */
  Object.prototype.HasProperty___ = function (P) {
      if (isNumericName(P)) { return P in this; }
      return (P + '_v___' in this);
    };

  // 8.12.7
  /** Precondition: P is a number or a string */
  Object.prototype.Delete___ = function (P) {
      var O = this;
      // 1. Let desc be the result of calling the [[GetOwnProperty]]
      //    internal method of O with property name P. 
      var desc = O.GetOwnProperty___(P);
      // 2. If desc is undefined, then return true.
      if (!desc) { return true; }
      // 3. If desc.[[Configurable]] is true, then
      if (desc.configurable) {
        if (isNumericName(P)) {
          delete O[P];
          return true;
        }
        // a. Remove the own property with name P from O.
        delete O[P];
        delete O[P + '_v___'];
        delete O[P + '_w___'];
        delete O[P + '_gw___'];
        delete O[P + '_g___'];
        delete O[P + '_s___'];
        delete O[P + '_c___'];
        delete O[P + '_e___'];
        delete O[P + '_m___'];
        // b. Return true.
        return true;
      }
      // 4. Else if Throw, then throw a TypeError exception.
      // [This is strict mode, so Throw is always true.]
      throw new TypeError("Cannot delete '" + P + "' on " + obj);
      // 5. Return false.
    };

  // 8.12.9
  // Preconditions:
  //   Desc is an internal property descriptor.
  //   P is a number or a string.
  Object.prototype.DefineOwnProperty___ = function (P, Desc) {
      if (isNumericName(P)) {
        throw new TypeError('Cannot define numeric properties.');
      }
      var O = this;
      // 1. Let current be the result of calling the [[GetOwnProperty]]
      //    internal method of O with property name P.
      var current = O.GetOwnProperty___(P);
      // 2. Let extensible be the value of the [[Extensible]] internal
      //    property of O. 
      var extensible = isExtensible(O);
      // 3. If current is undefined and extensible is false, then Reject.
      if (!current && !extensible) {
        throw new TypeError('This object is not extensible.');
      }
      // 4. If current is undefined and extensible is true, then
      if (!current && extensible) {
        // a. If  IsGenericDescriptor(Desc) or IsDataDescriptor(Desc)
        //    is true, then 
        if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
          // i. Create an own data property named P of object O whose
          //    [[Value]], [[Writable]], [[Enumerable]] and
          //    [[Configurable]] attribute values are described by
          //    Desc. If the value of an attribute field of Desc is
          //    absent, the attribute of the newly created property is
          //    set to its default value.
          O[P] = Desc.value;
          O[P + '_v___'] = O;
          O[P + '_w___'] = false;
          O[P + '_gw___'] = Desc.writable ? O : false;
          O[P + '_e___'] = Desc.enumerable ? O : false;
          O[P + '_c___'] = Desc.configurable ? O : false;
          O[P + '_g___'] = void 0;
          O[P + '_s___'] = void 0;
          O[P + '_m___'] = false;
        }
        // b. Else, Desc must be an accessor Property Descriptor so,
        else {
          // i. Create an own accessor property named P of object O
          //    whose [[Get]], [[Set]], [[Enumerable]] and
          //    [[Configurable]] attribute values are described by
          //    Desc. If the value of an attribute field of Desc is
          //    absent, the attribute of the newly created property is
          //    set to its default value. 
          if (Desc.configurable) { O[P] = void 0; }
          O[P + '_v___'] = false;
          O[P + '_w___'] =  O[P + '_gw___'] = false;
          O[P + '_e___'] = Desc.enumerable ? O : false;
          O[P + '_c___'] = Desc.configurable ? O : false;
          O[P + '_g___'] = Desc.get;
          O[P + '_s___'] = Desc.set;
          O[P + '_m___'] = false;
        }
        // c. Return true.
        return true;
      }
      // 5. Return true, if every field in Desc is absent.
      if (!('value' in Desc ||
          'writable' in Desc ||
          'enumerable' in Desc ||
          'configurable' in Desc ||
          'get' in Desc ||
          'set' in Desc)) {
        return true;
      }
      // 6. Return true, if every field in Desc also occurs in current
      //    and the value of every field in Desc is the same value as the
      //    corresponding field in current when compared using the
      //    SameValue algorithm (9.12). 
      var allHaveAppearedAndAreTheSame = true;
      for (var i in Desc) {
        if (!Desc.hasOwnProperty___(i)) { continue; }
        if (!SameValue(GetValue(current, i), Desc[i])) {
          allHaveAppearedAndAreTheSame = false;
          break;
        }
      }
      if (allHaveAppearedAndAreTheSame) { return true; }
      // 7. If the [[Configurable]] field of current is false then
      if (!current.configurable) {
        // a. Reject, if the [Cofigurable]] field of Desc is true.
        if (Desc.configurable) { 
          throw new TypeError("The property '" + P +
              "' is not configurable.");
        }
        // b. Reject, if the [[Enumerable]] field of Desc is present
        //    and the [[Enumerable]] fields of current and Desc are
        //    the Boolean negation of each other.
        if ('enumerable' in Desc && Desc.enumerable !== current.enumerable) {
          throw new TypeError("The property '" + P +
              "' is not configurable.");
        }
      }
      var iddCurrent = IsDataDescriptor(current);
      var iddDesc = IsDataDescriptor(Desc);
      // 8. If IsGenericDescriptor(Desc) is true, then no further
      //    validation is required. 
      if (IsGenericDescriptor(Desc)) {
        // Do nothing
      }
      // 9. Else, if IsDataDescriptor(current) and IsDataDescriptor(Desc)
      //    have different results, then
      else if (iddCurrent !== iddDesc) {
        // a. Reject, if the [[Configurable]] field of current is false.
        if (!current.configurable) { 
          throw new TypeError("The property '" + P +
              "' is not configurable.");
        }
        // b. If IsDataDescriptor(current) is true, then
        if (iddCurrent) {
          // i. Convert the property named P of object O from a data
          //    property to an accessor property. Preserve the existing
          //    values of the converted property's [[Configurable]] and
          //    [[Enumerable]] attributes and set the rest of the
          //    property's attributes to their default values. 
          O[P] = void 0;
          O[P + '_v___'] = false;
          O[P + '_w___'] =  O[P + '_gw___'] = false;
          // O[P + '_e___'] = O[P + '_e___'];
          // O[P + '_c___'] = O[P + '_c___'];
          O[P + '_g___'] = void 0;
          O[P + '_s___'] = void 0;
          O[P + '_m___'] = false;
        } 
        // c. Else,
        else {
          // i. Convert the property named P of object O from an
          //    accessor property to a data property. Preserve the
          //    existing values of the converted property's
          //    [[Configurable]] and [[Enumerable]] attributes and set
          //    the rest of the property's attributes to their default
          //    values. 
          O[P] = Desc.value;
          O[P + '_v___'] = O;
          O[P + '_w___'] = O[P + '_gw___'] = false;
          // O[P + '_e___'] = O[P + '_e___'];
          // O[P + '_c___'] = O[P + '_c___'];
          O[P + '_g___'] = void 0;
          O[P + '_s___'] = void 0;
          O[P + '_m___'] = false;
        }
      }
      // 10. Else, if IsDataDescriptor(current) and
      //     IsDataDescriptor(Desc) are both true, then 
      else if (iddCurrent && iddDesc) {
        // a. If the [[Configurable]] field of current is false, then
        if (!current.configurable) {
          // i. Reject, if the [[Writable]] field of current is false
          //    and the [[Writable]] field of Desc is true. 
          if (!current.writable && Desc.writable) {
            throw new TypeError("The property '" + P +
                "' is not configurable.");
          }
          // ii. If the [[Writable]] field of current is false, then
          if (!current.writable) {
            // 1. Reject, if the [[Value]] field of Desc is present and 
            //    SameValue(Desc.[[Value]], current.[[Value]]) is false.
            if ('value' in Desc && !SameValue(Desc.value, current.value)) {
              throw new TypeError("The property '" + P +
                  "' is not writable.");
            }
          }
        }
        // b. else, the [[Configurable]] field of current is true, so
        //    any change is acceptable. (Skip to 12) 
      }
      // 11. Else, IsAccessorDescriptor(current) and
      //     IsAccessorDescriptor(Desc) are both true so, 
      else {
        // a. If the [[Configurable]] field of current is false, then
        if (!current.configurable) {
          // i. Reject, if the [[Set]] field of Desc is present and
          //    SameValue(Desc.[[Set]], current.[[Set]]) is false.
          // ii. Reject, if the [[Get]] field of Desc is present and
          //     SameValue(Desc.[[Get]], current.[[Get]]) is false.
          if (('set' in Desc && !SameValue(Desc.set, current.set)) ||
              ('get' in Desc && !SameValue(Desc.get, current.get))) {
            throw new TypeError("The property '" + P +
                "' is not configurable.");
          }
        }
      }
      // 12. For each attribute field of Desc that is present,
      //     set the correspondingly named attribute of the property
      //     named P of object O to the value of the field.
      if (iddDesc) {
        O[P] = Desc.value;
        O[P + '_v___'] = O;
        O[P + '_gw___'] = Desc.writable ? O : false;
        O[P + '_g___'] = O[P + '_s___'] = void 0;
      } else {
        O[P + '_v___'] = false;
        O[P + '_gw___'] = false;
        O[P + '_g___'] = Desc.get;
        O[P + '_s___'] = Desc.set;
      }
      O[P + '_e___'] = Desc.enumerable ? O : false;
      O[P + '_c___'] = Desc.configurable ? O : false;
      O[P + '_m___'] = false;
      O[P + '_w___'] = false;
      // 13. Return true.
      return true;
    };

  /**
   * 9 Type Conversion and Testing
   */

  // 9.6
  function ToUint32(input) {
    return input >>> 0;
  }

  // 9.9
  function ToObject(input) {
    var t = Type(input);
    switch(t) {
      case 'Undefined':
      case 'Null':
        throw new TypeError();
      case 'Boolean':
        return new Boolean___.new___(input);
      case 'Number':
        return new Number___.new___(input);
      case 'String':
        return new String___.new___(input);
      case 'Object':
        return input;
    }
  }

  // 9.12
  /**
   * Are x and y not observably distinguishable?
   */
  function SameValue(x, y) {
    if (x === y) {
      // 0 === -0, but they are not identical
      return x !== 0 || 1/x === 1/y;
    } else {
      // NaN !== NaN, but they are identical.
      // NaNs are the only non-reflexive value, i.e., if x !== x,
      // then x is a NaN.
      return x !== x && y !== y;
    }
  }


  /**
   * 11 Expressions
   */

  /**
   * Throws an exception if the value is an unmarked function.
   */
  function asFirstClass(value) {
    if (isFunction(value) && value.f___ === Function.prototype.f___) {
      var err = new Error('Internal: toxic function encountered!');
      err.UNCATCHABLE___ = true;
      throw err;
    }
    return value;
  }

  // 11.1.5
  /**
   * Creates a well formed SES record from a list of alternating
   * keys and values. 
   * <p>
   * The translator translates SES object literals into calls to
   * {@code initializeMap} so that a potentially toxic function
   * cannot be made the {@code toString} property of even a temporary
   * object. 
   */
  function initializeMap(list) {
    var result = {};
    for (var i = 0; i < list.length; i += 2) {
      // Call asFirstClass() here to prevent, for example, a toxic
      // function being used as the toString property of an object
      // literal.
      if (isNumericName(list[i])) {
        result[list[i]] = asFirstClass(list[i + 1]);
      } else {
        result.DefineOwnProperty___(
            list[i], 
            {
              value: asFirstClass(list[i + 1]),
              writable: true,
              enumerable: true,
              configurable: true
            });
      }
    }
  }

  // 11.2.3
  /**
   * Makes a [[ThrowTypeError]] function, as defined in section 13.2.3
   * of the ES5 spec.
   * 
   * <p>The informal name for the [[ThrowTypeError]] function, defined
   * in section 13.2.3 of the ES5 spec, is the "poison pill". The poison
   * pill is simply a no-argument function that, when called, always
   * throws a TypeError. Since we wish this TypeError to carry useful
   * diagnostic info, we violate the ES5 spec by defining 4 poison
   * pills with 4 distinct identities.
   * 
   * <p>A poison pill is installed as the getter & setter of the
   * de-jure (arguments.callee) and de-facto non-strict magic stack
   * inspection properties, which no longer work in ES5/strict, since
   * they violate encapsulation. Rather than simply remove them,
   * access to these properties is poisoned in order to catch errors
   * earlier when porting old non-strict code.
   */
  function makePoisonPill(badThing) {
    function poisonPill() {
      throw new TypeError('' + badThing + ' is forbidden by ES5/strict');
    }
    return markFunc(poisonPill);
  }
  var poisonFuncCaller = makePoisonPill("A function's .caller");
  var poisonFuncArgs = makePoisonPill("A function's .arguments");

  /**
   * Function calls g(args) get translated to g.f___(___.USELESS, args)
   * Tamed functions and cajoled functions install an overriding fastpath f___
   * to apply___, the original Function.prototype.apply.
   */
  Function.prototype.f___ = callFault;
  Function.prototype.i___ = function(var_args) {
      return this.f___(___.USELESS, Array___.slice___(arguments, 0));
    };
  Function.prototype.new___ = callFault;
  Function.prototype.DefineOwnProperty___(
      'arguments',
      {
        enumerable: false,
        configurable: true,
        get: poisonFuncArgs,
        set: poisonFuncArgs
      });
  Function.prototype.DefineOwnProperty___(
      'caller',
      {
        enumerable: false,
        configurable: true,
        get: poisonFuncCaller,
        set: poisonFuncCaller
      });

  // 11.2.4
  var poisonArgsCallee = makePoisonPill('arguments.callee');
  var poisonArgsCaller = makePoisonPill('arguments.caller');

  /**
   * Given either an array or an actual arguments object, return
   * Cajita's emulation of an ES5/strict arguments object.
   */
  function args(original) {
    // Throw away {@code dis___}.
    Array___.prototype.shift___.call___(original);
    var result = initializeMap(['length', 0]);
    Array___.prototype.push___.apply___(result, original);
    result.CLASS___ = 'Arguments';
    result.DefineOwnProperty___(
        'callee',
        {
          enumerable: false,
          configurable: true,
          get: poisonArgsCallee,
          set: poisonArgsCallee
        });
    result.DefineOwnProperty___(
        'caller',
        {
          enumerable: false,
          configurable: true,
          get: poisonArgsCaller,
          set: poisonArgsCaller
        });
    return result;
  }

  // 11.2.5
  /**
   * Takes a method of the form
   * <code>function (dis___, var_args) { ... }</code>
   * and a function name.
   * 
   * Returns a function object with {@code call, bind}, and {@code apply}
   * defined in such a way that it won't be invoked with {@code this}
   * bound to the global object. 
   */
  function wrap(disfunction, name) {
    // For providing to uncajoled code
    function f(var_args) {
      var a = Array___.slice___(arguments, 0);
      a.unshift('___' in this ? void 0: this);
      return disfunction.apply___(USELESS, a);
    }
    f.call = disfunction;
    f.apply = markFunc(function (dis___, as) {
        var a = Array___.slice___(as, 0);
        a.unshift(dis___);
        return disfunction.apply___(USELESS, a);
      });
    // The cajoler translates an invocation
    // g(args) to g.f___(___.USELESS, [args])
    f.f___ = f.apply___;
    f.new___ = f;
    // TODO: remove dis___ in the parameter list
    f.toString = (function (str) {
        return markFunc(function () {
            return str;
          });
      })(disfunction.toString());
    return f;
  }

  // 11.8.7
  /**
   * Implements SES's {@code <i>name</i> in <i>obj</i>}
   * 
   * Precondition: name is a string
   */
  function isIn(name, obj) {
    var t = Type(obj);
    if (t !== 'Object') { 
      throw new TypeError('Invalid "in" operand: ' + obj); 
    }
    return obj.HasProperty___(name);
  }

  /**
   * 15 Standard Built-in ECMAScript Objects
   */

  // 15.1.3.1--4
  markFunc(decodeURI);
  markFunc(decodeURIComponent);
  markFunc(encodeURI);
  markFunc(encodeURIComponent);

  // 15.2.1.1
  Object.f___ = markFunc(function (dis, as) {
      var len = as.length;
      if (len === 0 || as[0] === null || as[0] === void 0) {
        return initializeMap([]);
      }
      return ToObject(as[0]);
    });

  // 15.2.2.1
  Object.new___ = markFunc(function (value) {
      return Object___.f___(USELESS, [value]);
    });

  // 15.2.3.1
  Object.DefineOwnProperty___('prototype', {
      value: Object.prototype,
      writable: false,
      enumerable: false,
      configurable: false
    });

  // 15.2.3.2
  Object.getPrototypeOf = function (obj) {
      if (!Object___.hasOwnProperty___('Prototype___')) {
        // I know I said not to feature test for __proto__. But if we're
        // feature testing for getOwnProperty anyway, we may as well
        // feature test for __proto__ also.
        if ({}.__proto__ === Object___.prototype) {
          obj.Prototype___ = obj.__proto__;
        } else {
          // FIXME: Adapt tricks from cajita.js to find the prototype
          // and, if successful, store the result on obj.Prototype___.
          // Otherwise throw.
          throw new Error("Not supported in this browser.");
        }
      }
      return obj.Prototype___;
    };
  Object.getPrototypeOf___ = Object.getPrototypeOf;

  // 15.2.3.3
  function getOwnPropertyDescriptor(obj, P) {
    // 1. If Type(object) is not Object throw a TypeError exception. 
    if (Type(obj) !== 'Object') {
      throw new TypeError('Expected an object.');
    }
    // 2. Let name be ToString(P).
    var name = '' + P;
    // 3. Let desc be the result of calling the [[GetOwnProperty]]
    //    internal method of obj with argument name.
    var desc = obj.GetOwnProperty___(name);
    // 4. Return the result of calling FromPropertyDescriptor(desc).
    return FromPropertyDescriptor(desc);
  }
  var guestGetOwnPropertyDescriptor = getOwnPropertyDescriptor;

  Object.DefineOwnProperty___('getOwnPropertyDescriptor', {
      get: function() { return guestGetOwnPropertyDescriptor; },
      set: function(newValue) { guestGetOwnPropertyDescriptor = newValue; },
      enumerable: false,
      configurable: false
    });
  
  // 15.2.3.4
  Object.getOwnPropertyNames = ownKeys;

  // 15.2.3.5
  /**
   * Makes a new empty object that directly inherits from {@code proto}.
   */
  function beget(proto) {
    if (proto === null) {
      throw new TypeError('Cannot beget from null.');
    }
    if (proto === (void 0)) {
      throw new TypeError('Cannot beget from undefined.');
    }
    function F() {}
    F.prototype = proto;
    var result = new F();
    return result;
  }

  // The algorithm below doesn't care whether Properties is absent
  // or undefined, so we can simplify.
  Object.create = function (O, opt_Properties) {
      // 1. If Type(O) is not Object or Null throw a TypeError exception.
      // (ES3 doesn't support null prototypes.)
      if (Type(obj) !== 'Object') {
        throw new TypeError('Expected an object.');
      }
      // 2. Let obj be the result of creating a new object
      //    as if by the expression new Object() where Object
      //    is the standard built-in constructor with that name
      // 3. Set the [[Prototype]] internal property of obj to O.
      var obj = beget(O);
      // 4. If the argument Properties is present
      // and not undefined, add own properties to obj
      // as if by calling the standard built-in function
      // Object.defineProperties with arguments obj and Properties.
      if (opt_Properties !== void 0) {
        Object___.defineProperties___(obj, opt_Properties);
      }
      // 5. Return obj. 
      return obj;
    };

  // 15.2.3.6
  Object.defineProperty = function (O, P, Attributes) {
      // 1. If Type(O) is not Object throw a TypeError exception.
      if (Type(O) !== 'Object') {
        throw new TypeError('Expected an object.');
      }
      // 2. Let name be ToString(P).
      var name = '' + P;
      // 3. Let desc be the result of calling
      //    ToPropertyDescriptor with Attributes as the argument.
      var desc = ToPropertyDescriptor(Attributes);
      // 4. Call the [[DefineOwnProperty]] internal method of O
      //    with arguments name, desc, and true.
      // (We don't need 'true' because we always throw in strict mode.)
      O.DefineOwnProperty___(name, desc);
      // 5. Return O.
      return O;
    };

  // 15.2.3.7
  Object.defineProperties = function (O, Properties) {
      // 1. If Type(O) is not Object throw a TypeError exception.
      if (Type(O) !== 'Object') {
        throw new TypeError('Expected an object.');
      }
      // 2. Let props be ToObject(Properties).
      var props = ToObject(Properties);
      // 3. Let names be an internal list containing
      //    the names of each enumerable own property of props.
      var names = ownEnumKeys(props);
      // 4. Let descriptors be an empty internal List.
      var descriptors = [];
      // 5. For each element P of names in list order,
      var len = names.length;
      for (var i = 0; i < len; ++i) {
        var P = names[i];
        // a. Let descObj be the result of calling the [[Get]]
        //    internal method of props with P as the argument.
        var descObj = props.Get___[P];
        // b. Let desc be the result of calling ToPropertyDescriptor
        //    with descObj as the argument.
        var desc = ToPropertyDescriptor(descObj);
        // c. Append desc to the end of descriptors.
        descriptors.push___(desc);
      }
      // 6. For each element desc of descriptors in list order,
        // a. Call the [[DefineOwnProperty]] internal method
        //    of O with arguments P, desc, and true.
      // This part of the spec is nonsense.  I'm following Besen's
      // interpretation: see line 31479 of
      // http://besen.svn.sourceforge.net/viewvc/besen/trunk/src/BESEN.pas?revision=27&view=markup

      // TODO: The latest draft errata fixes this. We'll be ratifying
      // these errata at the upcoming EcmaScript meeting on 7/28 &
      // 7/29. Watch this space.
      for (i = 0; i < len; ++i) {
        P = names[i];
        desc = descriptors[i];
        O.DefineOwnProperty___(P, desc);
      }
      // 7. Return O.
      return O;
    };
  Object.defineProperties___ = Object.defineProperties;

  // 15.2.3.8
  Object.seal = function (O) {
      // 1. If Type(O) is not Object throw a TypeError exception.
      if (Type(O) !== 'Object') {
        throw new TypeError('Only objects may be sealed.');
      }
      // 2. For each own property name P of O,
      var keys = ownKeys(O), len = keys.length;
      for (var i = 0; i < len; ++i) {
        var P = keys[i];
        if (isNumericName(P)) { continue; }
        // a. Let desc be the result of calling the [[GetOwnProperty]]
        //    internal method of O with P.
        // b. If desc.[[Configurable]] is true, set
        //    desc.[[Configurable]] to false.
        // c. Call the [[DefineOwnProperty]] internal method of O with P,
        //    desc, and true as arguments.
        O[P + '_c___'] = false;
      }
      if (!O.hasNumerics___()) {
        O.NUM____v___ = O;
        O.NUM____gw___ = O;
        O.NUM____w___ = O;
        O.NUM____m___ = false;
        O.NUM____e___ = O;
        O.NUM____g___ = void 0;
        O.NUM____s___ = void 0;
      } 
      O.NUM____c___ = false;
      // 3. Set the [[Extensible]] internal property of O to false.
      O.ne___ = O;
      // 4. Return O.
      return O;
    };

  // 15.2.3.9
  function freeze(obj) {
    if (Type(obj) !== 'Object') {
      throw new TypeError('Only objects may be frozen.');
    }
    // Frozen means all the properties are neither writable nor
    // configurable, and the object itself is not extensible.
    // Cajoled setters that change properties of the object will
    // fail like any other attempt to change the properties.
    // Tamed setters should check before changing a property.
    if (obj.z___ === obj) { return obj; }
    obj.ne___ = obj;
    for (var i in obj) {
      if (!hasOwnProperty(obj,i)) { continue; }
      if (isNumericName(i)) { continue; }
      obj[i + '_c___'] = false;
      obj[i + '_gw___'] = false;
      obj[i + '_w___'] = false;
    }
    if (!obj.hasNumerics___()) {
      obj.NUM____v___ = obj;
      obj.NUM____e___ = obj;
      obj.NUM____g___ = void 0;
      obj.NUM____s___ = void 0;
    }
    obj['NUM____c___'] = false;
    obj['NUM____w___'] = false;
    obj['NUM____m___'] = false;
    obj['NUM____gw___'] = false;
    // Cache frozen state.
    obj.z___ = obj;
    return obj;
  }

  Object.freeze = freeze;

  // 15.2.3.10
  Object.preventExtensions = function (O) {
      if (!O.hasNumerics___()) {
        O.NUM____v___ = obj;
        O.NUM____e___ = obj;
        O.NUM____g___ = void 0;
        O.NUM____s___ = void 0;
        O.NUM____c___ = O;
        O.NUM____gw___ = O;
        O.NUM____w___ = O;
        O.NUM____m___ = false;
      }
      O.ne___ = O;
      return O;
    };

  // 15.2.3.11
  Object.isSealed = function (O) {
      // 1. If Type(O) is not Object throw a TypeError exception.
      if (Type(O) !== 'Object') {
        throw new TypeError('Only objects may be frozen.');
      }
      // 2. For each named own property name P of O,
      // a. Let desc be the result of calling the [[GetOwnProperty]]
      //    internal method of O with P.
      // b. If desc.[[Configurable]] is true, then return false.
      for (var i in O) {
        if (endsWith__.test(i)) { continue; }
        if (isNumericName(i)) { continue; }
        if (O[i + '_c___']) { return false; }
      }
      // 3. If the [[Extensible]] internal property of O is false, then
      //    return true.
      if (O.ne___ === O) { return true; }
      // 4. Otherwise, return false.
      return false;
    };

  // 15.2.3.12
  Object.isFrozen = isFrozen;

  // 15.2.3.13
  Object.isExtensible = isExtensible;

  // 15.2.3.14
  Object.keys = ownEnumKeys;

  (function () {
    var objectStaticMethods = [
        'getPrototypeOf',
        'getOwnPropertyDescriptor',
        'getOwnPropertyNames',
        'create',
        'defineProperty',
        'defineProperties', 
        'seal',
        'freeze',
        'preventExtensions',
        'isSealed',
        'isFrozen',
        'isExtensible',
        'keys'
      ];
    var i, len = objectStaticMethods.length;
    for (i = 0; i < len; ++i) {
      var name = objectStaticMethods[i];
      Object.DefineOwnProperty___(name, {
          value: markFunc(Object[name]),
          writable: true,
          enumerable: false,
          configurable: true
        });
    }
  })();

  // 15.2.4.1
  Object.DefineOwnProperty___('constructor', {
      value: Object,
      writable: false,
      enumerable: false,
      configurable: false
    });

  // 15.2.4.2
  // TODO: report the CLASS___ property
  Object.prototype.DefineOwnProperty___('toString', {
      get: markFunc(function () {
        return this.toString.orig___ ? this.toString.orig___ : this.toString;
      }),
      set: markFunc(function (val) {
        if (!isFunction(val)) {
          throw new TypeError('Expected a function.');
        }
        val = asFirstClass(val);
        this.toString = markFunc(function (var_args) {
            return val.f___(safeDis(this), arguments);
          });
        this.toString.orig___ = val;
      }),
      enumerable: false,
      configurable: false
    });

  // 15.2.4.4
  markFunc(Object.prototype.valueOf);
  Object.prototype.DefineOwnProperty('valueOf', {
      get: markFunc(function () {
          return this.valueOf.orig___ ? this.valueOf.orig___ : this.valueOf;
        }),
      set: markFunc(function (val) {
          if (!isFunction(val)) {
            throw new TypeError('Expected a function.');
          }
          val = asFirstClass(val);
          this.valueOf = markFunc(function (var_args) {
              return val.f___(safeDis(this), arguments);
            });
          this.valueOf.orig___ = val;
        }),
      enumerable: false,
      configurable: false
    });

  // 15.2.4.5
  Object.prototype.hasOwnProperty = function (V) {
      return hasOwnProperty(this, V);
    };

  // 15.2.4.6
  Object.prototype.isPrototypeOf = function(V) {
      throw new Error('isPrototypeOf is not supported.');
    };

  // 15.2.4.7
  Object.prototype.propertyIsEnumerable = function (V) {
      return isEnumerable(this, String___(V));
    };

  // 15.2.4.3, 5--7
  (function () {
    var methods = [
        'toLocaleString',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable'
      ];
    var i, len = methods.length;
    for (i = 0; i < len; ++i) {
    var name = methods[i];
    Object.prototype.DefineOwnProperty___(name, {
        value: markFunc(Object.prototype[name]),
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  })();

  // 15.2.4
  // NOT extensible under ES5/3
  freeze(Object.prototype);

  // 15.3 Function

  // 15.3.1
  Function.f___ = markFunc(function() {
      throw new Error('Invoking the Function constructor is unsupported.');
    });

  // 15.3.2
  Function.new___ = markFunc(function () {
      throw new Error('Constructing functions dynamically is unsupported.');
    });

  // 15.3.3.1
  Function.DefineOwnProperty___('prototype', {
      writable: false,
      enumerable: false,
      configurable: false
    });

  // 15.3.4.1
  Function.prototype.DefineOwnProperty___('constructor', {
      writable: true,
      enumerable: false,
      configurable: false
    });

  // 15.3.4.2
  markFunc(Function.prototype.toString);

  // 15.3.4.3
  Function.prototype.DefineOwnProperty___('call', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.3.4.4
  Function.prototype.DefineOwnProperty___('apply', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.3.4.5
  Function.prototype.DefineOwnProperty___('bind', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.4 Array

  // 15.4.1--2
  markFunc(Array);

  // 15.4.3.1
  Array.DefineOwnProperty('prototype', {
      writable: false,
      enumerable: false,
      configurable: false
    });

  // 15.4.3.2
  Array.isArray = markFunc(function (obj) {
      return Object___.prototype.toString___.call___(obj) === '[object Array]';
    });
  Array.DefineOwnProperty('isArray', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.4.4.1
  Array.prototype.DefineOwnProperty___('constructor', {
      writable: true,
      enumerable: false,
      configurable: false
    });

  // 15.4.4.2
  markFunc(Array.prototype.toString);

  // 15.4.4.11
  Array.prototype.sort___ = Array.prototype.sort;
  Array.prototype.sort = markFunc(function (comparefn) {
      // This taming assumes that sort only modifies {@code this},
      // even though it may read numeric properties on the prototype chain.
      if (!isWritable(this, 'NUM___')) {
        throw new TypeError(
            'Cannot sort an object whose ' +
            'numeric properties are not writable.');
      }
      if (!isExtensible(this)) {
        throw new TypeError(
            'Cannot sort an object that is not extensible.');
      }
      return comparefn ? 
          Array___.prototype.sort___.call___(
              this, 
              markFunc(function(var_args){
                return comparefn.f___(this, arguments);
              })
            ) :
          Array___.prototype.sort___.call___(this);
    });

  // 15.4.4.14
  Array.prototype.indexOf = markFunc(function (value, fromIndex) {
      // length is always readable
      var len = this.length >>> 0;
      if (!len) { return -1; }
      var i = fromIndex || 0;
      if (i >= len) { return -1; }
      if (i < 0) { i += len; }
      for (; i < len; i++) {
        if (!this.hasOwnProperty___(i)) {
          continue;
        }
        // Numerics are always readable
        if (value === this[i]) { return i; }
      }
      return -1;
    });

  // 15.4.4.15
  Array.prototype.lastIndexOf = function (value, fromIndex) {
      // length is always readable
      var len = this.length;
      if (!len) { return -1; }
      var i = arguments[1] || len;
      if (i < 0) { i += len; }
      i = Math.min___(i, len - 1);
      for (; i >= 0; i--) {
        if (!this.hasOwnProperty___(i)) {
          continue;
        }
        if (value === this[i]) { return i; }
      }
      return -1;
    };

  // For protecting against inner hull breaches.
  // We don't want cajoled code to be able to use {@code sort} to invoke a
  // toxic function as a comparator, for instance.
  // {@code createOrWrap} assumes that the function expects
  // - a function {@code block} to use (like the comparator in {@code sort})
  // - an optional object {@code thisp} to use as {@code this}
  // It wraps {@code block} in a function that invokes its taming.
  function createOrWrap(obj, name, fun) {
    if (!obj[name]) {
      // Create
      obj[name] = fun;
    } else {
      // Wrap
      obj[name] = (function (orig) {
          return function (block) { //, thisp
              var a = Array___.slice___(arguments, 0);
              a[0] = (function(origBlock){
                  return markFunc(function(var_args) {
                      return origBlock.f___(this, arguments);
                    });
                })(block);
              return orig.apply___(this, a);
            };
        })(obj[name]);
    }
  }

  // 15.4.4.16
  createOrWrap(Array.prototype, 'every', function (block, thisp) {
      var len = this.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (!block.f___(thisp, [this[i]])) { return false; }
      }
      return true;
    });

  // 15.4.4.17
  createOrWrap(Array.prototype, 'some', function (block, thisp) {
      var len = this.length >>> 0;
      for (var i = 0; i < this.length; i++) {
        if (block.f___(thisp, [this[i]])) { return true; }
      }
      return false;
    });

  // 15.4.4.18
  createOrWrap(Array.prototype, 'forEach', function (block, thisp) {
      var len = this.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (i in this) {
          block.f___(thisp, [this[i]], i, this);
        }
      }
    });

  // 15.4.4.19
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
  createOrWrap(Array.prototype, 'map', function (fun, thisp) {
      var len = this.length >>> 0;
      if (!isFunction(fun)) {
        throw new TypeError('Expected a function.');
      }
      var res = new Array(len);
      for (var i = 0; i < len; i++) {
        if (i in this) {
          res[i] = fun.f___(thisp, [this[i]], i, this);
        }
      }
      return res;
    });

  // 15.4.4.20
  createOrWrap(Array.prototype, 'filter', function (block, thisp) {
      var values = [];
      var len = this.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (block.f___(thisp, [this[i]])) {
          values.push___(this[i]);
        }
      }
      return values;
    });

  // 15.4.4.21
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
  createOrWrap(Array.prototype, 'reduce', function(fun) { // , initial
      // {@code fun} is of the form
      // function(previousValue, currentValue, index, array) { ... }
      var len = this.length >>> 0;
      if (Type(fun) !== 'Function') {
        // As you've defined it, Type(x) will never return 'Function'
        throw new TypeError('Expected a function.');
      }
      // no value to return if no initial value and an empty array
      if (len === 0 && arguments.length === 1) {
        throw new TypeError('Expected an initial value or a non-empty array.');
      }
      var i = 0;
      if (arguments.length >= 2) {
        var rv = arguments[1];
      } else {
        do {
          if (i in this) {
            rv = this[i++];
            break;
          }
          // if array contains no values, no initial value to return
          if (++i >= len) {
            throw new TypeError('Expected non-empty array.');
          }
        } while (true);
      }
      for (; i < len; i++) {
        if (i in this) {
          rv = fun.f___(___.USELESS, [rv, this[i], i, this]);
        }
      }
      return rv;
    });

  // 15.4.4.22
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
  createOrWrap(Array.prototype, 'reduceRight', function(fun) { // , initial
      var len = this.length >>> 0;
      if (Type(fun) !== 'Function') {
        // As you've defined it, Type(x) will never return 'Function'
        throw new TypeError('Expected a function.');
      }
      // no value to return if no initial value, empty array
      if (len === 0 && arguments.length === 1) {
        throw new TypeError('Expected an initial value or a non-empty array.');
      }
      var i = len - 1;
      if (arguments.length >= 2) {
        var rv = arguments[1];
      } else {
        do {
          if (i in this) {
            rv = this[i--];
            break;
          }
          // if array contains no values, no initial value to return
          if (--i < 0) {
            throw new TypeError('Expected a non-empty array.');
          }
        } while (true);
      }
      for (; i >= 0; i--) {
        if (i in this) {
          rv = fun.f___(___.USELESS, [rv, this[i], i, this]);
        }
      }
      return rv;
    });

  // 15.4.4.3 -- 15.4.4.22
  (function () {
    var methods = [
        'toLocaleString',
        'concat',
        'join',
        'pop',
        'push',
        'reverse',
        'shift',
        'slice',
        'sort',
        'splice',
        'unshift',
        'indexOf',
        'lastIndexOf',
        'every',
        'some',
        'forEach',
        'map',
        'filter',
        'reduce',
        'reduceRight'
      ];
    var len = methods.length;
    for (var i = 0; i < len; ++i) {
      var name = methods[i];
      if (Array.prototype[name]) {
        markFunc(Array.prototype[name]);
        Array.prototype.DefineOwnProperty___(name, {
            writable: true,
            enumerable: false,
            configurable: true
          });
      }
    }
  })();

  // 15.5 String

  // 15.5.1--2
  markFunc(String);

  // 15.5.3.1
  grantValue(String, 'prototype');

  // 15.5.3.
  markFunc(String.fromCharCode);
  String.DefineOwnProperty___('fromCharCode', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.5.4.1
  String.prototype.DefineOwnProperty___('constructor', {
      writable: true,
      enumerable: false,
      configurable: false
    });

  // 15.5.4.10, 12, 14
  /**
   * Verifies that regexp is something that can appear as a
   * parameter to a Javascript method that would use it in a match.
   * <p>
   * If it is a RegExp, then this match might mutate it, which must
   * not be allowed if regexp is frozen.
   * 
   * Returns: a boolean indicating whether {@code regexp} should be
   * cast to a String
   */
  function enforceMatchable(regexp) {
    if (regexp instanceof RegExp) {
      if (isFrozen(regexp)) {
        throw new Error("Can't match with frozen RegExp: " + regexp);
      }
      return false;
    }
    return true;
  }

  function tameStringRegExp(orig) {
    return markFunc(function (regexp) {
        var cast = enforceMatchable(regexp);
        return orig.call___(this, cast ? String___(regexp) : regexp);
      });
  }

  String.prototype.match = tameStringRegExp(String.prototype.match);
  String.prototype.search = tameStringRegExp(String.prototype.search);
  String.prototype.split = tameStringRegExp(String.prototype.split);

  // 15.5.4.11
  String.prototype.replace___ = String.prototype.replace;
  String.prototype.replace = markFunc(function (searcher, replacement) {
      var cast = enforceMatchable(searcher);
      if (isFunction(replacement)) {
        replacement = asFirstClass(replacement);
      } else {
        replacement = String___(replacement);
      }
      return String___.prototype.replace___.call___(
          this, 
          cast ? String___(searcher) : searcher, 
          replacement
        );
    });

  // 15.5.4.20
  // http://blog.stevenlevithan.com/archives/faster-trim-javascript
  var trimBeginRegexp = /^\s\s*/;
  var trimEndRegexp = /\s\s*$/;
  String.prototype.trim = function () {
      return String___(this).
          replace___(trimBeginRegexp, '').
          replace___(trimEndRegexp, '');
    };

  (function () {
    var methods = [
        'toString',
        'valueOf',
        'charAt',
        'charCodeAt',
        'concat',
        'indexOf',
        'lastIndexOf',
        'localeCompare',
        'replace',
        'slice',
        'substring',
        'toLowerCase',
        'toLocaleLowerCase',
        'toUpperCase',
        'toLocaleUpperCase',
        'trim'
      ];
    var i, len = methods.length;
    for (i = 0; i < len; ++i) {
      markFunc(String.prototype[methods[i]]);
      String.prototype.DefineOwnProperty___(methods[i], {
          writable: true,
          enumerable: false,
          configurable: true
        });
    }
  })();

  // 15.6 Boolean

  // 15.6.1--2
  markFunc(Boolean);

  // 15.6.3.1
  grantValue(Boolean, 'prototype');
  Boolean.DefineOwnProperty___('prototype', {
      writable: false,
      enumerable: false,
      configurable: false
    });

  // 15.6.4.1
  Boolean.prototype.DefineOwnProperty___('constructor', {
      writable: true,
      enumerable: false,
      configurable: false
    });

  // 15.7 Number

  // 15.7.1--2
  markFunc(Number);

  // 15.7.3.1--6
  (function () {
    var props = [
        'prototype',
        'MAX_VALUE',
        'MIN_VALUE',
        'NaN',
        'NEGATIVE_INFINITY',
        'POSITIVE_INFINITY'
      ];
    var i, len = props.length;
    for (i = 0; i < len; ++i) {
      Number.DefineProperty___(props[i], {
          writable: false,
          enumerable: false,
          configurable: false
        });
    }
  })();

  // 15.7.4
  Number.DefineProperty___('prototype', {
      writable: false,
      enumerable: false,
      configurable: false
    });

  // 15.7.4.1
  Number.prototype.DefineProperty___('constructor', {
      writable: true,
      enumerable: false,
      configurable: false
    });

  // 15.7.4.2
  markFunc(Number.prototype.toString);

  // 15.7.4.4
  markFunc(Number.prototype.valueOf);

  // 15.7.4.3, 5--7
  (function (){
    var methods = [
        'toLocaleString',
        'toFixed',
        'toExponential',
        'toPrecision'
      ];
    var i, len = methods.length;
    for (i = 0; i < len; ++i) {
      markFunc(Number.prototype[methods[i]]);
      Number.prototype.DefineProperty___(methods[i], {
          writable: true,
          enumerable: false,
          configurable: true
        });
    }
  })();

  // 15.8 Math

  // 15.8.1.1--8
  (function (){
    var props = [
        'E',
        'LN10',
        'LN2',
        'LOG2E',
        'LOG10E',
        'PI',
        'SQRT1_2',
        'SQRT2'
      ];
    var i, len = props.length;
    for (i = 0; i < len; ++i) {
      Math.DefineProperty___(props[i], {
          writable: false,
          enumerable: false,
          configurable: false
        });
    }
  })();

  // 15.8.2.1--18
  (function (){
    var methods = [
        'abs',
        'acos',
        'asin',
        'atan',
        'atan2',
        'ceil',
        'cos',
        'exp',
        'floor',
        'log',
        'max',
        'min',
        'pow',
        'random',
        'round',
        'sin',
        'sqrt',
        'tan'
      ];
    var i, len = methods.length;
    for (i = 0; i < len; ++i) {
      markFunc(Math[methods[i]]);
      Math.DefineProperty___(methods[i], {
          writable: true,
          enumerable: false,
          configurable: true
        });
    }
  })();

  Math.min__ = Math.min;

  // 15.9 Date

  // 15.9.1--3
  markFunc(Date);

  // 15.9.4.1
  Date.DefineProperty___('prototype', {
      writable: false,
      enumerable: false,
      configurable: false
    });

  // 15.9.4.2--4
  (function (){
    var staticMethods = [
        'parse',
        'UTC',
        'now'
      ];
    var i, len = staticMethods.length;
    for (i = 0; i < len; ++i) {
      markFunc(Date[staticMethods[i]]);
      Date.DefineProperty___(staticMethods[i], {
          writable: true,
          enumerable: false,
          configurable: true
        });
    }
  })();

  // 15.9.5.1
  Date.prototype.DefineProperty___('constructor', {
      writable: true,
      enumerable: false,
      configurable: false
    });

  // 15.9.5.2
  markFunc(Date.prototype.toString);

  // 15.9.5.3
  markFunc(Date.prototype.toDateString);
  Date.prototype.DefineProperty___('toDateString', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.4
  markFunc(Date.prototype.toTimeString);
  Date.prototype.DefineProperty___('toTimeString', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.5
  markFunc(Date.prototype.toLocaleString);
  Date.prototype.DefineProperty___('toLocaleString', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.6
  markFunc(Date.prototype.toLocaleDateString);
  Date.prototype.DefineProperty___('toLocaleDateString', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.7
  markFunc(Date.prototype.toLocaleTimeString);
  Date.prototype.DefineProperty___('toLocaleTimeString', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.8
  markFunc(Date.prototype.valueOf);

  // 15.9.5.9
  Date.prototype.DefineProperty___('now', {
      value: markFunc(function () {
          return new Date().getTime();
        }),
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.10
  markFunc(Date.prototype.getFullYear);
  Date.prototype.DefineProperty___('getFullYear', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.11
  // TODO

  // 15.9.5.12
  markFunc(Date.prototype.getMonth);
  Date.prototype.DefineProperty___('getMonth', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.13
  // TODO
  
  // 15.9.5.14
  markFunc(Date.prototype.getDate);
  Date.prototype.DefineProperty___('getDate', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.15
  // TODO

  // 15.9.5.16
  markFunc(Date.prototype.getDay);
  Date.prototype.DefineProperty___('getDay', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.17
  // TODO

  // 15.9.5.18
  markFunc(Date.prototype.getHours);
  Date.prototype.DefineProperty___('getHours', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.19
  // TODO

  // 15.9.5.20
  markFunc(Date.prototype.getMinutes);
  Date.prototype.DefineProperty___('getMinutes', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.21
  // TODO

  // 15.9.5.22
  markFunc(Date.prototype.getSeconds);
  Date.prototype.DefineProperty___('getSeconds', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.23
  // TODO

  // 15.9.5.24
  markFunc(Date.prototype.getMilliseconds);
  Date.prototype.DefineProperty___('getMilliseconds', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.25
  // TODO

  // 15.9.5.26
  markFunc(Date.prototype.getTimezoneOffset);
  Date.prototype.DefineProperty___('getTimezoneOffset', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.27
  // TODO

  // 15.9.5.28
  markFunc(Date.prototype.setMilliseconds);
  Date.prototype.DefineProperty___('setMilliseconds', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.29
  // TODO

  // 15.9.5.30
  markFunc(Date.prototype.setSeconds);
  Date.prototype.DefineProperty___('setSeconds', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.31
  // TODO

  // 15.9.5.32
  markFunc(Date.prototype.setMinutes);
  Date.prototype.DefineProperty___('setMinutes', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.33
  // TODO

  // 15.9.5.34
  markFunc(Date.prototype.setHours);
  Date.prototype.DefineProperty___('setHours', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.35
  // TODO

  // 15.9.5.36
  markFunc(Date.prototype.setDate);
  Date.prototype.DefineProperty___('setDate', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.37
  // TODO

  // 15.9.5.38
  markFunc(Date.prototype.setMonth);
  Date.prototype.DefineProperty___('setMonth', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.39
  // TODO

  // 15.9.5.40
  markFunc(Date.prototype.setFullYear);
  Date.prototype.DefineProperty___('setFullYear', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.41
  // TODO

  // 15.9.5.42
  // TODO

  // 15.9.5.43
  markFunc(Date.prototype.toISOString);
  Date.prototype.DefineProperty___('toISOString', {
      writable: true,
      enumerable: false,
      configurable: true
    });

  // 15.9.5.44
  markFunc(Date.prototype.toJSON);
  Date.prototype.DefineProperty___('toJSON', {
      writable: true,
      enumerable: false,
      configurable: true
    });


  ses = {
      // Diagnostics and condition enforcement
      log: log,
      enforce: enforce,
      enforceType: enforceType,
  
      // walking prototype chain, checking object types
      Type: Type,
  
      // Object indistinguishability and object-keyed tables
      Token: Token,
      newTable: newTable,
  
      // Guards and Trademarks
      identity: identity,
      callWithEjector: callWithEjector,
      eject: eject,
      GuardT: GuardT,
      Trademark: Trademark,
      guard: guard,
      passesGuard: passesGuard,
      stamp: stamp,
  
      // Sealing & Unsealing
      makeSealerUnsealerPair: makeSealerUnsealerPair,
  
      // Other
      USELESS: USELESS,
      manifest: manifest,
      allKeys: allKeys,
      allEnumKeys: allEnumKeys,
      ownKeys: ownKeys,
      ownEnumKeys: ownEnumKeys
    };

  sharedImports = {
      ses: ses,
  
      'null': null,
      'false': false,
      'true': true,
      'NaN': NaN,
      'Infinity': Infinity,
      'undefined': void 0,
      parseInt: markFunc(parseInt),
      parseFloat: markFunc(parseFloat),
      isNaN: markFunc(isNaN),
      isFinite: markFunc(isFinite),
      decodeURI: markFunc(decodeURI),
      decodeURIComponent: markFunc(decodeURIComponent),
      encodeURI: markFunc(encodeURI),
      encodeURIComponent: markFunc(encodeURIComponent),
      escape: escape ? markFunc(escape) : (void 0),
      Math: Math,
      JSON: safeJSON,
  
      Object: Object,
      Array: Array,
      String: String,
      Boolean: Boolean,
      Number: Number,
      Date: Date,
      RegExp: RegExp,
  
      Error: Error,
      EvalError: EvalError,
      RangeError: RangeError,
      ReferenceError: ReferenceError,
      SyntaxError: SyntaxError,
      TypeError: TypeError,
      URIError: URIError
    };

  Object.prototype.v___ = Object.prototype.Get___;
  Object.prototype.w___ = Object.prototype.Put___;
  Object.prototype.c___ = Object.prototype.Delete___;
  Object.prototype.m___ = function (name, as) {
      name = String(name);
      if (this[name + '_m___']) {
        return this[name].f___(this, as);
      }
      var m = this.Get___(name);
      if (!m) {
        throw new TypeError(
            "The property '" + name + "' is not a function.");
      }
      // Fastpath the method on the object pointed to by name_v___
      // which is truthy iff it's a data property
      var ownerObj = this[name + '_v___'];
      if (ownerObj && ownerObj !== Function.prototype) {
        fastpathMethod(ownerObj, name);
      }
      return m.f___(this, as);
    };

  ___ = {
      NO_RESULT: NO_RESULT,
      USELESS: USELESS,
      readImport: readImport,
      tameException: tameException,
      args: args,
      wrap: wrap,
      i: isIn,
      beget: beget,
      iM: initializeMap,
      markFunc: markFunc,
      markFuncFreeze: markFuncFreeze
    };
})();
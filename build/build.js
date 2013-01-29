

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("entity-vector/index.js", Function("exports, require, module",
"\n/**\n * References to array helpers.\n */\n\nvar slice = [].slice\nvar map = [].map\n\n/**\n * Exports Vector.\n */\n\nmodule.exports = Vector\n\n/**\n * Vector class.\n *\n * @param {Vector} [vector]\n * or\n * @param {String} [s]\n * or\n * @param {int} x \n * @param {int} y \n * @param {int} z \n */\n\nfunction Vector (val) {\n  switch (typeof val) {\n    case 'number': {\n      val = map.call(arguments, Number)\n      break\n    }\n    case 'string': {\n      val = val.split(',').map(Number)\n      break\n    }\n    case 'object': {\n      if (val instanceof Vector) {\n        val = val.toArray()\n      }\n      break\n    }\n    default:\n      val = [0]\n      break\n  }\n\n  if (!(this instanceof Vector)) {\n    return new Vector(val)\n  }\n\n  Vector.count++\n\n  this.set(val)\n\n  return this\n}\n\nVector.d2 = function (vec) { return Vector(vec || [0,0]) }\nVector.d3 = function (vec) { return Vector(vec || [0,0,0]) }\n\n/**\n * Static values.\n */\n\nVector.maxDecimal = 2\nVector._dt = Math.floor(1000/60)\nVector.count = 0\n\nVector.prototype.__defineGetter__('x', function () { return this[1] })\nVector.prototype.__defineGetter__('y', function () { return this[2] })\nVector.prototype.__defineGetter__('z', function () { return this[3] })\nVector.prototype.__defineGetter__('X', function () { return this[1] })\nVector.prototype.__defineGetter__('Y', function () { return this[2] })\nVector.prototype.__defineGetter__('Z', function () { return this[3] })\n\nVector.prototype.__defineGetter__('a', function () { return this[1] })\nVector.prototype.__defineGetter__('b', function () { return this[2] })\nVector.prototype.__defineGetter__('c', function () { return this[3] })\nVector.prototype.__defineGetter__('A', function () { return this[1] })\nVector.prototype.__defineGetter__('B', function () { return this[2] })\nVector.prototype.__defineGetter__('C', function () { return this[3] })\n\nVector.prototype.__defineGetter__('left', function () { return this[1] })\nVector.prototype.__defineGetter__('top', function () { return this[2] })\n\nVector.prototype.__defineGetter__('width', function () { return this[1] })\nVector.prototype.__defineGetter__('height', function () { return this[2] })\n\nVector.prototype.__defineSetter__('x', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('y', function (v) { this[2] = v })\nVector.prototype.__defineSetter__('z', function (v) { this[3] = v })\nVector.prototype.__defineSetter__('X', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('Y', function (v) { this[2] = v })\nVector.prototype.__defineSetter__('Z', function (v) { this[3] = v })\n\nVector.prototype.__defineSetter__('a', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('b', function (v) { this[2] = v })\nVector.prototype.__defineSetter__('c', function (v) { this[3] = v })\nVector.prototype.__defineSetter__('A', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('B', function (v) { this[2] = v })\nVector.prototype.__defineSetter__('C', function (v) { this[3] = v })\n\nVector.prototype.__defineSetter__('left', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('top', function (v) { this[2] = v })\n\nVector.prototype.__defineSetter__('width', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('height', function (v) { this[2] = v })\n\nVector.prototype.toArray = function () {\n  var arr = []\n  this.each(function (n) { arr.push(n) })\n  return arr\n}\n\n/**\n * Vector utils.\n */\n\nVector.prototype.dt = function (f) {\n  if (f) return (Vector._dt = f)\n  return this.copy().mul(Vector._dt)\n}\n\n/**\n * v.toString()\n * -or-\n * var str = \"vector: \"+v // casts\n *\n * Returns the Vector as a comma delimited\n * string of vector values.\n * \n * @param {float} precision\n *\n * @return {String} comma delimited string of vector values\n */\n\nVector.prototype.toString = function (precision) {\n  var s = this.toArray().map(function (n) { return n.toFixed() })\n  return s.join(',')\n}\n\n/**\n * Returns this.\n *\n * @return {Vector} this\n */\n\nVector.prototype.get = function () {\n  return this\n}\n\n/**\n * v.set(0,4,15)\n * \n * Sets values from an Array\n * or Vector object or arguments.\n *\n * @return {Vector} this\n */\n\nVector.prototype.set = function (arr) {\n  if (arr instanceof Vector) arr = arr.toArray()\n  if (!Array.isArray(arr)) arr = slice.call(arguments)\n  this.length = arr.length\n  for (var i = 1; i <= this.length; i++) {\n    this[i] = arr[i-1]\n  }\n  return this\n}\n\n/**\n * v2 = v.copy()\n * \n * Returns a copy of the Vector.\n *\n * @return {Vector} copy\n */\n\nVector.prototype.clone = \nVector.prototype.copy = function () {\n  return new Vector(this)\n}\n\n\n\n/**\n * a.interpolate(b, 0.75) // v(0,0).interpolate(v(4,4), 0.75) => v(3,3)\n */\n\nVector.prototype.interpolate = \nVector.prototype.lerp = function (b, f) {\n  this.plus(new Vector(b).minus(this).mul(f))\n  return this\n}\n\n/**\n * v.limit(rectangle)\n */\n\nVector.prototype.limit = function (r) {\n  if (r instanceof Vector) {\n    this.max(r[1])\n    this.min(r[2])\n  }\n  else {\n    this.max(r.pos)\n    this.min(r.size)\n  }\n  return this\n}\n\n/**\n * v.each(fn)\n */\n\nVector.prototype.each = function (fn) {\n  for (var i = 1; i <= this.length; i++) {\n    fn(this[i], i)\n  }\n  return this\n}\n\n/**\n * v.map(fn)\n */\n\nVector.prototype.map = function (fn) {\n  for (var i = 1; i <= this.length; i++) {\n    this[i] = fn(this[i], i)\n  }\n  return this\n}\n\n/**\n * v.abs() // -5 => 5, 5 => 5\n */\n\nVector.prototype.abs = \nVector.prototype.absolute = function () {\n  return this.map(Math.abs)\n}\n\n/**\n * v.neg() // 5 => -5\n */\n\nVector.prototype.neg = \nVector.prototype.negate = function () { return this.map(function (n) { return -n }) }\n\nVector.prototype.half = function () { return this.div(2) }\nVector.prototype.double = function () { return this.mul(2) }\nVector.prototype.triple = function () { return this.mul(3) }\nVector.prototype.quad = function () { return this.mul(4) }\n\nVector.prototype.floor = function () { return this.map(Math.floor) }\nVector.prototype.round = function () { return this.map(Math.round) }\nVector.prototype.ceil = function () { return this.map(Math.ceil) }\n\nVector.prototype.pow = function (n) { return this.map(Math.pow.bind(this, n)) }\nVector.prototype.sqrt = function () { return this.map(Math.sqrt) }\n\nVector.prototype.atan2 = function () { return Math.atan2(this.y, this.x) }\n\n/**\n * Return the modulus of this vector.\n */\n\nVector.prototype.mod = \nVector.prototype.modulus = function () {\n  return Math.sqrt(this.dot(this))\n}\n\nVector.prototype.fill = function (len) {\n  var x = 0, n\n  for (var i = 1; i <= len; i++) {\n    n = this[i]\n    this[i] = 'undefined' != typeof n ? (x = n) : x\n  }\n}\n\n/**\n * Vector methods accepting vector as argument.\n */\n\nvar V = {}\n\n/**\n * v.max(-5) // -8 => -5, -2 => -2\n */\n\nV.max = function (v) {\n  return this.map(function (n,i) { return n < v[i] ? v[i] : n })\n}\n\n/**\n * v.min(5) // 8 => 5, 2 => 2\n */\n\nV.min = function (v) {\n  return this.map(function (n,i) { return n > v[i] ? v[i] : n })\n}\n\n/**\n * Compute dot product against a vector.\n *\n * @param {Vector} vec \n * @return {float} product\n */\n\nV.dot = function (vec) {\n  var product = 0\n  var n = this.length + 1\n  while (--n) {\n    product += this[n] * vec[n]\n  }\n  return product\n}\n\n/**\n * Compute cross product against a vector.\n *\n * @param {Vector} b \n * @return {Vector}\n */\n\nV.cross = function (B) {\n  var A = this\n  return new Vector([\n    (A[2] * B[3]) - (A[3] * B[2])\n  , (A[3] * B[1]) - (A[1] * B[3])\n  , (A[1] * B[2]) - (A[2] * B[1])\n  ])\n}\n\n/**\n * v.copyTo(vec)\n * \n * Copies this vector's values and length\n * to another one and returns the other\n * vector.\n * \n * @param {Vector} vec\n * @return {Vector} vec\n */\n\nV.copyTo = function (vec) {\n  this.each(function (n,i) { vec[i] = n })\n  vec.length = this.length\n  return vec\n}\n\n/**\n * v.rand(vec) // v(5,5,5).rand(1,0,1) => v(0.287438,5,0.898736)\n */\n\nV.rand = function (vec) {\n  return this.map(function (n,i) {\n    if (i >= vec.length+1 || vec[i]) return Math.random()\n    else return n\n  })\n}\n\nV.add = V.plus = function (v) { return this.map(function (n,i) { return n+v[i] }) }\nV.sub = V.minus = V.subtract = function (v) { return this.map(function (n,i) { return n-v[i] }) }\n\nV.mul = V.times = V.x = function (v) { return this.map(function (n,i) { return n*v[i] }) }\nV.div = V.divide = function (v) { return this.map(function (n,i) { return n/v[i] }) }\n\n/*\nV.lt = function (x, y, z) {\n  return (this.x < x && this.y < y && this.z < z)\n}\n\nV.gt = function (x, y, z) {\n  return (this.x > x && this.y > y && this.z > z)\n}\n\nV.lte = function (x, y, z) {\n  return (this.x <= x && this.y <= y && this.z <= z)\n}\n\nV.gte = function (x, y, z) {\n  return (this.x >= x && this.y >= y && this.z >= z)\n}\n\nV.eq =\nV.equals = function (x, y, z) {\n  return (this.x === x && this.y === y && this.z === z)\n}\n*/\n\n/**\n * Vector inherits from V.\n */\n\ninherits(Vector, V, function (fn) { \n  return function (b) {\n    var a = this\n    b = new Vector(b)\n    if (b.length < a.length) {\n      b.fill(a.length)\n    }\n    else if (b.length > a.length) {\n      a.fill(b.length)\n    }\n    return fn.call(this, b)\n  }\n})\n\nVector.i = Vector.I = new Vector([1,0,0])\nVector.j = Vector.J = new Vector([0,1,0])\nVector.k = Vector.K = new Vector([0,0,1])\n\n/**\n * Target inherits source methods but\n * with a special modifying function.\n * It is called with `(fn)`.\n * and must return a function.\n *\n * @param {object} t\n * @param {object} s \n * @param {function} m\n * @return {object} t\n * @api private\n */\n\nfunction inherits (t, s, m) {\n  Object.keys(s).forEach(function (k) {\n    var fn = s[k]\n    t.prototype[k] = m(fn)\n  })\n  return t\n}\n//@ sourceURL=entity-vector/index.js"
));
require.register("tiles/index.js", Function("exports, require, module",
"\nvar v = require('vector')\n\n/**\n * tiles\n */\n\nmodule.exports = function (el, url, mapSize, tileSize, map) {\n\n  var tiles = {}\n\n  tiles.map = []\n\n  tiles.init = function () {\n    var width = mapSize.width\n    var height = mapSize.height\n\n    for (var y = 0; y < height; y++) {\n      for (var x = 0; x < width; x++) {\n        tiles.map.push(v(x,y))\n      }\n    }\n\n    map.forEach(function (row) {\n      row.forEach(function (pos) {\n        tiles.addTile(tiles.map[pos])\n      })\n    })\n  }\n\n  tiles.addTile = function (pos) {\n    var div = document.createElement('div')\n    div.style.background = 'url('+url+') -'\n      +(pos.x*tileSize.width)+'px -'\n      +(pos.y*tileSize.height)+'px no-repeat'\n    div.classList.add('tile')\n    el.appendChild(div)\n  }\n\n  return tiles\n\n}//@ sourceURL=tiles/index.js"
));
require.alias("entity-vector/index.js", "tiles/deps/vector/index.js");


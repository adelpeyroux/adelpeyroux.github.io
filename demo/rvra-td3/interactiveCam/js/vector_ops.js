var VECTOR3 = {};

VECTOR3.add = function(v1, v2) {
  return VECTOR3.create(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
};

VECTOR3.substract = function (v1, v2) {
  return VECTOR3.add(v1, VECTOR3.mult(v2, -1));
};

VECTOR3.mult = function(vec, scalar) {
  return VECTOR3.create(vec.x * scalar, vec.y * scalar, vec.z * scalar);
};

VECTOR3.divide = function(vec, scalar) {
  return VECTOR3.mult(vec, 1.0 / scalar);
};

VECTOR3.squaredNorm = function (vec) {
  return (vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z);
};

VECTOR3.norm = function(vec) {
  return Math.sqrt(VECTOR3.squaredNorm(vec));
};

VECTOR3.dot = function (v1, v2) {
  return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
};

VECTOR3.normalized = function (vec) {
  return VECTOR3.divide(vec, VECTOR3.norm(vec));
};

// see https://en.wikipedia.org/wiki/Xyzzy_(mnemonic)
VECTOR3.cross = function (v1, v2) {
  return VECTOR3.create(
    (v1.y * v2.z) - (v1.z * v2.y),
    (v1.z * v2.x) - (v1.x * v2.z),
    (v1.x * v2.y) - (v1.y * v2.x));
};

VECTOR3.create = function(x, y, z){
  return {x:x, y:y, z:z};
};

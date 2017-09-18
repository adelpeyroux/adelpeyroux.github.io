function CubeGenerator (oa) {
  this.oa = oa;
}

CubeGenerator.prototype.setOA = function(texturedCube) {
  this.oa = texturedCube;

  return this;
};

CubeGenerator.prototype.getOne = function () {
  let the_one = this.oa.clone();

  let mesh_id = the_one.id;
  let mesh_geom = the_one.geometry;
  
  applyFaceColor(mesh_geom, mesh_id);

  return the_one;
};

function applyFaceColor( geom, color ) {
  geom.faces.forEach( function( f ) {
    f.color.setHex(color);
  } );
}

THREE.Mesh.prototype.clone = function () {
  return new this.constructor( this.geometry.clone(), this.material ).copy( this );
};

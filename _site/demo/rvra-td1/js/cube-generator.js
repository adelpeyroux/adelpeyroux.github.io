function CubeGenerator (oa) {
  this.oa = oa;
}

CubeGenerator.prototype.setOA = function(texturedCube) {
  if (texturedCube.constructor.name === "TexturedCube")
    this.oa = texturedCube;
};

CubeGenerator.prototype.getOne = function () {
  let the_one = this.oa.clone();
  //the_one.mesh.geometry = this.oa.mesh.geometry.clone();

  let mesh_id = the_one.mesh.id;
  let mesh_geom = the_one.mesh.geometry;
  
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

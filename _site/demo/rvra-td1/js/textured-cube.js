function TexturedCube (textures) {
  
  this.mesh = {};

  if (textures) { 
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let materials = [];
    
    if (!Array.isArray(textures)){
      materials = new THREE.MeshBasicMaterial( {map : textures});
    } else {
      for (let tex of textures) {
	materials.push(new THREE.MeshBasicMaterial( { map: tex }));
      }
    }

    this.mesh = new THREE.Mesh(geometry, materials);
    this.mesh.geometry = geometry;
  }
}

TexturedCube.prototype.clone = function () {
  let copy = new TexturedCube();

  copy.mesh = this.mesh.clone();

  return copy;
};


TexturedCube.prototype.copy = function () {
  let copy = new TexturedCube();

  copy.mesh = new THREE.Mesh();
  copy.mesh.copy(this.mesh);

  return copy;
};


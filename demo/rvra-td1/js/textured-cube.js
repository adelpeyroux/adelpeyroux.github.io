THREE.TexturedCube = function(textures) {
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

    THREE.Mesh.call(this, geometry, materials);
  } else {
    THREE.Mesh.call(this);
  }
};

THREE.TexturedCube.prototype = Object.create(THREE.Mesh.prototype);

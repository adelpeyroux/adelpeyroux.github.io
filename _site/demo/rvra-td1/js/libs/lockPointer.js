function lockPointer() {

  var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

  if ( havePointerLock ) {

    var element = document.body;

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    function handleMouseDown (e) {
      element.requestPointerLock();
    }

    window.addEventListener( 'mousedown', handleMouseDown, false );

    var pointerlockchange = function ( event ) {

      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        console.log('The pointer lock status is now locked');
        window.removeEventListener( 'mousedown', handleMouseDown, false );
        pointerLocked = true;
      } else {
        console.log('The pointer lock status is now unlocked');
        window.addEventListener( 'mousedown', handleMouseDown, false );
        pointerLocked = false;
      }

    };

    var pointerlockerror = function ( event ) {

      alert("Pointer lock failed");

    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  }
}

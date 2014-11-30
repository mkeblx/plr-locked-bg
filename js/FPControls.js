/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.FPControls = function ( camera ) {

	var scope = this;

	//camera.rotation.set( 0, 0, 0 );

	var yawObject = new THREE.Object3D();
	//yawObject.position.y = 10;
	yawObject.add( camera );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var prevTime = performance.now();

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: 
				moveForward = false;
				moveBackward = false;
				moveLeft = false;
				moveRight = false;
				break;
		}

	};

	var onKeyUp = function ( event ) {

		console.log('keyup', event.keyCode);

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		return;

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.update = function ( dt ) {

		if ( scope.enabled === false ) return;

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.y = 0;
		velocity.z -= velocity.z * 10.0 * delta;

		if ( moveForward ) velocity.z -= 400.0 * delta;
		if ( moveBackward ) velocity.z += 400.0 * delta;

		if ( moveLeft ) velocity.x -= 400.0 * delta;
		if ( moveRight ) velocity.x += 400.0 * delta;

		if ( !moveForward && !moveBackward )
			velocity.z = 0;
		if ( !moveLeft && !moveRight )
			velocity.x = 0;

		yawObject.translateX( velocity.x * delta );
		//yawObject.translateY( velocity.y * delta ); 
		yawObject.translateZ( velocity.z * delta );


		prevTime = time;

	};

};

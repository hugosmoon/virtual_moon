var camera, scene, renderer, labelRenderer;

var clock = new THREE.Clock();
var textureLoader = new THREE.TextureLoader();

let moon;

init();
animate();


function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 15, 50000 );
    camera.position.set( 1000, -1000, 1000 );
    camera.lookAt(scene.position)

    var dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 0, 1 );
    scene.add( dirLight );

    var moonGeometry = new THREE.SphereBufferGeometry( 200, 720, 720 );
    var moonMaterial = new THREE.MeshPhongMaterial( {
        shininess: 5,
        map: textureLoader.load( '/static/textures/moon_1024.jpg' )
    } );
    moon = new THREE.Mesh( moonGeometry, moonMaterial );
    scene.add( moon );
    // moon.rotation.y=elapsed*0.1;
    // rotation
    // console.log(moon.rotation.y)

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("render").appendChild( renderer.domElement );

    loadAutoScreen(camera, renderer);
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    
}
function animate() {

    requestAnimationFrame( animate );

    var elapsed = clock.getElapsedTime();

    // moon.position.set( Math.sin( elapsed ) * 5, 0, Math.cos( elapsed ) * 5 );
    moon.rotation.y=elapsed*0.1;

    renderer.render( scene, camera );
    // labelRenderer.render( scene, camera );

}
let renderer, camera, scene;
//hugosmoon


let gui=new dat.GUI();
let mesh;




//主函数
function threeStart() {
    initThree();
    initObject();
    loadAutoScreen(camera, renderer);
    render();
}



//初始化渲染器
function initThree() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });//定义渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);//设置渲染的宽度和高度
    document.getElementById('render').appendChild(renderer.domElement);//将渲染器加在html中的div里面

    renderer.setClearColor(0x444444, 1.0);//渲染的颜色设置
    renderer.shadowMapEnabled = true;//开启阴影，默认是关闭的，太影响性能
    renderer.shadowMapType = THREE.PCFSoftShadowMap;//阴影的一个类型


    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);//perspective是透视摄像机，这种摄像机看上去画面有3D效果

    //摄像机的位置
    camera.position.x = -3;
    camera.position.y = -3;
    camera.position.z = 1;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;//摄像机的上方向是Z轴
    camera.lookAt(0, -50, 0);//摄像机对焦的位置
    //这三个参数共同作用才能决定画面

    scene = new THREE.Scene();

    let light = new THREE.SpotLight(0xffffff, 1, 0);//点光源
    light.position.set(4000, 2000, 8000);
    light.castShadow = true;//开启阴影
    light.shadowMapWidth = 8192;//阴影的分辨率，可以不设置对比看效果
    light.shadowMapHeight = 8192;
    scene.add(light);

    let light2 = new THREE.SpotLight(0xffffff, 0.8, 0);//点光源
    light2.position.set(-3000, -3000, 2500);
    scene.add(light2);

    let light3 = new THREE.AmbientLight(0xaaaaaa, 1);//环境光，如果不加，点光源照不到的地方就完全是黑色的
    scene.add(light3);

    controller = new THREE.OrbitControls(camera, renderer.domElement);
    controller.target = new THREE.Vector3(0, 0, 0);

}

function initObject() {


    var loader = new THREE.GLTFLoader();

    loader.load( '../../../model/test2.gltf', function ( gltf ) {

        mesh=gltf.scene;
        scene.add(mesh);
        mesh.rotation.x=0.5*Math.PI;
        // console.log(gltf);

    }, undefined, function ( error ) {
        console.error( error );
    } );
}
function render() {
    // count+=1;
    // console.log(count);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

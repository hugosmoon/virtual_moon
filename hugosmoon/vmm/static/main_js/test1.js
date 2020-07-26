let renderer, camera, scene;
//hugosmoon


let models=[];

let controls=[];

let gui=new dat.GUI();


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
    camera.position.x = -1500;
    camera.position.y = -1500;
    camera.position.z = 500;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;//摄像机的上方向是Z轴
    camera.lookAt(0, -50, 0);//摄像机对焦的位置
    //这三个参数共同作用才能决定画面

    scene = new THREE.Scene();

    let light = new THREE.SpotLight(0xffffff, 1.2, 0);//点光源
    light.position.set(4000, 2000, 8000);
    light.castShadow = true;//开启阴影
    light.shadowMapWidth = 8192;//阴影的分辨率，可以不设置对比看效果
    light.shadowMapHeight = 8192;
    scene.add(light);

    let light2 = new THREE.SpotLight(0xffffff, 0.6, 0);//点光源
    light2.position.set(-3000, -3000, 2500);
    scene.add(light2);

    let light3 = new THREE.AmbientLight(0xaaaaaa, 0.6);//环境光，如果不加，点光源照不到的地方就完全是黑色的
    scene.add(light3);

    controller = new THREE.OrbitControls(camera, renderer.domElement);
    controller.target = new THREE.Vector3(0, 0, 0);

}

function initObject() {
    //地面
    let planeGeometry = new THREE.PlaneGeometry(5000, 5000, 20, 20);
    let planeMaterial =
        new THREE.MeshLambertMaterial({color: 0x333300})
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -1200;
    plane.receiveShadow = true;//开启地面的接收阴影
    scene.add(plane);//添加到场景中

    //材质1
    let materials_1 = [
        new THREE.MeshPhongMaterial({
            opacity: 0.6,
            color: 0x212121,
            transparent: false,
            specular: 0x545454,
            metal: true
        }),
    ];
    let materials_2 = [
        new THREE.MeshPhongMaterial({
            opacity: 0.6,
            color: 0x0000ff,
            transparent: false,
            specular: 0x545454,
            metal: true
        }),
    ];

    var loader = new THREE.STLLoader();
    loader.load("../../../model/6140.STL", function (geometry) {
        geometry.center();

        // geometry.computeBoundingBox();
        // console.log(geometry.boundingBox.min.x);
        // console.log(geometry.boundingBox.max.x);
        // console.log(geometry.boundingBox.min.y);
        // console.log(geometry.boundingBox.max.y);
        // console.log(geometry.boundingBox.min.z);
        // console.log(geometry.boundingBox.max.z);


        models['机床'] = THREE.SceneUtils.createMultiMaterialObject(geometry, materials_1);
        models['机床'].rotation.x =  0.5 *Math.PI;
        models['机床'].children.forEach(function (e) {
            e.castShadow = true
        });
        models['机床'].receiveShadow = true;

        // jichuang.rotation.y =  -0.5 *Math.PI;
        // jichuang.position.x=30;
        // jichuang.position.y=-250;
        // jichuang.position.z=-376;

        scene.add(models['机床']);
        addToGui(gui,geometry,'机床');


        console.log('机床加载完成');


    });

    loader.load("../../../model/daojia1.STL", function (geometry) {
        geometry.center();
        models['刀架'] = THREE.SceneUtils.createMultiMaterialObject(geometry, materials_2);

        models['刀架'].children.forEach(function (e) {
            e.castShadow = true
        });
        models['刀架'].receiveShadow = true;
        scene.add( models['刀架']);
        console.log('刀架1加载完成');

        addToGui(gui,geometry,'刀架');
    });

}
function render() {
    try {
        switch_models('机床');
        switch_models('刀架');

        models['机床'].rotation.x=90*Math.PI/180;

        models['刀架'].rotation.x=90*Math.PI/180;
        models['刀架'].rotation.y=-90*Math.PI/180;
        models['刀架'].position.y=-96.5;
        models['刀架'].position.z=113.2;

    }
    catch (e) {

    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}


function addToGui(gui,geometry,name){

    geometry.computeBoundingBox();

    controls[name]=new function () {
    this.position_x=1;
    this.position_y=1;
    this.position_z=1;

    this.rotation_x=0;
    this.rotation_y=0;
    this.rotation_z=0;
};
    let folder = gui.addFolder(name);
    folder.add(controls[name],"position_x",geometry.boundingBox.min.x,geometry.boundingBox.max.x);
    folder.add(controls[name],"position_y",geometry.boundingBox.min.y,geometry.boundingBox.max.y);
    folder.add(controls[name],"position_z",geometry.boundingBox.min.z,geometry.boundingBox.max.z);
    folder.add(controls[name],"rotation_x",-360,360);
    folder.add(controls[name],"rotation_y",-360,360);
    folder.add(controls[name],"rotation_z",-360,360);


}

function switch_models(name){
    models[name].position.x=controls[name].position_x;
    models[name].position.y=controls[name].position_y;
    models[name].position.z=controls[name].position_z;

    models[name].rotation.x=controls[name].rotation_x*Math.PI/180;
    models[name].rotation.y=controls[name].rotation_y*Math.PI/180;
    models[name].rotation.z=controls[name].rotation_z*Math.PI/180;

}
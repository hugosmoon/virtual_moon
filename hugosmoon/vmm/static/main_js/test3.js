// import * as THREE from '/static/import/three.module.js';

// import { OrbitControls } from '/static/import/OrbitControls.js';
// import { GLTFLoader } from '/static/import/GLTFLoader.js';
// // import { RGBELoader } from '/static/import/RGBELoader.js';

// import { RoughnessMipmapper } from '/static/import/RoughnessMipmapper.js';
// // alert()

let renderer, camera, scene;
//hugosmoon


let gui=new dat.GUI();
let mesh;
let model;
let material;
let points;
let gltf_obj;
var lathe



threeStart();
//主函数
function threeStart() {
    initThree();
    // initObject();
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
    renderer.shadowMap.enabled = true;//开启阴影，默认是关闭的，太影响性能
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;//阴影的一个类型


    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 500000);//perspective是透视摄像机，这种摄像机看上去画面有3D效果

    //摄像机的位置
    camera.position.x = 120;
    camera.position.y = 170;
    camera.position.z = 20;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;//摄像机的上方向是Z轴
    camera.lookAt(0, 0, 0);//摄像机对焦的位置
    //这三个参数共同作用才能决定画面

    scene = new THREE.Scene();

    
    let light = new THREE.SpotLight(0xffffff, 1, 0);//点光源
    light.position.set(0, 0, 80000);
    light.angle=Math.PI;
    light.castShadow = true;//开启阴影
    light.shadow.mapSize.width = 8192;//阴影的分辨率，可以不设置对比看效果
    light.shadow.mapSize.height = 8192;
    scene.add(light);

    let light2 = new THREE.SpotLight(0xffffff, 5, 0);//点光源
    light2.position.set(80000,-80000,300);
    scene.add(light2);

    let light3 = new THREE.SpotLight(0xffffff, 2, 0);//点光源
    light3.position.set(80000,80000,300);
    // scene.add(light3);

    let light4 = new THREE.SpotLight(0xffffff, 2, 0);//点光源
    light4.position.set(-80000,-80000,300);
    // scene.add(light4);

    let light6 = new THREE.SpotLight(0xffffff, 2, 0);//点光源
    light6.position.set(-80000,80000,300);
    // scene.add(light6);

    let light5 = new THREE.AmbientLight(0xaaaaaa, 0.99);//环境光，如果不加，点光源照不到的地方就完全是黑色的
    scene.add(light5);
    
    


    let color=new THREE.Color(1,1,1);
    material = [new THREE.MeshPhysicalMaterial({
                        color:color,
                        // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
                        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
                        metalness: 1,
                        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
                        roughness: 0.45,
                        }),];

    var points = [];
    for ( var i = 1; i < 10; i++ ) {
        // points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
        points.push( new THREE.Vector2(i,i));
    }
    var geometry = new THREE.LatheBufferGeometry( points );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    lathe = new THREE.Mesh( geometry, material );
    scene.add( lathe );

    controller = new THREE.OrbitControls(camera, renderer.domElement);
    controller.target = new THREE.Vector3(0, 0, 0);
    // points=create_vertices(1500,1500,3000).vertices;
    // // modelww = createModel(points,material,720);
    // // modelww = create_cylinder(create_vertices(500,500,2000).vertices,material,1,0,1)
    // modelww=create_cylinder(create_vertices(500,500,1000).vertices,material,1,1,1)
    // // scene.add(modelww);

    // // let a=[],b=[]
    // // for (let i=0;i<1000;i++){
    // //     a.push(i/10);
    // //     b.push([-1-i/10,1+i/10]);
    // // }
    // // aaa=createEndface([[a,b]],material)

    // // // let ppp=[[[100,200,300,400,500],[[-100,100],[-200,200],[-300,300],[-400,400],[-500,500]]],[[200,300,400],[[-10,10],[-10,10],[-10,10]]],[[200,300,400],[[15,20],[15,20],[15,20]]]]
    // // // [[200,300,400],[[-100,100],[-100,100],[-100,100]]]
    // // // aaa=createEndface(ppp,material)
    // // scene.add(aaa);

    // var gltfLoader = new GLTFLoader()

    // gltfLoader.load('/static/model/DamagedHelmet/DamagedHelmet.gltf', function(obj) {
    //     gltf_obj=obj;
    //     console.log(obj)
    //     // gltf_obj.scene.position.z=40;
    //     gltf_obj.scene.rotation.x=0.5*Math.PI;
    //     gltf_obj.scene.rotation.y=0.65*Math.PI;
    //     // scene.add(gltf_obj.scene);
    // // var object = scene.gltf // 模型对象
    // // scene.add(object) // 将模型添加到场景中
    // })

    // var roughnessMipmapper = new RoughnessMipmapper( renderer );

    // var loader = new GLTFLoader().setPath( '/static/model/DamagedHelmet/' );
    // loader.load( 'DamagedHelmet.gltf', function ( gltf ) {

    //     gltf.scene.traverse( function ( child ) {

    //         if ( child.isMesh ) {

    //             roughnessMipmapper.generateMipmaps( child.material );

    //         }

    //     } );

    //     scene.add( gltf.scene );

    //     roughnessMipmapper.dispose();

    //     render();

    // } );

    // gltfLoader.load('/static/model/ipod_scroll_wheel/scene.gltf', function(obj) {
    //     gltf_obj=obj;
    //     console.log(obj)
    //     gltf_obj.scene.position.z=100;
    //     gltf_obj.scene.rotation.x=0.5*Math.PI;
    //     gltf_obj.scene.rotation.y=0.65*Math.PI;
    //     // scene.add(gltf_obj.scene);
    // // var object = scene.gltf // 模型对象
    // // scene.add(object) // 将模型添加到场景中
    // })

    // gltfLoader.load('/static/model/buster_drone/scene.gltf', function(obj) {
    //     gltf_obj=obj;
    //     console.log(obj)
    //     gltf_obj.scene.position.z=200;
    //     gltf_obj.scene.rotation.x=0.5*Math.PI;
    //     gltf_obj.scene.rotation.y=0.65*Math.PI;
    //     // scene.add(gltf_obj.scene);
    // // var object = scene.gltf // 模型对象
    // // scene.add(object) // 将模型添加到场景中
    // })
}
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//创建顶点
function test_create_vertices(r1,r2,h,num=720){
    let degree=(Math.PI/180)*360/num;
    let points=[]
    let vertices=[];

    vertices.push(new THREE.Vector3(0,0,0));

    for(let i=0;i<num;i++){
        
        points[i]=[];
        for(let m=0;m<51;m++){
            points[i][m]=[];
            points[i][m]['x']=r1*(1.2-Math.pow((m-25),2)/625)*Math.sin(i*degree);
            points[i][m]['y']=r1*(1.2-Math.pow((m-25),2)/625)*Math.cos(i*degree);
            points[i][m]['z']=h*m/50;
        }
    }

    for(let j=0;j<51;j++){
        for(let i=0;i<num;i++){
            vertices.push(new THREE.Vector3(points[i][j]['x'], points[i][j]['y'], points[i][j]['z']))
        }
    }

    vertices.push(new THREE.Vector3(0,0,h));

    let obj=new function(){
        this.vertices=vertices;
        this.num=num;   
    }
    return obj;
    
}


threeStart();


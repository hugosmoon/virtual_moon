let renderer, camera, scene;
let controller;
let vertices;
let faces;
let controlPoints = [];
let geom;
let mesh, box;
let pr,ps,p0;
let ps_rotation=-45*Math.PI/180,p0_rotation=45*Math.PI/180;


let a0=0.3,a1=2.5;
let w=4, w1 = 2.6, a=a0, b = 2,c =1, h = 3,l=20;
let x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4,x5,y5,z5,x6,y6,z6,x7,y7,z7,x8,y8,z8,x9,y9,z9;
let rqj_b=0;//刃倾角导致的刀具形变量
let qj_b=0;//前角导致的刀具形变量
let main_angle=45;


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


    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);//perspective是透视摄像机，这种摄像机看上去画面有3D效果

    //摄像机的位置
    camera.position.x = 15;
    camera.position.y = 7;
    camera.position.z = 10;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;//摄像机的上方向是Z轴
    camera.lookAt(0, 0, 0);//摄像机对焦的位置
    //这三个参数共同作用才能决定画面

    scene = new THREE.Scene();

    let light = new THREE.SpotLight(0xffffff, 1.2, 0);//点光源
    light.position.set(40, 20, 80);
    light.castShadow = true;//开启阴影
    light.shadowMapWidth = 8192;//阴影的分辨率，可以不设置对比看效果
    light.shadowMapHeight = 8192;
    scene.add(light);

    let light2 = new THREE.SpotLight(0xffffff, 0.6, 0);//点光源
    light2.position.set(-300, -300, 250);
    scene.add(light2);

    let light3 = new THREE.AmbientLight(0xaaaaaa, 0.6);//环境光，如果不加，点光源照不到的地方就完全是黑色的
    scene.add(light3);

    cameraControl();

}

//顶点控制初始化
function addControl(x, y, z) {
    let controls;
    controls = new function () {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    return controls;
}


// 摄像机的控制，可以采用鼠标拖动来控制视野
function cameraControl() {
    controller = new THREE.OrbitControls(camera, renderer.domElement);
    controller.target = new THREE.Vector3(0, 0, 0);
}

let plane;

//初始化场景中的所有物体
function initObject() {

    // //地面
    // let planeGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
    // let planeMaterial =
    //     new THREE.MeshLambertMaterial({color: 0x333300})
    // plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.position.z = -5;
    // plane.receiveShadow = true;//开启地面的接收阴影
    // scene.add(plane);//添加到场景中
    let color_h=new THREE.Color(0x595959);
    let helper = new THREE.GridHelper(50000, 50, color_h, color_h);
    helper.rotation.x=Math.PI*0.5;
    helper.position.z = -2000;
    // helper.scale.x=0.1;
    // helper.scale.y=0.1;
    // helper.scale.z=0.1;
    scene.add(helper);

    //刀柄

    let boxgeom = new THREE.BoxGeometry(l, w, w)
    let color=new THREE.Color(1,1,1)
    let materials = [
        new THREE.MeshPhysicalMaterial({
            color:color,
            // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
            // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
            metalness: 1.0,
            // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
            roughness: 0.7,
            // 设置环境贴图
            // envMap: textureCube,
            // 反射程度, 从 0.0 到1.0.默认0.5.
            // 这模拟了非金属材料的反射率。 当metalness为1.0时无效
            // reflectivity: models_info[index].reflectivity,
            // emissive:emissive_color,
            // emissiveIntensity:models_info[index].emissiveIntensity,
            }),
    ];


    box = THREE.SceneUtils.createMultiMaterialObject(boxgeom, materials);

    box.position.y = w1-(w/2);
    box.position.z = w/2-h;
    // box.rotation.x=0.1;
    box.receiveShadow = true;
    box.children.forEach(function (e) {
        e.castShadow = true
    });
    scene.add(box);

    //车刀（前端）
    //顶点坐标，一共10个顶点
    vertices = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-a, w1, 0),
        new THREE.Vector3(-c, -(w-w1), 0),
        new THREE.Vector3(0, 0, -h),
        new THREE.Vector3(-c, -(w-w1), -h),
        new THREE.Vector3(-a, w1, -h),
        new THREE.Vector3(-(a + b), -(w-w1), 0),
        new THREE.Vector3(-(a + b), w1, 0),
        new THREE.Vector3(-(a + b), -(w-w1), -h),
        new THREE.Vector3(-(a + b), w1, -h)
    ];

    //顶点索引，每一个面都会根据顶点索引的顺序去绘制线条
    faces = [
        new THREE.Face3(1, 0, 3),
        new THREE.Face3(1, 3, 5),
        new THREE.Face3(9, 1, 5),
        new THREE.Face3(9, 7, 1),
        new THREE.Face3(9, 8, 6),
        new THREE.Face3(9, 6, 7),
        new THREE.Face3(8, 4, 2),
        new THREE.Face3(8, 2, 6),
        new THREE.Face3(4, 3, 0),
        new THREE.Face3(4, 0, 2),
        new THREE.Face3(6, 2, 0),
        new THREE.Face3(6, 0, 7),
        new THREE.Face3(7, 0, 1),
        new THREE.Face3(4, 8, 3),
        new THREE.Face3(8, 9, 3),
        new THREE.Face3(9, 5, 3)


    ];

    geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();//计算法向量，会对光照产生影响

    //两个材质放在一起使用

    //创建多材质对象，要引入SceneUtils.js文件，如果只有一个材质就不需要这个函数
    mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
    mesh.children.forEach(function (e) {
        e.castShadow = true
    });
    mesh.receiveShadow = true;
    scene.add(mesh);

    //三个参考面

    //Pr
    let pr_Geometry = new THREE.PlaneGeometry(60, 60, 20, 20);
    let pr_Material =
        new THREE.MeshLambertMaterial({opacity: 0.5,color: 0x1C86EE,transparent: true})
    pr_Material.side=THREE.DoubleSide;

    pr = new THREE.Mesh(pr_Geometry, pr_Material);
    // plane.rotation.y = -0.5 * Math.PI;
    pr.position.x = -7;

    pr.material.visible=false;
    scene.add(pr);//添加到场景中

    //Ps
    let ps_Geometry = new THREE.PlaneGeometry(30, 30, 20, 20);
    let ps_Material =
        new THREE.MeshLambertMaterial({opacity: 0.5,color: 0x912CEE,transparent: true})
    ps_Material.side=THREE.DoubleSide;

    ps = new THREE.Mesh(ps_Geometry, ps_Material);
    ps.rotation.x = 0.5*Math.PI;
    ps.material.visible=false;
    scene.add(ps);//添加到场景中

    //P0
    let p0_Geometry = new THREE.PlaneGeometry(30, 30, 20, 20);
    let p0_Material =
        new THREE.MeshLambertMaterial({opacity: 0.5,color: 0x7D26CD,transparent: true})
    p0_Material.side=THREE.DoubleSide;

    p0 = new THREE.Mesh(p0_Geometry, p0_Material);
    p0.rotation.x = 0.5*Math.PI;
    p0.material.visible=false;
    scene.add(p0);//添加到场景中

}

//动画
function render() {

    let vertices = [];
    for (let i = 0; i < 10; i++) {
        vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
    }
    mesh.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;//通知顶点更新
        e.geometry.elementsNeedUpdate = true;//特别重要，通知线条连接方式更新
        e.geometry.computeFaceNormals();
    });
    box.position.x = -(l/2+a+b);
    box.position.y = w1-(w/2);



    pr.position.z = (z1-z0)/2;
    // alert(this.$refs.check_p0.value)
    ps.rotation.y=ps_rotation;
    // ps.position.x = -7;
    p0.rotation.y=p0_rotation;
    p0.position.y = (y1-y0)/2;
    p0.position.x=(x1-x0)/2;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}


//主函数
function threeStart() {
    initThree();
    initObject();
    loadAutoScreen(camera, renderer);
    render();
}

var Main = {
    data() {
        return {
            check_pr: false,
            check_ps: false,
            check_p0: false,
            value1: 45,
            value2: 10,
            value3: 0,
            value4: 5,
            value5: 10,
            value6: 10,

            bangliao_d: 80,
            bangdliao_length:600,
            bangliao_materials: [{
                value: '45_steel',
                label: '45钢'
              }, {
                value: 'stainless_steel',
                label: '不锈钢'
              }, {
                value: 'gray_iron',
                label: '灰铸铁'
              }, {
                value: 'malleable_cast_iron',
                label: '可锻铸铁'
              }],
              value: '',
              marks_main_angle: {
                30:'30°',
                40: '40°',
                50: '50°',
                60: '60°',
                70: '70°',
                80: '80°',
                90: '90°'
            },
            marks_tool_minor_cutting_edge_angle: {
                '0': '0°',
                5: '5°',
                10: '10°',
                15: '15°',
                20: '20°'
            },
            marks_edge_inclination_angle: {
                '-10': '-10°',
                '-5': '-5°',
                '0': '0°',
                5: '5°',
                10: '10°',
                15: '15°',
                20: '20°',
                25: '25°'
            },
            marks_rake_angle: {
                '-5': '-5°',
                '0': '0°',
                5: '5°',
                10: '10°',
                15: '15°',
                20: '20°',
                25: '25°',
            },
            marks_back_angle: {
                '6': '6',
                8: '8',
                10: '10°',
                12: '12',
            },
            marks_secondary_edge_back_angle: {
                '6': '6',
                8: '8',
                10: '10°',
                12: '12',
            },
            marks_tip_radius: {

                0.25: '0.25mm',
                0.7: '0.7mm',
                1: '1.0mm',
                1.5: '1.5mm',
                2: '2.0mm'
            },
            marks_bangliao_d:{
                80:'80',
                160:'160',
                240:'240',
                320:'320',
                400:'400',
            },
            marks_bangdliao_length:{
                300:'300',
                400:'400',
                500:'500',
                600:'600',
                700:'700',
                800:'800',
                900:'900',
                1000:'1000',
            }
        }
    },

    methods: {
        greet: function (xx) {
            main_angle=this.$refs.main_angle.value;
            a=a0+(a1-a0)*(main_angle-5)/70;
            w1=a*trig('cot',main_angle);
            c=(w-w1)*trig('tan',this.$refs.tool_minor_cutting_edge_angle.value);
            rqj_b=trig('tan',this.$refs.edge_inclination_angle.value);
            qj_b=-trig('sin',this.$refs.rake_angle.value+0.01)*3.5;
            hj_b=-trig('sin',this.$refs.back_angle.value+0.01)*h;
            frhj_b=-trig('sin',this.$refs.secondary_edge_back_angl.value+0.01)*h;
            // 端点坐标赋值
            x0=0;
            y0=0;
            z0=0;

            x1=-a;
            y1=w1;
            z1=-w1*rqj_b;

            x6=-(a+b);
            y6= -(w-w1)
            z6=-((w-w1)/w1)*z1+qj_b

            x7=-(a + b);
            y7=w1;
            z7=-((y1*z6 - y6*z1)*(x7 - (y7*(x1*z6 - x6*z1))/(y1*z6 - y6*z1)))/(x1*y6 - x7*y1);

            x2=-c;
            y2=-(w-w1);
            z2= -((y1*z6 - y6*z1)*(x2 - (y2*(x1*z6 - x6*z1))/(y1*z6 - y6*z1)))/(x1*y6 - x6*y1);


            x4=-c+frhj_b;
            y4=-(w-w1);
            z4=-h;

            x5=-a+hj_b;
            y5=w1;
            z5=-h;

            x8=-(a + b);
            y8=-(w-w1);
            z8=-h;

            x9=-(a + b);
            y9=w1;
            z9=-h;

            z3=-h;
            x3=-(z3*(x1*x2*y4*z5 - x1*x2*y5*z4 - x1*x4*y2*z5 + x1*x4*y5*z2 + x2*x5*y1*z4 - x2*x5*y4*z1 - x4*x5*y1*z2 + x4*x5*y2*z1))/(x1*y2*z4*z5 - x1*y4*z2*z5 - x2*y1*z4*z5 + x2*y5*z1*z4 + x4*y1*z2*z5 - x4*y5*z1*z2 - x5*y2*z1*z4 + x5*y4*z1*z2);
            y3=(z3*(x1*y2*y5*z4 - x1*y4*y5*z2 - x2*y1*y4*z5 + x2*y4*y5*z1 + x4*y1*y2*z5 - x4*y2*y5*z1 - x5*y1*y2*z4 + x5*y1*y4*z2))/(x1*y2*z4*z5 - x1*y4*z2*z5 - x2*y1*z4*z5 + x2*y5*z1*z4 + x4*y1*z2*z5 - x4*y5*z1*z2 - x5*y2*z1*z4 + x5*y4*z1*z2);

            controlPoints=[];
            controlPoints.push(addControl(x0, y0, z0));
            controlPoints.push(addControl(x1, y1, z1));
            controlPoints.push(addControl(x2, y2, z2));
            controlPoints.push(addControl(x3, y3, z3));
            controlPoints.push(addControl(x4, y4, z4));
            controlPoints.push(addControl(x5, y5, z5));
            controlPoints.push(addControl(x6, y6, z6));
            controlPoints.push(addControl(x7, y7, z7));
            controlPoints.push(addControl(x8, y8, z8));
            controlPoints.push(addControl(x9, y9, z9));

            ps_rotation=-(90-this.$refs.main_angle.value)*Math.PI/180;
            p0_rotation=(this.$refs.main_angle.value)*Math.PI/180;

        },
        pla_view_pr: function (xx){
            pr.material.visible =xx
        },
        pla_view_ps: function (xx){
            ps.material.visible =xx
        },
        pla_view_p0: function (xx){
            p0.material.visible =xx
        },
        submit:function () {
            if(this.value==''){
                this.$message.warning('请选棒料材料');
                return false;
            }
            //60,=15,=0,=30,=10,=10;

            // let url='/qxwd/2/';
            let daojujiaodubuchang=w1*5;
            document.write("<form action='/vmm/qxwd/' method=post name=form1 style='display:none'>");  
            document.write("<input type=hidden name='main_angle' value='"+this.$refs.main_angle.value+"'/>"); 
            document.write("<input type=hidden name='tool_minor_cutting_edge_angle' value='"+this.$refs.tool_minor_cutting_edge_angle.value+"'/>"); 
            document.write("<input type=hidden name='edge_inclination_angle' value='"+this.$refs.edge_inclination_angle.value+"'/>"); 
            document.write("<input type=hidden name='rake_angle' value='"+this.$refs.rake_angle.value+"'/>"); 
            document.write("<input type=hidden name='back_angle' value='"+this.$refs.back_angle.value+"'/>"); 
            document.write("<input type=hidden name='secondary_edge_back_angl' value='"+this.$refs.secondary_edge_back_angl.value+"'/>"); 
            document.write("<input type=hidden name='bangliao_r' value='"+this.$refs.bangliao_d.value/2+"'/>"); 
            document.write("<input type=hidden name='bangliao_length' value='"+this.$refs.bangliao_length.value+"'/>"); 
            document.write("<input type=hidden name='daojujiaodubuchang' value='"+daojujiaodubuchang+"'/>"); 
            document.write("<input type=hidden name='bangliao_material' value='"+this.$refs.bangliao_material.value+"'/>");  
            document.write("</form>");  
            document.form1.submit();  
        }
    }

}

var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')

function trig(method,value) {
    let degre=value*Math.PI/180;
    if (method=='sin'){
        return Math.sin(degre)
    }
    else if (method=='cos'){
        return Math.cos(degre)
    }
    else if (method=='tan'){
        return Math.tan(degre)
    }
    else if (method=='cot'){
        return (1/(Math.tan(degre)))
    }
}


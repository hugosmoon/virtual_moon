function create_tool(main_angle,tool_minor_cutting_edge_angle,edge_inclination_angle,rake_angle,back_angle,secondary_edge_back_angl){

    let mesh, box;
    let a0=3,a1=25;
    let w=50, w1 = 26, a=a0, b = 20,c =10, h = 41,l=250;
    let x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4,x5,y5,z5,x6,y6,z6,x7,y7,z7,x8,y8,z8,x9,y9,z9;
    a=a0+(a1-a0)*(main_angle-5)/70;
    w1=a*trig('cot',main_angle);
    c=(w-w1)*trig('tan',tool_minor_cutting_edge_angle);
    let rqj_b=trig('tan',edge_inclination_angle);
    let qj_b=-trig('sin',rake_angle+0.01)*3.5;
    let hj_b=-trig('sin',back_angle+0.01)*h;
    let frhj_b=-trig('sin',secondary_edge_back_angl+0.01)*h;

    let controlPoints=[];
    let faces=[];

    x0=0;
    y0=0;
    z0=0;

    x1=-a;
    y1=w1;
    z1=-w1*rqj_b;

    x6=-(a+b);
    y6= -(w-w1);
    z6=-((w-w1)/w1)*z1+qj_b;

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


    let boxgeom = new THREE.BoxGeometry(l, w, w)
    let color=new THREE.Color(1,1,1);
    let materials = [
        new THREE.MeshPhysicalMaterial({
            color:color,
            // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
            // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
            metalness: 1.0,
            // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
            roughness: 0.25,
            }),
    ];

    //刀柄
    box = THREE.SceneUtils.createMultiMaterialObject(boxgeom, materials);

    box.position.y = w1-(w/2);
    box.position.z = w/2-h;
    // box.rotation.x=0.1;
    box.receiveShadow = true;
    box.children.forEach(function (e) {
        e.castShadow = true
    });

    //车刀（前端）
    //顶点坐标，一共10个顶点
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
    geom.vertices = controlPoints;
    geom.faces = faces;
    geom.computeFaceNormals();//计算法向量，会对光照产生影响

    //两个材质放在一起使用

    //创建多材质对象，要引入SceneUtils.js文件，如果只有一个材质就不需要这个函数
    mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
    mesh.children.forEach(function (e) {
        e.castShadow = true
    });
    mesh.receiveShadow = true;
    box.position.x = -(l/2+a+b);
    box.position.y = w1-(w/2);
    var group= new THREE.Object3D();//创建一个3D对象
    group.add(box);
    group.add(mesh);
    return group;
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

//计算三角函数
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

// 引入文件之前必须定义的变量scene  renderer  camera   controller

//初始化渲染器
function initThree(debug) {
    
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });//定义渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);//设置渲染的宽度和高度
    document.getElementById('render').appendChild(renderer.domElement);//将渲染器加在html中的div里面

    renderer.setClearColor(0x505050, 1.0);//渲染的颜色设置
    // renderer.shadowMap.enabled = true;//开启阴影，默认是关闭的，太影响性能
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;//阴影的一个类型

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 500000);//perspective是透视摄像机，这种摄像机看上去画面有3D效果
    // camera = new THREE.OrthographicCamera(window.innerWidth , window.innerWidth , window.innerHeight, window.innerHeight , -20000, 50000);

    //摄像机的位置
    camera.position.x = 200;
    camera.position.y = -5000;
    camera.position.z = 1000;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;//摄像机的上方向是Z轴
    camera.lookAt(0, -50, 0);//摄像机对焦的位置
    //这三个参数共同作用才能决定画面

    scene = new THREE.Scene();

    // let directionalLight=new THREE.DirectionalLight("#ffffff");
    // let hemiLight=new THREE.HemisphereLight(0xffffff,0xffffff,0.6);
    // hemiLight.position.set(1000,1000,1000);
    // scene.add(hemiLight);


    let light = new THREE.SpotLight(0xffffff, 1, 0);//点光源
    light.position.set(0, 0, 80000);
    light.angle=Math.PI;
    light.castShadow = true;//开启阴影
    light.shadow.mapSize.width = 8192;//阴影的分辨率，可以不设置对比看效果
    light.shadow.mapSize.height = 8192;
    scene.add(light);

    let light2 = new THREE.SpotLight(0xffffff, 0.4, 0);//点光源
    light2.position.set(80000,-80000,300);
    scene.add(light2);

    let light3 = new THREE.SpotLight(0xffffff, 0.4, 0);//点光源
    light3.position.set(80000,80000,300);
    scene.add(light3);

    let light4 = new THREE.SpotLight(0xffffff, 0.4, 0);//点光源
    light4.position.set(-80000,-80000,300);
    scene.add(light4);

    let light6 = new THREE.SpotLight(0xffffff, 0.4, 0);//点光源
    light6.position.set(-80000,80000,300);
    scene.add(light6);

    let light5 = new THREE.AmbientLight(0xaaaaaa, 0.99);//环境光，如果不加，点光源照不到的地方就完全是黑色的
    scene.add(light5);

    // controls = new THREE.TrackballControls(camera, renderer.domElement);

    controller = new THREE.OrbitControls(camera, renderer.domElement);
    controller.target = new THREE.Vector3(0, 0, 0);

    //地面
    // let planeGeometry = new THREE.PlaneGeometry(50000, 50000, 20, 20);
    // let planeMaterial =
    //     new THREE.MeshLambertMaterial({color: 0x000000,transparent:true,opacity:0.5})
    // plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.position.z = -950;
    // plane.receiveShadow = true;//开启地面的接收阴影
    // scene.add(plane);//添加到场景中
    // for(let i=0;i<=50000;i+=500){
    //     let x_zhou_Geometry = new THREE.PlaneGeometry(50000, 5, 20, 20);
    //     let x_zhou_Material =
    //         new THREE.MeshLambertMaterial({color: 0x000000,transparent:true,opacity:0.7,side:THREE.DoubleSide})
    //         x_zhou = new THREE.Mesh(x_zhou_Geometry, x_zhou_Material);
    //     x_zhou.position.z = -2000;
    //     x_zhou.position.y = 25000-i;
    //     // x_zhou.receiveShadow = true;//开启地面的接收阴影
    //     scene.add(x_zhou);//添加到场景中

    //     let y_zhou_Geometry = new THREE.PlaneGeometry(50000, 5, 20, 20);
    //     let y_zhou_Material =
    //         new THREE.MeshLambertMaterial({color: 0x000000,transparent:true,opacity:0.7,side:THREE.DoubleSide})
    //         y_zhou = new THREE.Mesh(y_zhou_Geometry, y_zhou_Material);
    //     y_zhou.position.z = -2000;
    //     y_zhou.rotation.z = Math.PI*0.5;
    //     y_zhou.position.x = 25000-i;
    //     y_zhou.receiveShadow = true;//开启地面的接收阴影
    //     scene.add(y_zhou);//添加到场景中
    // }

    // let color=new THREE.Color(0x525252);
    let color=new THREE.Color(0x595959);
    let helper = new THREE.GridHelper(50000, 50, color, color);
    helper.rotation.x=Math.PI*0.5;
    helper.position.z = -2000;
    // helper.scale.x=0.1;
    // helper.scale.y=0.1;
    // helper.scale.z=0.1;
    scene.add(helper);

    if(debug==1){
        // //坐标轴
        // let x_zhou_Geometry = new THREE.CylinderGeometry(4, 4, 50000);
        // let x_zhou_Material =
        //     new THREE.MeshLambertMaterial({color:0xff0000,transparent:true,opacity:0.6,})
        //     x_zhou = new THREE.Mesh(x_zhou_Geometry, x_zhou_Material);
        // // x_zhou.position.z = -995;
        // x_zhou.rotation.z = Math.PI*0.5;
        // // x_zhou.receiveShadow = true;//开启地面的接收阴影
        // scene.add(x_zhou);//添加到场景中

        // let y_zhou_Geometry = new THREE.CylinderGeometry(4, 4, 50000);
        // let y_zhou_Material =
        //     new THREE.MeshLambertMaterial({color:0x00ff00,transparent:true,opacity:0.6,})
        //     y_zhou = new THREE.Mesh(y_zhou_Geometry, y_zhou_Material);
        // // y_zhou.position.z = -995;
        // // y_zhou.rotation.z = Math.PI*0.5;
        // // y_zhou.receiveShadow = true;//开启地面的接收阴影
        // scene.add(y_zhou);//添加到场景中

        // let z_zhou_Geometry = new THREE.CylinderGeometry(4, 4, 50000);
        // let z_zhou_Material =
        //     new THREE.MeshLambertMaterial({color:0x0000ff,transparent:true,opacity:0.6,})
        //     z_zhou = new THREE.Mesh(z_zhou_Geometry, z_zhou_Material);
        // // y_zhou.position.z = -995;
        // z_zhou.rotation.x = Math.PI*0.5;
        // // z_zhou.receiveShadow = true;//开启地面的接收阴影
        // scene.add(z_zhou);//添加到场景中

            
            let color1 = new THREE.Color( 0xff0000 ), color2= new THREE.Color( 0x00ff00 ), color3= new THREE.Color( 0x0000ff );
            // 线的材质可以由2点的颜色决定
            let p1 = new THREE.Vector3( -25000, 0, 0 );
            let p2 = new THREE.Vector3( 25000, 0, 0 );
            let p3 = new THREE.Vector3( 0, -25000, 0 );
            let p4 = new THREE.Vector3( 0, 25000, 0 );
            let p5 = new THREE.Vector3( 0, 0, -25000 );
            let p6 = new THREE.Vector3( 0, 0, 25000 );
            // geometry_x.vertices.push(p1);
            // geometry_x.vertices.push(p2);
            // geometry_x.colors.push( color1, color1 );
 
            // //第一个参数是几何体，第二个参数是材质或者线的属性，第三个参数是一组点的连接方式
            // let line_x = new THREE.Line( geometry_x, material, THREE.LinePieces );
            // let line_y = new THREE.Line( geometry_y, material, THREE.LinePieces );
            // let line_z = new THREE.Line( geometry_z, material, THREE.LinePieces );
            // scene.add(line_x);
            // scene.add(line_y);
            // scene.add(line_z);

            // x轴
            add_line(p1,p2,color1,color1);
            // y轴
            add_line(p3,p4,color2,color2);
            // z轴
            add_line(p5,p6,color3,color3);
    
    }

    
}
function add_line(p1,p2,color1,color2){
    let geometry = new THREE.Geometry();
    let material = new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors});
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);
    geometry.colors.push( color1, color2 );
    let line = new THREE.Line( geometry, material, THREE.LineSegments );
    scene.add(line);
}

//初始化一个模型
function initObject(index) {
    // console.log('正在加载');
    //模型材质
    let color=new THREE.Color(models_info[index].materials_color_r,models_info[index].materials_color_g,models_info[index].materials_color_b);
    let emissive_color=new THREE.Color(models_info[index].emissive_r,models_info[index].emissive_g,models_info[index].emissive_b);
    let materials;
    materials = [
        new THREE.MeshPhysicalMaterial({
            color:color,
            // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
            // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
            metalness: models_info[index].metalness,
            // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
            roughness: models_info[index].roughness,
            // opacity:0.5,
            // 设置环境贴图
            // envMap: textureCube,
            // 反射程度, 从 0.0 到1.0.默认0.5.
            // 这模拟了非金属材料的反射率。 当metalness为1.0时无效
            reflectivity: models_info[index].reflectivity,
            emissive:emissive_color,
            emissiveIntensity:models_info[index].emissiveIntensity,
            }),
    ];
    // console.log(materials);

    let loader = new THREE.STLLoader();
    loader.load(models_info[index].url, function (geometry) {
       
        // //console.log(geometry);
        geometry.center();
        models[index] = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
        models[index].receiveShadow = true; 
        models[index].children[0].position.x=models_info[index].position_x+models_info[index].view_position_x;
        models[index].children[0].position.y=models_info[index].position_y+models_info[index].view_position_y;
        models[index].children[0].position.z=models_info[index].position_z+models_info[index].view_position_z;
        models[index].children[0].rotation.x=models_info[index].rotation_x;
        models[index].children[0].rotation.y=models_info[index].rotation_y;
        models[index].children[0].rotation.z=models_info[index].rotation_z;
        models[index].children[0].scale.x=models_info[index].scale_x;
        models[index].children[0].scale.y=models_info[index].scale_y;
        models[index].children[0].scale.z=models_info[index].scale_z;

        
        scene.add(models[index]);
        // //console.log(models)
        console.log(models_info[index].model_name+'加载完成');
        loaded_models_num+=1;
        if(loaded_models_num==load_models_num){
            load_status=true;
        }
    });  
}

//模型对象
function Model(view_id,model_id,model_name,url,index,materials_type){
    this.view_id=view_id;
    this.index=index;
    this.model_id=model_id;
    this.model_name=model_name;
    this.url=url;
    // this.url="/static/model/"+view_name+'/'+name;
    this.position_x=0;
    this.position_y=0;
    this.position_z=0;

    this.view_position_x=0;
    this.view_position_y=0;
    this.view_position_z=0;

    this.rotation_x=0;
    this.rotation_y=0;
    this.rotation_z=0;

    this.materials_type=materials_type;

    // 材质参数
    ////材质金属性
    this.metalness=1.0;
    ////材质粗糙度（从镜面反射到漫反射）
    this.roughness=0.5;
    ////材质在光线下的颜色，不是材质本身的颜色
    this.materials_color=0x212121;
    this.materials_color_r=0.63;
    this.materials_color_g=0.63;
    this.materials_color_b=0.63;
    ////材质本身的颜色，与光线无关
    this.emissive_r=1.0;
    this.emissive_g=1.0;
    this.emissive_b=1.0;
    ////材质本身颜色的强度
    this.emissiveIntensity=0;
    ////非金属材料的反射率。 当metalness为1.0时无效
    this.reflectivity=0.5;


    // 缩放比例
    this.scale_x=1;
    this.scale_y=1;
    this.scale_z=1;
   
    this.change_po_x=function(x){
        this.position_x=x;
    };
    this.change_po_y=function(y){
        this.position_y=y;
    };
    this.change_po_z=function(z){
        this.position_z=z;
    };

    this.change_view_po_x=function(x){
        this.view_position_x=x;
    };
    this.change_view_po_y=function(y){
        this.view_position_y=y;
    };
    this.change_view_po_z=function(z){
        this.view_position_z=z;
    };
   
    this.change_ro_x=function(x){
        this.rotation_x=x;
    };
    this.change_ro_y=function(y){
        this.rotation_y=y;
    };
    this.change_ro_z=function(z){
        this.rotation_z=z;
    };

    this.change_materials_color_r=function(x){
        this.materials_color_r=x;
    };
    this.change_materials_color_g=function(x){
        this.materials_color_g=x;
    };
    this.change_materials_color_b=function(x){
        this.materials_color_b=x;
    };

    this.change_scale_x=function(x){
        this.scale_x=x;
    };
    this.change_scale_y=function(x){
        this.scale_y=x;
    };
    this.change_scale_z=function(x){
        this.scale_z=x;
    };
    this.change_materials_type=function(x){
        this.materials_type=x;
    };



    this.change_metalness=function(x){
        this.metalness=x;
    };
    this.change_roughness=function(x){
        this.roughness=x;
    };
    this.change_emissive_r=function(x){
        this.emissive_r=x;
    };
    this.change_emissive_g=function(x){
        this.emissive_g=x;
    };
    this.change_emissive_b=function(x){
        this.emissive_b=x;
    };
    this.change_emissiveIntensity=function(x){
        this.emissiveIntensity=x;
    };
    this.change_reflectivity=function(x){
        this.reflectivity=x;
    };

}
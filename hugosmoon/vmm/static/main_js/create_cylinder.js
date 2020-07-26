//引入该文件前需首先引入 three.js

//创建顶点
function create_vertices(r1,r2,h,num=720){
    let degree=(Math.PI/180)*360/num;
    let points=[]
    let vertices=[];
    for(let i=0;i<num;i++){

        points[i]=[];
        points[i][0]=[];
        points[i][1]=[];

        points[i][0]['x']=r1*Math.sin(i*degree);
        points[i][0]['y']=r1*Math.cos(i*degree);
        points[i][0]['z']=0;

        points[i][1]['x']=r2*Math.sin(i*degree);
        points[i][1]['y']=r2*Math.cos(i*degree);
        points[i][1]['z']=h;

    }

    for(let j=0;j<2;j++){
        for(let i=0;i<points.length;i++){
            vertices.push(new THREE.Vector3(points[i][j]['x'], points[i][j]['y'], points[i][j]['z']))
        }
    }

    let obj=new function(){
        this.vertices=vertices;
        this.num=num;   
    }
    return obj;
}

//创建圆柱
function create_cylinder(vertices,materials1,status1,status2,status3){
    
    let num=vertices.length/2;
    let faces=[],geom,mesh;
    
    // let material = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random() * 0xffffff)});
                

    if(status1==1){
        for(let i=0;i<num-2;i++){
            faces.push(new THREE.Face3(0, i+1, i+2))
        }    
    }
    
    if(status2==1){
        for(let i=0;i<num-2;i++){
            faces.push(new THREE.Face3(num, num+i+2, num+i+1))
        }
    }

    if(status3==1){
        for(let i=0;i<num-1;i++){

            faces.push(new THREE.Face3(i, i+num, i+num+1))
            faces.push(new THREE.Face3(i, i+num+1, i+1))
    
        }
        faces.push(new THREE.Face3(0, num-1, 2*num-1));
        faces.push(new THREE.Face3(0, 2*num-1, num));
    }
    
    
    geom = new THREE.Geometry();
    
    geom.vertices = vertices;
    geom.faces = faces;

    
    
    geom.computeFaceNormals();//计算法向量，会对光照产生影响

    //两个材质放在一起使用

    //创建多材质对象，要引入SceneUtils.js文件，如果只有一个材质就不需要这个函数
    mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials1);
    // mesh =new THREE.Mesh(geom, mats);
    
    mesh.children.forEach(function (e) {
        e.castShadow = true
    });
    mesh.receiveShadow = true;

    

    return mesh;

}
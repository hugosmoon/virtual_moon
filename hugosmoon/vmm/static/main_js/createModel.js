// 创建模型
function createModel(vertices,materials1,resolution){
    // 点（new THREE.Vector3(x,y,z)）-数组，材质，resolution-每一圈由多少个面组成
    let faces=[],geom,mesh;
    let height=(vertices.length-2)/resolution;

    //上端面
    for(let i=1;i<resolution;i++){
        faces.push(new THREE.Face3(0, i, i+1))
    }
    faces.push(new THREE.Face3(0, resolution, 1))

    // 中间面
    for(let j=0;j<height-1;j++){
        for(let i=1;i<resolution;i++){
            faces.push(new THREE.Face3(j*resolution+i, (j+1)*resolution+i, (j+1)*resolution+i+1));
            faces.push(new THREE.Face3(j*resolution+i, (j+1)*resolution+i+1, j*resolution+i+1));
        }
        faces.push(new THREE.Face3(j*resolution+1,(j+1)*resolution+resolution, (j+1)*resolution+1));
        faces.push(new THREE.Face3(j*resolution+1, (j+1)*resolution, (j+1)*resolution+resolution));

    }

    // 下端面
    for(let i=1;i<resolution;i++){
        faces.push(new THREE.Face3(height*resolution+1, (height-1)*resolution+i+1, (height-1)*resolution+i))
    }
    faces.push(new THREE.Face3(height*resolution+1,(height-1)*resolution+1, (height)*resolution))
    
    geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();//计算法向量，会对光照产生影响

    //两个材质放在一起使用
    //创建多材质对象，要引入SceneUtils.js文件，如果只有一个材质就不需要这个函数
    mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials1);
    mesh.children.forEach(function (e) {
        e.castShadow = true
    });
    mesh.receiveShadow = true;
    return mesh;
}

// 建立端面
function createEndface(point_list,materials1){
    // point_list -> [[[x1,x2,...,xn],[[y1_1,y2_1],...,[y1_n,y2_n]]],...,[]]

    //一共有几个图形
    let graph_num=point_list.length;

    //外围轮廓的x轴范围
    let x_length=point_list[0][0].length;

    //记录各个内图形的偏执量
    let graph_deviation=[];

    for(let i=0;i<x_length;i++){
        for(let j=1;j<graph_num;j++){
            if(point_list[j][0][0]==point_list[0][0][i]){
                graph_deviation[j]=[i,point_list[j][0].length]
            }
        }
    }

    let new_point_list=[];
    new_point_list[0]=[];
    new_point_list[1]=[];
    for(let i=0;i<x_length;i++){
        let graph_num=point_list.length;
        new_point_list[0].push(point_list[0][0][i]);
        new_point_list[1][i]=[];
        new_point_list[1][i].push(point_list[0][1][i][0]);
        new_point_list[1][i].push(point_list[0][1][i][1]);
        for(let j=1;j<graph_num;j++){
            if(i>=graph_deviation[j][0]&&i<graph_deviation[j][0]+graph_deviation[j][1]){
                new_point_list[1][i].push(point_list[j][1][i-graph_deviation[j][0]][0]);
                new_point_list[1][i].push(point_list[j][1][i-graph_deviation[j][0]][1]);
            }
        }
        new_point_list[1][i].sort(function(a, b){return-( a - b)});  
    }

    let vertices=[];
    console.log(new_point_list)
    for(let i=0;i<new_point_list[0].length-1;i++){
        // console.log(i)
        for(let j=0;j<new_point_list[1][i].length;j++){
            // console.log(j)
            vertices.push(new THREE.Vector3(new_point_list[0][i],new_point_list[1][i][j],0));
            vertices.push(new THREE.Vector3(new_point_list[0][i+1],new_point_list[1][i][j],0));
        }
    }


    let faces=[],geom,mesh;
    
    for(let m=0;m<vertices.length;m+=4){
        faces.push(new THREE.Face3(m, m+2, m+3))
        faces.push(new THREE.Face3(m, m+3, m+1))
        // console.log(m)
    }

    // console.log(faces)
    // console.log(vertices)
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
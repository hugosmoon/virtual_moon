
let display_view_id=20;
let renderer, camera, scene,controller;
////模型信息列表
let models_info=[];
////模型实体列表
let models=[];
let load_models_num;
let loaded_models_num=0;
let load_status=false;

// let main_angle=60,tool_minor_cutting_edge_angle=15,edge_inclination_angle=0,rake_angle=30,back_angle=10,secondary_edge_back_angl=10;
let bcdl=0.2,jjl=1;
let duidaobuchang=10;//对刀完成后后退的距离

// 机床状态0-关，1-开,3-正常切削
let machine_status=3;

//机床的目标速度
let aims_machine_speed=0;
let accelerate_num=-300;
let machine_speed=0;
// 机床关机前的速度
let machine_speed_closing=0;




let szjp_distance=40;//三爪夹盘爪子距离中心的高度


let szjp_pan,szjp_zhua1,szjp_zhua2,szjp_zhua3;

let count=0;//计数器

let bangliao=[];
let bangliao_r1=bangliao_r;
let bangliao_r2,bangliao2_r2=1;//未加工和已经加工的棒料半径
// let bangliao_length=600
let cut_length=0,bangliao2_length=0.0001;
let bangliao1_Geometry,bangliao2_Geometry,bangliao3_Geometry,bangliao4_Geometry;

// let daojujiaodubuchang=0;

let rot_angle=0;

// let bangliao_material;
// let plane;

// let weizuo;
// let weizuodingjian;
// let daojia1,daojia2;
// let jichuang;
let tool;
// let sigang;


// let model_number=0;//记录加载模型的数量

let last_frame_time=Date.now();//上一帧时间戳
let frame_time=20;//当前时间戳

let cut_corner_end=false;//切削棒料角是否结束，与棒料2的长度及两端半径确定有关

let cutting_roughnes=0;//切削力

// bangliao_r1=parseFloat(GetQueryString('bangliao_r'));
// bangliao_length=parseFloat(GetQueryString('bangliao_length'));
// main_angle=parseFloat(GetQueryString('main_angle'));
// tool_minor_cutting_edge_angle=parseFloat(GetQueryString('tool_minor_cutting_edge_angle'));
// edge_inclination_angle=parseFloat(GetQueryString('edge_inclination_angle'));
// rake_angle=parseFloat(GetQueryString('rake_angle'));
// back_angle=parseFloat(GetQueryString('back_angle'));
// secondary_edge_back_angl=parseFloat(GetQueryString('secondary_edge_back_angl'));
// daojujiaodubuchang = parseFloat(GetQueryString('daojujiaodubuchang'));
// bangliao_material = GetQueryString('bangliao_material');
//let stats = initStats();
let chart_line1,chart_line2;

// 实验数据保存
let experiment_data_1="<html><head><meta charset='utf-8' /></head><body><table>";
let experiment_data_2="";
let experiment_data_3="<tr></tr><tr><th>序号</th><th>切削长度(mm)</th><th>表面粗糙度(mm)</th></tr>";
let experiment_data_4="</table></body></html>";
let experiment_data_num=1;


let exp_information="实验参数";

//加载

let Main = {
    data() {
        return {
            check_pr: false,
            check_ps: false,
            check_p0: false,

            progress_status:false,
            progress_data:0,
            // 显示遮罩
            mask_status:true,

            value1: 0,
            value2: 1,
            value3: 0.3,
            start_status:false,
            end_status:true,
            adjustable:false,
            exp_information:"",
            marks_machine_speed: {
                0:'0',
                400: '400',
                800: '800',
                1200: '1200',
                1600: '1600'
            },
            marks_cutting_depth: {

                0:'0',
                1: '1.0',
                2: '2.0',
                3: '3.0',
                4: '4.0',
                5: '5.0',
                6:'6.0'
            },
            marks_feed: {
                0.1: '0.1',
                0.2: '0.2',
                0.3: '0.3',
                0.4: '0.4',
                0.5: '0.5'
            }   

        }
    },
    mounted:function(){
        // this.get_display_info();
        initThree(0);
        loadAutoScreen(camera, renderer);
        this.openFullScreen();
        create_bangliao();
        create_tool_to_scene();
        load_models(display_view_id);
        // initialization()
        init_chart();
        render();
        this.timer = setInterval(this.update_data, 500);
    },
    methods: {
        update_data:function(){
            this.exp_information=exp_information;
            if(this.mask_status){
                if(load_status){
                    this.$refs.mask.style.height = 0 + 'px';
                    this.$refs.mask.style.paddingLeft="0px";
                    this.$refs.mask.children[0].style.marginTop="0px";
                    this.progress_status=false;
                    this.mask_status=false;
                }
                else{
                    this.mask_status=true;
                    this.openFullScreen();
                }
            }
        },
        // 加载遮罩
        openFullScreen:function() {
            this.$refs.mask.style.height = document.getElementById('render').clientHeight + 'px';
            this.$refs.mask.style.paddingLeft="40%";
            this.$refs.mask.children[0].style.marginTop="200px";
            this.progress_status=true;
            this.progress_data=0;
            let nu=Number(((loaded_models_num/load_models_num)*100).toFixed(0));
            if(nu){
                this.progress_data=nu;
            }
            else{
                this.progress_data=0;
            }
            
        },
        greet: function (xx) {
            bcdl=this.$refs.cutting_depth.value;
            jjl=this.$refs.feed.value;
        },
        start: function(){
            
            if(this.$refs.machine_speed.value==0){
                this.$alert('主轴转速不能为0', '操作提示', {
                    confirmButtonText: '确定',
                });
                return false;
            }
            if(this.$refs.cutting_depth.value==0){
                this.$alert('背吃刀量不能为0', '操作提示', {
                    confirmButtonText: '确定',
                });
                return false;
            }
            this.start_status=true;
            this.end_status=false;
            accelerate_num=-300;
            
            machine_status=1;
            aims_machine_speed=this.$refs.machine_speed.value;
            bcdl=this.$refs.cutting_depth.value;
            jjl=this.$refs.feed.value;
            this.adjustable = true;
            this.get_cutting_roughness();
        },
        end:function () {
            this.start_status=false;
            this.end_status=true;
            end_machine()
        },
        reload: function () {
            // location.reload();
            document.write("<form action='/vmm/jgzl/' method=post name=form1 style='display:none'>");  
            document.write("<input type=hidden name='main_angle' value='"+main_angle+"'/>"); 
            document.write("<input type=hidden name='tool_minor_cutting_edge_angle' value='"+tool_minor_cutting_edge_angle+"'/>"); 
            document.write("<input type=hidden name='edge_inclination_angle' value='"+edge_inclination_angle+"'/>"); 
            document.write("<input type=hidden name='rake_angle' value='"+rake_angle+"'/>"); 
            document.write("<input type=hidden name='back_angle' value='"+back_angle+"'/>"); 
            document.write("<input type=hidden name='secondary_edge_back_angl' value='"+secondary_edge_back_angl+"'/>"); 
            document.write("<input type=hidden name='bangliao_r' value='"+bangliao_r+"'/>"); 
            document.write("<input type=hidden name='bangliao_length' value='"+bangliao_length+"'/>"); 
            document.write("<input type=hidden name='daojujiaodubuchang' value='"+daojujiaodubuchang+"'/>"); 
            document.write("<input type=hidden name='bangliao_material' value='"+bangliao_material+"'/>"); 
            document.write("<input type=hidden name='corner_radius' value='"+corner_radius+"'/>"); 
            document.write("</form>");  
            document.form1.submit();  
        },
        // 更新表面粗糙度
        get_cutting_roughness: function () {
            this.$http.post(
                '/vmm/cutting_roughness_cal/',
                {
                    feed_rate: this.$refs.feed.value,
                    cutting_depth: this.$refs.cutting_depth.value,
                    cutting_speed: aims_machine_speed * bangliao_r1 * Math.PI / 1000,
                    tool_cutting_edge_angle: main_angle,
                    rake_angle: rake_angle,
                    corner_radius:corner_radius,
                    tool_minor_cutting_edge_angle:tool_minor_cutting_edge_angle,
                },
                { emulateJSON: true }
                ).then(function (res) {

                    // cutting_roughnes=Math.round((res.body),2);
                    cutting_roughnes=res.body;
                    // console.log(cutting_roughnes)
                });
        },
        download_data:function(){
            if(experiment_data_2==""){
                this.$message.error('尚无实验数据，请先进行实验操作');
                return false;
            }
            var blob = new Blob([experiment_data_1+experiment_data_2+experiment_data_3+experiment_data_4], { type: "application/vnd.ms-excel" });
            var a = document.createElement("a");
            a.href=URL.createObjectURL(blob);
            a.download="加工质量实验数据-"+Date.now()+".xls";
            console.log(a)
            a.click();
        }

    }
}
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
//动画
function render() {
    // machine_speed=300;

    szjp_distance=bangliao_r1+86.871;
    bangliao_r2=bangliao_r1-bcdl;
    frame_time= Date.now()-last_frame_time;
    last_frame_time=Date.now();

    if(machine_status==0&&machine_speed>aims_machine_speed){
        machine_speed=(1-(1/(1+Math.pow(10,(0-accelerate_num/30)))))*machine_speed_closing
        if(machine_speed-aims_machine_speed<=0.01){
            machine_speed=0;
            machine_status=3;
        }
        rot_angle+=frame_time*(machine_speed/30000)*Math.PI;
        accelerate_num+=1;
        // console.log(machine_speed)
        models_control();
    }
    if(machine_status==1&&machine_speed<aims_machine_speed){
        machine_speed=(1/(1+Math.pow(2.7,(0-accelerate_num/30))))*1450;
        if(machine_speed>=aims_machine_speed){
            machine_speed=aims_machine_speed;
            machine_status=3;
        }
        // machine_speed+=10;
        rot_angle+=frame_time*(machine_speed/30000)*Math.PI;
        accelerate_num+=1;
        // console.log(accelerate_num)
        // console.log(machine_speed)
        models_control();
        
    }
    if(machine_status==3){
        try{
            // console.log(cut_length)
            rot_angle+=frame_time*(machine_speed/30000)*Math.PI;
    
            if(cut_length<bangliao_length-100){
                if(duidaobuchang>0){
                    duidaobuchang-=frame_time*machine_speed/60000;
                }
                else{
                    duidaobuchang=0;
                    cut_length+=jjl*frame_time*machine_speed/60000;
                    if(cut_length>=bangliao_length-100){
                        cut_length=bangliao_length-100;
                        end_machine()
                        // machine_speed=0;
                    }
                }
            }
    
            if(cut_length>0){
                bangliao[2].children[0].material.roughness=0.45;
                
                if(cut_length<bcdl*trig('cot',main_angle)){
                    bangliao2_r2=bangliao_r1-cut_length*trig('tan',main_angle);
                    let vertices_arr=[];
                    vertices_arr[0]=create_vertices(bangliao_r1,bangliao_r1,bangliao_length-cut_length).vertices;
                    vertices_arr[1]=create_vertices(bangliao_r1,bangliao2_r2,cut_length).vertices;
                    vertices_arr[2]=create_vertices(bangliao2_r2,bangliao2_r2,cut_length).vertices;
                    vertices_arr[3]=create_vertices(bangliao2_r2,bangliao2_r2,cut_length).vertices;
                    // vertices_arr[3]=create_vertices(bangliao2_r2,bangliao2_r2,0.3).vertices;
                    for(let i=0;i<4;i++){
                        bangliao[i].children.forEach(function (e) {
                        e.geometry.vertices = vertices_arr[i];
                        e.geometry.verticesNeedUpdate = true;//通知顶点更新
                        e.geometry.elementsNeedUpdate = true;//特别重要，通知线条连接方式更新
                        e.geometry.computeFaceNormals();
                        // console.log('123');
                        // console.log(e.matrixWorldNeedsUpdate);
                    });
                    }
                    // console.log('a:'+Date.now());
                }
                else{
                    if(!cut_corner_end){
                        cut_corner_end=true;
                        let vertices_arr=[];
                        vertices_arr[0]=create_vertices(bangliao_r1,bangliao_r1,bangliao_length-cut_length).vertices;
                        vertices_arr[1]=create_vertices(bangliao_r1,bangliao_r2,cut_length).vertices;
                        vertices_arr[2]=create_vertices(bangliao_r2,bangliao_r2,cut_length).vertices;
                        vertices_arr[3]=create_vertices(bangliao_r2,bangliao_r2,cut_length).vertices;
                        // vertices_arr[3]=create_vertices(bangliao_r2,bangliao_r2,0.3).vertices;
                        for(let i=0;i<4;i++){
                            bangliao[i].children.forEach(function (e) {
                                e.geometry.vertices = vertices_arr[i];
                                e.geometry.verticesNeedUpdate = true;//通知顶点更新
                                e.geometry.elementsNeedUpdate = true;//特别重要，通知线条连接方式更新
                                e.geometry.computeFaceNormals();
                            });
                        }
                    }
                   
                    let vertices_arr=[];
                    vertices_arr[0]=create_vertices(bangliao_r1,bangliao_r1,bangliao_length-cut_length).vertices;
                    vertices_arr[2]=create_vertices(bangliao_r2,bangliao_r2,cut_length).vertices;
                    vertices_arr[3]=create_vertices(bangliao_r2,bangliao_r2,cut_length).vertices;
                    for(let i=0;i<4;i++){
                        if(i!=1){
                            bangliao[i].children.forEach(function (e) {
                                e.geometry.vertices = vertices_arr[i];
                                e.geometry.verticesNeedUpdate = true;//通知顶点更新
                                e.geometry.elementsNeedUpdate = true;//特别重要，通知线条连接方式更新
                                e.geometry.computeFaceNormals();
                            });
                        }    
                    }

                    
                }            
            }
    
    
            models_control();
    
            if(cut_length>0&&machine_speed>0){
                if(experiment_data_2==""){
                    experiment_data_2+="<tr><th>刀具主偏角</th><th>"+main_angle+"°</th></tr>";
                    experiment_data_2+="<tr><th>刀具副偏角</th><th>"+tool_minor_cutting_edge_angle+"°</th></tr>"
                    experiment_data_2+="<tr><th>刀具刃倾角</th><th>"+edge_inclination_angle+"°</th></tr>"
                    experiment_data_2+="<tr><th>刀具前角</th><th>"+rake_angle+"°</th></tr>"
                    experiment_data_2+="<tr><th>刀具后角</th><th>"+back_angle+"°</th></tr>"
                    experiment_data_2+="<tr><th>刀具副刃后角</th><th>"+secondary_edge_back_angl+"°</th></tr>"
                    experiment_data_2+="<tr><th>刀具刀尖圆弧半径</th><th>"+corner_radius+"mm</th></tr>"
                    experiment_data_2+="<tr><th>机床主轴转速</th><th>"+machine_speed.toFixed(0)+"r/min</th></tr>"
                    experiment_data_2+="<tr><th>背吃刀量</th><th>"+bcdl+"mm</th></tr>"
                    experiment_data_2+="<tr><th>进给量</th><th>"+jjl+"mm/r</th></tr>"
                    experiment_data_2+="<tr><th>工件材料</th><th>"+bangliao_material+"</th></tr>"
                    experiment_data_2+="<tr><th>工件加工前直径</th><th>"+bangliao_r*2+"mm</th></tr>"
                    experiment_data_2+="<tr><th>工件总长度</th><th>"+bangliao_length+"mm</th></tr>"

                }
                let x = (count != 0) ? Math.round(cut_length * 10) / 10 : 0;
                let y = Number((cutting_roughnes * (getNumberInNormalDistribution(1,0.03))).toFixed(4));
                if(count%10==0){
                    if(count%50==0){
                        draw_chart(chart_line1,2000,x,y);
                    }
                    draw_chart(chart_line2,30,x,y);
                    experiment_data_3+="<tr><th>"+experiment_data_num+"</th><th>"+x+"</th><th>"+y+"</th></tr>"
                    experiment_data_num+=1;
                }
                count+=1;
            }
        }
        catch(e){
            // console.log(e)
        }

    }
    
    exp_information="<h3>实验参数</h3><p><b>刀具参数</b></p>"+"<table style='margin-top: -10px;font-size: 13px';width:'200px'><tr><td>主偏角</td><td>副偏角</td><td>刃倾角</td><td>前角</td><td>后角</td><td>副刃后角</td></tr><tr>"+"<td>"+main_angle+"°</td>"+"<td>"+tool_minor_cutting_edge_angle+"°</td>"+"<td>"+edge_inclination_angle+"°</td>"+"<td>"+rake_angle+"°</td>"+"<td>"+back_angle+"°</td>"+"<td>"+secondary_edge_back_angl+"°</td></tr></table>"
    exp_information+="<p><b>切削用量</b></p>"+"<table style='margin-top: -10px;font-size: 13px';width:'200px'><tr><td>机床转速</td><td>背吃刀量</td><td>进给量</td></tr><tr>"+"<td>"+machine_speed.toFixed(0)+"r/min</td>"+"<td>"+bcdl+"mm</td>"+"<td>"+jjl+"mm/r</td></tr></table>"
    exp_information+="<p><b>被加工件参数</b></p>"+"<table style='margin-top: -10px;font-size: 13px';width:'200px'><tr><td>工件材料</td><td>加工前直径</td><td>工件总长度</td></tr><tr>"+"<td>"+bangliao_material+"</td>"+"<td>"+bangliao_r*2+"mm</td>"+"<td>"+bangliao_length+"mm</td></tr></table>"
    
 
    

    
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    // controls.update();

}
//加载棒料
function create_bangliao(){
    bangliao_r2=bangliao_r1-bcdl;
    //未切削棒料的材质
    let materials_bangliao=[];
    let color1=new THREE.Color(1,1,1);
    let color2=new THREE.Color(1,1,1);
    if(bangliao_material=='45_steel'){
        color1=new THREE.Color(0.95,0.85,0.85);
        color2=new THREE.Color(0.85,0.85,0.85);
    }
    else if(bangliao_material=='malleable_cast_iron'){
        color1=new THREE.Color(0.85,0.75,0.75);
        color2=new THREE.Color(0.75,0.75,0.75);
    }
    else if(bangliao_material=='gray_iron'){
        color1=new THREE.Color(0.8,0.7,0.7);
        color2=new THREE.Color(0.7,0.7,0.7);
    }
    
    materials_bangliao.push([
        new THREE.MeshPhysicalMaterial({
        color:color1,
        // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.6,
        }),
    ]);
    
    //加工面棒料的材质
    materials_bangliao.push([
    new THREE.MeshPhysicalMaterial({
        color:color2,
        // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 1.0,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.6,
        }),
    ]);

    //加工面棒料的材质
    materials_bangliao.push([
        new THREE.MeshPhysicalMaterial({
            color:color2,
            // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
            // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
            metalness: 1.0,
            // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
            roughness: 0.45,
            }),
    ]);

    bangliao.push(create_cylinder(create_vertices(bangliao_r1,bangliao_r1,bangliao_length).vertices,materials_bangliao[0],1,0,1));
    bangliao.push(create_cylinder(create_vertices(bangliao_r1,bangliao_r2,bangliao2_length).vertices,materials_bangliao[1],1,0,1));
    bangliao.push(create_cylinder(create_vertices(bangliao_r2,bangliao_r2,bangliao2_length).vertices,materials_bangliao[1],1,0,1));
    bangliao.push(create_cylinder(create_vertices(bangliao_r2,bangliao_r2,bangliao2_length).vertices,materials_bangliao[2],0,1,0));
    // bangliao.push(create_cylinder(create_vertices(bangliao_r1,bangliao_r1,0.3).vertices,materials_bangliao[0],materials_bangliao[0],materials_bangliao[0]));
    bangliao.forEach(function(e){
        e.rotation.x=0.5*Math.PI;
        e.rotation.y=0.5*Math.PI;
        scene.add(e);
        console.log("棒料加载完成")
        // e.rotation.x=(0.5) * Math.PI;
    });
}

//车刀加载
function create_tool_to_scene(){
    tool=create_tool(main_angle,tool_minor_cutting_edge_angle,edge_inclination_angle,rake_angle,back_angle,secondary_edge_back_angl);
    tool.position.z=0;
    // tool.scale.set(1,1,1);
    scene.add(tool);
    
    // tool.position.y=100
    tool.rotation.z=0.5*Math.PI;
    tool.position.x=0+bangliao_length-cut_length+bcdl*trig('cot',main_angle)+duidaobuchang;
    tool.position.y=-bangliao_r1+bcdl;
    // tool.position.z=-20;
    console.log("车刀加载完成")
}
//模型位置控制
function models_control()
{
    //刀架
        // 16-dizuo2
        // 17-dizuo2gaogui
        // 18-dizuo2shoulun
        // 25-dizuo
        // 30-daozuo
    let daojia_list=[16,17,18,25,30]
    for (let i=0;i<daojia_list.length;i++){
        models[daojia_list[i]].children[0].position.x=models_info[daojia_list[i]].position_x+models_info[daojia_list[i]].view_position_x+ bangliao_length-cut_length+bcdl*trig('cot',main_angle)+duidaobuchang-1463;
        models[daojia_list[i]].children[0].position.y=140-bangliao_r1+bcdl+models_info[daojia_list[i]].position_y+models_info[daojia_list[i]].view_position_y;
    }
    //溜杆箱 
        // 13-jinjixiang
        // 14-liuganxiangdaogui
        // 24-liuganxiangshoulun
    let liuganxinag_list=[13,14,24]
    for (let i=0;i<liuganxinag_list.length;i++){
        models[liuganxinag_list[i]].children[0].position.x=models_info[liuganxinag_list[i]].position_x+models_info[liuganxinag_list[i]].view_position_x+ bangliao_length-cut_length+bcdl*trig('cot',main_angle)+duidaobuchang-1463;
    }
    // 尾座
        // 21-weizuodingjian
        // 22-weizuoshoulun
        // 23-weizuosuojinshoubing
        // 29-weizuodizuo
        let weizuo_list=[21,22,23,29]
    for (let i=0;i<weizuo_list.length;i++){
        models[weizuo_list[i]].children[0].position.x=models_info[weizuo_list[i]].position_x+models_info[weizuo_list[i]].view_position_x+ bangliao_length-2323;
    }
    // 夹盘爪位置
    models[31].children[0].rotation.x=rot_angle;
    models[31].children[0].position.z=szjp_distance*Math.cos(-rot_angle);
    models[31].children[0].position.y=szjp_distance*Math.sin(-rot_angle);

    models[32].children[0].rotation.x=(2/3) * Math.PI+rot_angle;
    models[32].children[0].position.z=szjp_distance*Math.cos(-rot_angle-(2/3)*Math.PI);
    models[32].children[0].position.y=szjp_distance*Math.sin(-rot_angle-(2/3)*Math.PI);

    models[33].children[0].rotation.x=(4/3) * Math.PI+rot_angle;
    models[33].children[0].position.z=szjp_distance*Math.cos(-rot_angle-(4/3)*Math.PI);
    models[33].children[0].position.y=szjp_distance*Math.sin(-rot_angle-(4/3)*Math.PI);


    // 夹盘旋转
    models[2].children[0].rotation.z=60*(Math.PI/180)-Math.PI+rot_angle;
    // 尾座顶尖旋转
    models[21].children[0].rotation.x=-Math.PI+rot_angle;
    // 丝杠旋转
    // if(machine_status==3){
    //     models[10].children[0].rotation.x+=frame_time*machine_speed*jjl*Math.PI/240000;
    // }
    // 车刀移动
    tool.position.x=0+bangliao_length-cut_length+bcdl*trig('cot',main_angle)+duidaobuchang;
    tool.position.y=-bangliao_r1+bcdl;
    // 棒料位置
    bangliao[1].position.x=bangliao_length-cut_length-bangliao2_length;
    bangliao[2].position.x=bangliao_length-cut_length;
    bangliao[3].position.x=bangliao_length-cut_length;
}

// 图表初始化
function init_chart(){
    //图表
    chart_line1=new chart_line('container','dark',0.5,'#6cb041','','切削长度','表面粗糙度','mm','mm',true,true,true,true,false,true);
    chart_line1.update();
    chart_line2=new chart_line('container2','dark',1,'#9999ff','','切削长度','表面粗糙度','mm','mm',true,true,true,true,true,false);
    chart_line2.update();
}
//绘制图像
function draw_chart(chart,number,x,y){
    if(chart.data.length>number){
        chart.delete_data();
    }
    chart.push_data(x,y); 
    chart.update();
}
// 关闭机床
function end_machine(){
    accelerate_num=-300;
    machine_status=0;
    machine_speed_closing=machine_speed;
    aims_machine_speed = 0;
}

//获取url参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
        
//正态分布随机数
function getNumberInNormalDistribution(mean, std_dev) {
    return mean + (randomNormalDistribution() * std_dev);

    function randomNormalDistribution() {
        var u = 0.0, v = 0.0, w = 0.0, c = 0.0;
        do {
            //获得两个（-1,1）的独立随机变量
            u = Math.random() * 2 - 1.0;
            v = Math.random() * 2 - 1.0;
            w = u * u + v * v;
        } while (w == 0.0 || w >= 1.0)
        //这里就是 Box-Muller转换
        c = Math.sqrt((-2 * Math.log(w)) / w);
        //返回2个标准正态分布的随机数，封装进一个数组返回
        //当然，因为这个函数运行较快，也可以扔掉一个
        //return [u*c,v*c];
        return u * c;
    }
}
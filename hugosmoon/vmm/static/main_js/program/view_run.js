
//过滤注释
// let aaaa =code.split('###');
// let bbbb = '';
// for(let i=0;i<aaaa.length;i+=2){
//     bbbb+=aaaa[i];
// }
// code=bbbb;

code = code.replace(/###((?!###~~~).)*###~~~/g, "")

//过滤换行及空格
code = code.replace(/~~~/g, "")
code = code.replace(/\s*/g,"");
//转义字符
let arrEntities={'#x27':"'",'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
code = code.replace(/&(#x27|lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});


//默认定义21个按钮对象
let B=[];
for(let i=0;i<21;i++){
    B[i]=new BUTTON(i);
}
//模型对象数组
let M=[];
//总控制对象
let run=new RUN(code);

//初始化全局变量
let TIME_STEP=run.time_step;
let GAME_TITLE="HUGOSMOON - "+Date.now();

// 执行前两块代码
eval(run.code.v);
eval(run.code.b);



function RUN(code){
    let code_list=code.split('**@**');
    let serial_list = code_list[0].split('-');
    for(let i =0;i<serial_list.length;i++){
        if(serial_list[i]){
            M[serial_list[i]]=new model_run(serial_list[i]);
        }
    }
    
    this.code={
        v:'',
        b:'',
        l:''
    }

    let code_run=code_list[1];
    this.code.v=code_run.match(/START_VAR(\S*)END_VAR/) ? code_run.match(/START_VAR(\S*)END_VAR/)[1] : '';
    this.code.b= code_run.match(/START_EVENT(\S*)END_EVENT/) ? code_run.match(/START_EVENT(\S*)END_EVENT/)[1] : '';
    this.code.l=code_run.match(/START_LOOP(\S*)END_LOOP/) ? code_run.match(/START_LOOP(\S*)END_LOOP/)[1] : '';


    this.time_1=Date.now();
    this.time_2=Date.now();
    this.time_step=0;
    this.update_time_step=function(){
        this.time_1=this.time_2;
        this.time_2=Date.now();
        this.time_step=(this.time_2-this.time_1)/1000;
    }
}

function model_run(serial){
        this.serial=serial;
        this.position={
            x:0,
            y:0,
            z:0
        }
        this.rotation={
            x:0,
            y:0,
            z:0
        }
        this.scale={
            x:1,
            y:1,
            z:1
        }
        this.visible=true;
        this.color={
            r:0,
            g:0,
            b:0
        }
        this.emissive={
            r:0,
            g:0,
            b:0
        }
        ////材质金属性
        this.metalness=1.0;
        ////材质粗糙度（从镜面反射到漫反射）
        this.roughness=0.5;
        this.emissiveIntensity=0;
        ////非金属材料的反射率。 当metalness为1.0时无效
        this.reflectivity=0.5;



        this.set_visible=function(bool){
            models[this.serial].children[0].visible=bool;
            this.visible=bool;
        }
        this.move=function(axis,speed){
            // console.log(speed)
            if(axis=='x'){
                models[this.serial].children[0].position.x+=speed*run.time_step;
                this.position.x=models[this.serial].children[0].position.x;
            }
            else if(axis=='y'){
                models[this.serial].children[0].position.y+=speed*run.time_step;
                this.position.y=models[this.serial].children[0].position.y;
            }
            else if(axis=='z'){
                models[this.serial].children[0].position.z+=speed*run.time_step;
                this.position.z=models[this.serial].children[0].position.z;
            }
        }
        this.set_position=function(axis,positon){
            if(axis=='x'){
                models[this.serial].children[0].position.x=positon;
                this.position.x=positon;
            }
            else if(axis=='y'){
                models[this.serial].children[0].position.y=positon;
                this.position.y=positon;
            }
            else if(axis=='z'){
                models[this.serial].children[0].position.z=positon;
                this.position.z=positon;
            }
        }
        this.rotate=function(axis,ang_v){
            if(axis=='x'){
                models[this.serial].children[0].rotation.x=(models[this.serial].children[0].rotation.x+ang_v*run.time_step*Math.PI/180)%360;
                this.rotation.x=models[this.serial].children[0].rotation.x*180/Math.PI;
            }
            else if(axis=='y'){
                models[this.serial].children[0].rotation.y=(models[this.serial].children[0].rotation.y+ang_v*run.time_step*Math.PI/180)%360;
                this.rotation.y=models[this.serial].children[0].rotation.y*180/Math.PI;
            }
            else if(axis=='z'){
                models[this.serial].children[0].rotation.z=(models[this.serial].children[0].rotation.z+ang_v*run.time_step*Math.PI/180)%360;
                this.rotation.z=models[this.serial].children[0].rotation.z*180/Math.PI;
            }
        }
        this.set_rotation=function(axis,rotation){
            if(axis=='x'){
                models[this.serial].children[0].rotation.x=rotation*Math.PI/180;
                this.rotation.x=rotation;
            }
            else if(axis=='y'){
                models[this.serial].children[0].rotation.y=rotation*Math.PI/180;
                this.rotation.y=rotation;
            }
            else if(axis=='z'){
                models[this.serial].children[0].rotation.z=rotation*Math.PI/180;
                this.rotation.z=rotation;
            }
        }
        this.zoom=function(axis,sca_v){
            // console.log(speed)
            if(axis=='x'){
                let m=models[this.serial].children[0].scale.x+sca_v*run.time_step;
                models[this.serial].children[0].scale.x= m > 0.0001 ? m:0.0001;
                this.scale.x=models[this.serial].children[0].scale.x;
            }
            else if(axis=='y'){
                let m=models[this.serial].children[0].scale.y+sca_v*run.time_step;
                models[this.serial].children[0].scale.y= m > 0.0001 ? m:0.0001;
                this.scale.y=models[this.serial].children[0].scale.y;
            }
            else if(axis=='z'){
                let m=models[this.serial].children[0].scale.z+sca_v*run.time_step;
                models[this.serial].children[0].scale.z= m > 0.0001 ? m:0.0001;
                this.scale.z=models[this.serial].children[0].scale.z;
            }
        }
        this.set_scale=function(axis,scale){
            if(axis=='x'){
                models[this.serial].children[0].scale.x=scale;
                this.scale.x=scale;
            }
            else if(axis=='y'){
                models[this.serial].children[0].scale.y=scale;
                this.scale.y=scale;
            }
            else if(axis=='z'){
                models[this.serial].children[0].scale.z=scale;
                this.scale.z=scale;
            }
        }

        // 设置颜色
        this.set_color=function(r,g,b){
            models[this.serial].children[0].material.color={
                r:r/255,
                g:g/255,
                b:b/255
            }
            this.color={
                r:r/255,
                g:g/255,
                b:b/255
            }
        }
        // 设置发光颜色
        this.set_emissive=function(r,g,b){
            models[this.serial].children[0].material.emissive={
                r:r/255,
                g:g/255,
                b:b/255
            }
            this.emissive={
                r:r/255,
                g:g/255,
                b:b/255
            }
        }
        this.set_metalness=function(n){
            models[this.serial].children[0].material.metalness=n;
            this.metalness=n;
        }
        this.set_roughness=function(n){
            models[this.serial].children[0].material.roughness=n;
            this.roughness=n;
        }
        this.set_emissiveIntensity=function(n){
            models[this.serial].children[0].material.emissiveIntensity=n;
            this.emissiveIntensity=n;
        }
        this.set_reflectivity=function(n){
            models[this.serial].children[0].material.reflectivity=n;
            this.reflectivity=n;
        }

        // 碰撞检验
        // this.

}

function BUTTON(id){
    this.id=id;
    this.text="";
    this.click=function(str){
        let code = "$(document).on('click','button#"+this.id+"',function(){"+str+"});";
        eval(code);
    }
    this.init=function(str){
        $("#buttons").show()
        this.text=str;
        $("#buttons").append("<el-button type='primary' id='"+this.id+"'>"+this.text+"</el-button>")
        if(id%2==0){
            $("#buttons").append("<br><br>")
        }
        
    }
}

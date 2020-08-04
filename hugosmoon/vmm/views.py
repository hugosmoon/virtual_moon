from django.shortcuts import render,HttpResponse,redirect
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import math
import random
import json
from django.db.models import Sum, Count
from vmm.models import Load_models_conf,folder,com_model,views,display_views,users,visit_log,view_program
import os
import time
from django.db.models import Q

# from . import qiniuupdownload
from . import qiniu_file_manage
from qiniu import Auth, put_file, etag
import qiniu.config
import requests



#
 
def home(request):
    return render(request, 'index.html')
def test(request):
    return render(request, 'test/test.html')

def tool_display(request):
    return render(request, 'tooldisplay/tooldisplay.html')
# 创建用户页面
def adduser(request):
    return render(request, 'user/adduser.html')
    
# 创建用户
@csrf_exempt
def createuser(request):
    if request.method == 'POST':
        print(request.POST)
        username=request.POST.get('username')
        # print("#"*20)
        if username=="":
            return HttpResponse('用户名不能为空')
        password=request.POST.get('password')
        if password == "":
            return HttpResponse('密码不能为空')
        usertype=request.POST.get('usertype')
        if usertype != '1' and usertype != '0':
            return HttpResponse('请选择正确的用户类型')
        else:
            # print(usertype)
            usertype=int(usertype)
        user_exist=users.objects.filter(isdelete=False,username=username)
        # print(len(user_exist))
        if len(user_exist) != 0:
            return HttpResponse('用户名与已有用户重复')
        users.objects.create(username=username,password=password,usertype=usertype)
        return HttpResponse('用户创建成功')
    return HttpResponse('用户创建失败')

# 登录页面
@csrf_exempt
def login_page(request):
    url="/vmm/index/"
    if request.method == 'POST':
        url=request.POST.get('url')
    return render(request, 'user/login.html',{"url": url})
# 登录
@csrf_exempt
def do_login(request): 
    if request.method == 'POST':
        # print(request.POST)
        username=request.POST.get('username')
        password=request.POST.get('password')
        url=request.POST.get('url')
        if username != "" and password != "" and url != "":
            user=users.objects.filter(isdelete=False,username=username)
            if len(user)==0:
                return HttpResponse("账号不存在")
            else:
                # print(user[0].password)
                if password==user[0].password:
                    rt = redirect(url) #跳转页面
                    rt.set_cookie('username', username)
                    rt.set_cookie('password', password)
                    rt.set_cookie('userid', user[0].id)
                    return rt
                else:
                    return HttpResponse("密码错误")
    return HttpResponse("登录失败")

# 登录验证
@csrf_exempt
def login_verification(request):
    if request.method == 'POST':
        # print(request.POST)
        username=request.POST.get('username')
        password=request.POST.get('password')
        if username != "" and password != "":
            user=users.objects.filter(isdelete=False,username=username)
            if len(user)==0:
                return HttpResponse(False)
            if password==user[0].password:
                return HttpResponse(True)
        return HttpResponse(False)

# 管理员验证
@csrf_exempt
def admin_verification(request):
    if request.method == 'POST':
        print(request.POST)
        username=request.POST.get('username')
        if username != "" :
            user=users.objects.get(isdelete=False,username=username)   
            print(user.usertype)
            if user.usertype==0:
                return HttpResponse(True)
        return HttpResponse(False)


@csrf_exempt
def qxyl(request): 
    if request.method == 'POST':
        # print(request.POST)
        main_angle=request.POST.get('main_angle')
        tool_minor_cutting_edge_angle=request.POST.get('tool_minor_cutting_edge_angle')
        edge_inclination_angle=request.POST.get('edge_inclination_angle')
        rake_angle=request.POST.get('rake_angle')
        back_angle=request.POST.get('back_angle')
        secondary_edge_back_angl=request.POST.get('secondary_edge_back_angl')
        bangliao_r=request.POST.get('bangliao_r')
        bangliao_length=request.POST.get('bangliao_length')
        daojujiaodubuchang=request.POST.get('daojujiaodubuchang')
        bangliao_material=request.POST.get('bangliao_material')
        print(bangliao_material)
        return render(request, 'cuttingforce/qxyl_2.html',{"main_angle": main_angle,"tool_minor_cutting_edge_angle": tool_minor_cutting_edge_angle,"edge_inclination_angle": edge_inclination_angle,"rake_angle": rake_angle,"back_angle": back_angle,"secondary_edge_back_angl": secondary_edge_back_angl,"bangliao_r": bangliao_r,"bangliao_length": bangliao_length,"daojujiaodubuchang": daojujiaodubuchang,"bangliao_material": bangliao_material})
    return render(request, 'cuttingforce/qxyl_1.html')
def model_debugger(request):
    return render(request, 'test/model_debugger.html')
def model_manage(request):
    return render(request, 'test/model_manage.html')
def view_display(request,view_id):
    return render(request, 'test/view_display.html',{"view_id": view_id})

@csrf_exempt
def jgzl(request): 
    if request.method == 'POST':
        # print(request.POST)
        main_angle=request.POST.get('main_angle')
        tool_minor_cutting_edge_angle=request.POST.get('tool_minor_cutting_edge_angle')
        edge_inclination_angle=request.POST.get('edge_inclination_angle')
        rake_angle=request.POST.get('rake_angle')
        back_angle=request.POST.get('back_angle')
        secondary_edge_back_angl=request.POST.get('secondary_edge_back_angl')
        bangliao_r=request.POST.get('bangliao_r')
        bangliao_length=request.POST.get('bangliao_length')
        daojujiaodubuchang=request.POST.get('daojujiaodubuchang')
        bangliao_material=request.POST.get('bangliao_material')
        corner_radius=request.POST.get('corner_radius')

        return render(request, 'cuttingquality/jgzl_2.html',{"main_angle": main_angle,"tool_minor_cutting_edge_angle": tool_minor_cutting_edge_angle,"edge_inclination_angle": edge_inclination_angle,"rake_angle": rake_angle,"back_angle": back_angle,"secondary_edge_back_angl": secondary_edge_back_angl,"bangliao_r": bangliao_r,"bangliao_length": bangliao_length,"daojujiaodubuchang": daojujiaodubuchang,"bangliao_material": bangliao_material,"corner_radius":corner_radius})
    return render(request, 'cuttingquality/jgzl_1.html')

@csrf_exempt
def qxwd(request): 
    if request.method == 'POST':
        # print(request.POST)
        main_angle=request.POST.get('main_angle')
        tool_minor_cutting_edge_angle=request.POST.get('tool_minor_cutting_edge_angle')
        edge_inclination_angle=request.POST.get('edge_inclination_angle')
        rake_angle=request.POST.get('rake_angle')
        back_angle=request.POST.get('back_angle')
        secondary_edge_back_angl=request.POST.get('secondary_edge_back_angl')
        bangliao_r=request.POST.get('bangliao_r')
        bangliao_length=request.POST.get('bangliao_length')
        daojujiaodubuchang=request.POST.get('daojujiaodubuchang')
        bangliao_material=request.POST.get('bangliao_material')
        return render(request, 'cuttingtemperature/qxwd_2.html',{"main_angle": main_angle,"tool_minor_cutting_edge_angle": tool_minor_cutting_edge_angle,"edge_inclination_angle": edge_inclination_angle,"rake_angle": rake_angle,"back_angle": back_angle,"secondary_edge_back_angl": secondary_edge_back_angl,"bangliao_r": bangliao_r,"bangliao_length": bangliao_length,"daojujiaodubuchang": daojujiaodubuchang,"bangliao_material": bangliao_material})
    return render(request, 'cuttingtemperature/qxwd_1.html')
                            

# 计算切削力
@csrf_exempt
def cuttingforce_cal(request):
    #接收基础参数
    if request.method == 'POST':
        workpiece_material=request.POST.get('bangliao_material')
        feed_rate = float(request.POST.get('feed_rate'))
        cutting_depth = float(request.POST.get('cutting_depth'))
        cutting_speed = float(request.POST.get('cutting_speed'))
        tool_cutting_edge_angle = float(request.POST.get('tool_cutting_edge_angle'))
        rake_angle = float(request.POST.get('rake_angle'))
    else:
        return HttpResponse(False)
    #定义各种参数
    c_fc=x_fc=y_fc=k_tool_cutting_edge_angle=k_rake_angle=k_tool_cutting_edge_inclination_angle=k_corner_radius=k_strength=0
    k_cutting_speed=1

    #依据工件材料修改参数
    if(workpiece_material=="45_steel"):
        c_fc = 180
        x_fc = 1.0
        y_fc = 0.75
        k_strength=1
        if(float(cutting_speed)<17):
            k_cutting_speed=1-(0.2/17)*float(cutting_speed)
        elif(float(cutting_speed)>=17 and float(cutting_speed)<30):
            k_cutting_speed = 0.8 + (0.4/ 13) * (float(cutting_speed)-17)
        elif(float(cutting_speed)>=30 and float(cutting_speed)<40):
            k_cutting_speed=1.2-(float(cutting_speed)-30)*(0.2/10)
        elif(float(cutting_speed)>=40 and float(cutting_speed)<800):
            k_cutting_speed = 1 - (float(cutting_speed) - 40) * (0.2/760)
        elif(float(cutting_speed)>=1000):
            k_cutting_speed=0.8

    elif(workpiece_material=="stainless_steel"):
        c_fc = 204
        x_fc = 1.0
        y_fc = 0.75
        k_strength = 1
    elif (workpiece_material == "gray_iron"):
        c_fc = 92
        x_fc = 1.0
        y_fc = 0.75
        k_strength = 1
    elif (workpiece_material == "malleable_cast_iron"):
        c_fc = 81
        x_fc = 1.0
        y_fc = 0.75
        k_strength = 1

    #依据刀具角度修改参数
    #主偏角
    k_tool_cutting_edge_angle=(0.004949*tool_cutting_edge_angle*tool_cutting_edge_angle-0.9112*tool_cutting_edge_angle+130.9)/100

    #前角
    k_rake_angle=1.25-((rake_angle+15)/100)

    #刃倾角系数
    k_tool_cutting_edge_inclination_angle = 1

    #刀尖圆弧半径系数
    k_corner_radius=1

    #计算切削力
    cutting_force=9.81*c_fc*(math.pow(cutting_depth,x_fc))*(math.pow(feed_rate,y_fc))*k_tool_cutting_edge_angle*k_rake_angle*k_tool_cutting_edge_inclination_angle*k_corner_radius*k_strength*k_cutting_speed

    return HttpResponse(cutting_force)

# 计算切削温度
@csrf_exempt
def cutting_temp_cal(request):
    # 接收基础参数
    if request.method == 'POST':
        workpiece_material = request.POST.get('bangliao_material')
        feed_rate = float(request.POST.get('feed_rate'))
        cutting_depth = float(request.POST.get('cutting_depth'))
        cutting_speed = float(request.POST.get('cutting_speed'))
        tool_cutting_edge_angle = (request.POST.get('tool_cutting_edge_angle'))
        rake_angle = (request.POST.get('rake_angle'))
        tool_cutting_edge_inclination_angle = (request.POST.get('tool_cutting_edge_inclination_angle'))
        corner_radius = (request.POST.get('corner_radius'))
        cutting_fluid=request.POST.get('cutting_fluid')

    else:
        return HttpResponse(False)

    #计算各种修正参数
    k0 = 220 + 0.4 * cutting_speed
    k_tool_cutting_edge_angle = 0
    k_rake_angle = 0
    k_workpiece_material = 0

    x=0.26+feed_rate*0.15
    cutting_fluid_arg=1


    # 主偏角
    tool_cutting_edge_angle=float(tool_cutting_edge_angle)
    if (tool_cutting_edge_angle <= 30):
        k_tool_cutting_edge_angle = 1
    elif (tool_cutting_edge_angle <45):
        k_tool_cutting_edge_angle = 1-0.05*(45-tool_cutting_edge_angle)/15
    elif (tool_cutting_edge_angle <60):
        k_tool_cutting_edge_angle = 1.05-0.1*(60-tool_cutting_edge_angle)/15
    elif (tool_cutting_edge_angle < 75):
        k_tool_cutting_edge_angle = 1.15-0.05*(75-tool_cutting_edge_angle)/15
    elif (tool_cutting_edge_angle <= 90):
        k_tool_cutting_edge_angle = 1.2-0.05*(90-tool_cutting_edge_angle)/15
    else:
        k_tool_cutting_edge_angle = 1.2

    # 前角
    rake_angle=float(rake_angle)
    if (rake_angle <= -15):
        k_rake_angle = 1.2
    elif (rake_angle < -10):
        k_rake_angle = 1.2+0.05*(rake_angle+10)/5
    elif (rake_angle < 0):
        k_rake_angle = 1.15+0.05*(rake_angle)/10
    elif (rake_angle < 10):
        k_rake_angle = 1.05+0.1*(rake_angle-10)/10
    elif (rake_angle <= 20):
        k_rake_angle = 1+0.1*(rake_angle-20)/10
    else:
        k_rake_angle=1



    #根据工件材料确定参数
    if (workpiece_material == "45_steel"):
        k_workpiece_material = 1
    elif (workpiece_material == "stainless_steel"):
        k_workpiece_material = 1.3
    elif (workpiece_material == "gray_iron"):
        k_workpiece_material = 0.8
    elif (workpiece_material == "malleable_cast_iron"):
        k_workpiece_material = 0.85

    # 切削液条件
    if cutting_fluid=="water_based_cutting_fluid":
        cutting_fluid_arg=0.55
    elif cutting_fluid=="oil_based_cutting_fluid":
        cutting_fluid_arg = 0.88

    temp=(random.uniform(0.97, 1.03))*k0*k_tool_cutting_edge_angle*k_rake_angle*k_workpiece_material*math.pow(cutting_speed,x)*math.pow(cutting_depth,0.04)*math.pow(feed_rate,0.14)*cutting_fluid_arg

    return HttpResponse(temp)

#计算表面粗糙度
@csrf_exempt
def cutting_roughness_cal(request):
    # 接收基础参数
    if request.method == 'POST':
        feed_rate = float(request.POST.get('feed_rate'))
        cutting_depth = float(request.POST.get('cutting_depth'))
        cutting_speed = float(request.POST.get('cutting_speed'))
        tool_cutting_edge_angle = math.pi*float(request.POST.get('tool_cutting_edge_angle'))/180
        tool_minor_cutting_edge_angle = math.pi*float(request.POST.get('tool_minor_cutting_edge_angle'))/180
        corner_radius = float(request.POST.get('corner_radius'))


        R=(random.uniform(1, 1.3))*(math.pow(feed_rate, 2)/(8*corner_radius))*(1/((1/(math.tan(tool_cutting_edge_angle)))+(1/(math.tan(tool_minor_cutting_edge_angle)))))*math.pow(cutting_depth, 0.04)*(1+1/(math.pow((cutting_speed-30), 2)+1))
        # R=(random.uniform(1, 1.4))*(math.pow(feed_rate, 2)/(8*corner_radius))
        # R=corner_radius

        return HttpResponse(R)


#将模型的配置信息存入数据库  
@csrf_exempt
def save_models(request):
    #接收基础参数
    if request.method == 'POST':
        models=request.POST.getlist('models')
        models= json.loads(models[0])
        for model in models:
            # print(model)
            view_id=model['view_id']
            model_id=model['model_id']
            serial=model['index']
            model_name=model['model_name']
            model_url=model['url']
            position_x=model['position_x']
            position_y=model['position_y']
            position_z=model['position_z']
            view_position_x=model['view_position_x']
            view_position_y=model['view_position_y']
            view_position_z=model['view_position_z']
            
            

            rotation_x=model['rotation_x']
            rotation_y=model['rotation_y']
            rotation_z=model['rotation_z']
            materials_color_r=model['materials_color_r']
            materials_color_g=model['materials_color_g']
            materials_color_b=model['materials_color_b']

            scale_x=model['scale_x']
            scale_y=model['scale_y']
            scale_z=model['scale_z']

            materials_type=model['materials_type']

            metalness=model['metalness']
            roughness=model['roughness']
            emissive_r=model['emissive_r']
            emissive_g=model['emissive_g']
            emissive_b=model['emissive_b']
            emissiveIntensity=model['emissiveIntensity']
            reflectivity=model['reflectivity']
            

            


            models_in=Load_models_conf.objects.filter(view_id=view_id,model_id=model_id,serial=serial)
            if len(models_in) > 0:
                models_in.update(view_id=view_id,model_id=model_id,serial=serial,model_name=model_name,model_url=model_url,position_x=position_x,position_y=position_y,position_z=position_z,rotation_x=rotation_x,rotation_y=rotation_y,rotation_z=rotation_z,materials_color_r=materials_color_r,materials_color_g=materials_color_g,materials_color_b=materials_color_b,scale_x=scale_x,scale_y=scale_y,scale_z=scale_z,materials_type=materials_type,metalness=metalness,roughness=roughness,emissive_r=emissive_r,emissive_g=emissive_g,emissive_b=emissive_b,emissiveIntensity=emissiveIntensity,reflectivity=reflectivity,view_position_x=view_position_x,view_position_y=view_position_y,view_position_z=view_position_z)
            else:
                Load_models_conf.objects.create(view_id=view_id,model_id=model_id,serial=serial,model_name=model_name,model_url=model_url,position_x=position_x,position_y=position_y,position_z=position_z,rotation_x=rotation_x,rotation_y=rotation_y,rotation_z=rotation_z,materials_color_r=materials_color_r,materials_color_g=materials_color_g,materials_color_b=materials_color_b,scale_x=scale_x,scale_y=scale_y,scale_z=scale_z,materials_type=materials_type,metalness=metalness,roughness=roughness,emissive_r=emissive_r,emissive_g=emissive_g,emissive_b=emissive_b,emissiveIntensity=emissiveIntensity,reflectivity=reflectivity,view_position_x=view_position_x,view_position_y=view_position_y,view_position_z=view_position_z)
        return HttpResponse('Save Success')
#根据场景名称获取模型组数据
@csrf_exempt
def get_models_by_view(request):
    if request.method == 'POST':
        view_id=int(request.POST.get('view_id'))
        if len(views.objects.filter(id=view_id,parent_id=0)) == 0:
            models=Load_models_conf.objects.filter(view_id=view_id,isdelete=False).values()
            data={}
            data['models'] = list(models)
            return JsonResponse(data)
        child_view_ids=views.objects.filter(parent_id=view_id).values()
        # print(child_view_ids[1]['id'])
        child_view_id_list=[]
        for child_view_id in child_view_ids:
            child_view_id_list.append(int(child_view_id['id']))
        # print(child_view_id_list)
        models=Load_models_conf.objects.filter(view_id__in=child_view_id_list,isdelete=False).values()
        data={}
        data['models'] = list(models)
        return JsonResponse(data)

#根据模型场景名称和index删除模型
@csrf_exempt
def delete_model(request):
    # return HttpResponse('success')
    if request.method == 'POST':
        view_id=request.POST.get('view_id')
        serial=request.POST.get('model_index')
        print(view_id)
        print(serial)
        model=Load_models_conf.objects.filter(view_id=view_id,serial=serial)
        model.update(isdelete=True)
        return HttpResponse('delete_success')

#查询有哪些场景
@csrf_exempt
def get_views(request):
    if request.method == 'POST':
        parent_id=int(request.POST.get('parent_id'))
        owner_id=int(request.POST.get('owner_id'))
        if parent_id != 0:
            get_views=views.objects.filter(isdelete=False,parent_id=parent_id).values()
            data={}
            data['views']=list(get_views)
            return JsonResponse(data)

        get_views=views.objects.filter(isdelete=False,parent_id=0,owner_id=owner_id).values()
        data={}
        data['views']=list(get_views)
        return JsonResponse(data)
# 验证场景名是否存在
@csrf_exempt
def is_view_exist(request):
    if request.method == 'POST':
        view_name=request.POST.get('view_name')
        owner_id=request.POST.get('owner_id')
        if len(views.objects.filter(view_name=view_name,owner_id=owner_id)) == 0:
            return HttpResponse('false')
        return HttpResponse('true')



# 新建场景
@csrf_exempt
def add_view(request):
    if request.method == 'POST':
        view_name=request.POST.get('view_name')
        parent_id=int(request.POST.get('parent_id'))
        owner_id=int(request.POST.get('owner_id'))  
        get_views=list(views.objects.filter(view_name=view_name,owner_id=owner_id,isdelete=False).values())
        # print(parent_id)
        if len(get_views) == 0:
            views.objects.create(view_name=view_name,owner_id=owner_id,parent_id=parent_id)
            return HttpResponse('场景新建成功')
        return HttpResponse('场景新建失败')


#创建文件夹
@csrf_exempt
def create_folder(request):
    # return HttpResponse('Save Success')
    if request.method == 'POST':
        folder_name=request.POST.get('folder_name')
        # print(folder_name)
        folders_existence=folder.objects.filter(isdelete=False,folder_name=folder_name).values()
        # print("*"*30)
        if len(folders_existence)!=0:
            return HttpResponse('新建失败，与已有文件夹重名')
        folder.objects.create(folder_name=folder_name)
        folder_url = os.path.dirname(globals()["__file__"])+'/static/models/'+folder_name
        #获取此py文件路径，在此路径选创建在new_folder文件夹中的test文件夹
        # print(folder_url)
        if not os.path.exists(folder_url):
            os.makedirs(folder_url)

        return HttpResponse('文件夹新建成功')

#查询文件夹
@csrf_exempt
def get_folders(request):
    if request.method == 'POST':
        owner_id=request.POST.get('owner_id')
        folders=folder.objects.filter(Q(owner_id=owner_id,isdelete=False)|Q(type=0,isdelete=False)).values()
        # print(folders)
        data={}
        data['folders']=list(folders)
        # print(data)
        return JsonResponse(data)

#上传模型
@csrf_exempt
def upload_model(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        folder_id=int(request.POST.get('folder_id'))
        folder_name=folder.objects.get(id=folder_id).folder_name
        # print(folder_name)
        file_type = file.name.split('.')[1]
        if file_type != 'STL' and file_type != 'stl':
            return HttpResponse(file.name+'上传失败,因为文件格式不是STL')
        
        # file_name_url=str(round(time.time()*1000000))+'.STL'
        
        # file_path = os.path.join(os.path.dirname(globals()["__file__"]),'static','models',folder_name,file_name_url)
        # f = open(file_path, 'wb')
        # for chunk in file.chunks():
        #     f.write(chunk)
        # f.close()
        # # return HttpResponse('OK')
        # com_model.objects.create(model_name=file.name,folder_id=folder_id,url='/static/models/'+folder_name+'/'+file_name_url)



        # file_name_url='test'+'.STL'
        
        file_path = os.path.join(os.path.dirname(globals()["__file__"]),'static','models','test.STL')
        f = open(file_path, 'wb')
        for chunk in file.chunks():
            f.write(chunk)
        f.close()

        access_key = 'VfUZy5Gm-aQkbLkpm_lcTraFLW9ac9h1wj-SHbbr'
        secret_key = 'hBwXWe0BBbkkntfGRUtSEmsA1M9uZqrESiWyIzzk'

        #构建鉴权对象
        q = Auth(access_key, secret_key)

        #要上传的空间
        bucket_name = 'hugosmodel'

        #上传后保存的文件名
        key = str(round(time.time()*1000000)) + '.STL'
        # key = 'qqqq' + '.STL'

        #生成上传 Token，可以指定过期时间等
        token = q.upload_token(bucket_name, key, 3600)

        #要上传文件的本地路径
        localfile = os.getcwd()+'/vmm/static/models/test.STL'

        ret, info = put_file(token, key, localfile)
        print(info.text_body)
        assert ret['key'] == key
        assert ret['hash'] == etag(localfile)
        com_model.objects.create(model_name=file.name,folder_id=folder_id,url='http://hugosmodel.diandijiaoyu.com.cn/'+key)


        return HttpResponse(file.name+'上传成功')

#查询对应文件夹的模型
@csrf_exempt
def get_model_by_folderid(request):
    if request.method == 'POST':
        folder_id=int(request.POST.get('folder_id'))
        print(folder_id)
        moldels=com_model.objects.filter(folder_id=folder_id,isdelete=False).values()
        data={}
        data['models']=list(moldels)
        return JsonResponse(data)

@csrf_exempt
def get_model_info_by_id(request):
    if request.method == 'POST':
        model_id=int(request.POST.get('model_id'))
        model_info=com_model.objects.filter(id=model_id).values()
        data={}
        data['model']=list(model_info)
        return JsonResponse(data)

# 创建or更新预览场景
@csrf_exempt
def create_display_view(request):
    if request.method == 'POST':
        view_id=int(request.POST.get('display_view_id'))
        display_name = request.POST.get('display_name')

        display_view=display_views.objects.filter(view_id=view_id,isdelete=False)
        if len(display_view) > 0:
            if len(display_view) > 1:
                return HttpResponse('failed')
            display_view.update(view_id=view_id,display_name=display_name)
        else:
            display_views.objects.create(view_id=view_id,display_name=display_name)
        return HttpResponse('success')

# 查询预览场景
@csrf_exempt
def get_display_view(request):
    if request.method == 'POST':
        view_id=int(request.POST.get('display_view_id'))
        view=display_views.objects.filter(view_id=view_id).values()
        data={}
        data['views']=list(view)
        return JsonResponse(data)

# 浏览器版本异常
def view_exception(request):
    return render(request, 'error/view_exception.html')

#创建访问日志
@csrf_exempt
def create_visit_log(request):
    if request.method == 'POST':
        page=int(request.POST.get('page'))
        ip=request.POST.get('ip')
        city=request.POST.get('city')
        visit_log.objects.create(page=page,ip=ip,city=city)
        return HttpResponse('success')

# 打开编程页面
@csrf_exempt
def view_program_page(request):
    if request.method == 'POST':
        view_id=int(request.POST.get('view_id'))
        code=''
        program=view_program.objects.filter(view_id=view_id,isdelete=False)
        if len(program)>0:
            code=program[0].code.replace("\n", "~~~")
        return render(request, 'test/view_program_page.html',{"view_id": view_id,"code":code})

# 保存代码
@csrf_exempt
def save_code(request):
    if request.method == 'POST':
        view_id=int(request.POST.get('view_id'))
        code=(request.POST.get('code'))
        program=view_program.objects.filter(view_id=view_id,isdelete=False)
        if len(program) > 0:
            if len(program) > 1:
                return HttpResponse('failed')
            program.update(view_id=view_id,code=code)
        else:
            view_program.objects.create(view_id=view_id,code=code)
        return HttpResponse('success')

# 执行代码的页面
def view_run(request,view_id):
    view_id=int(view_id)
    code=''
    program=view_program.objects.filter(view_id=view_id,isdelete=False)
    if len(program)>0:
        code=program[0].code.replace("\n", "~~~")
    return render(request, 'test/view_run.html',{"view_id": view_id,"code":code})


# 获取私有链接
@csrf_exempt
def get_private_model(request):
    if request.method == 'POST':
        base_url=request.POST.get('url')
        access_key = 'VfUZy5Gm-aQkbLkpm_lcTraFLW9ac9h1wj-SHbbr'
        secret_key = 'hBwXWe0BBbkkntfGRUtSEmsA1M9uZqrESiWyIzzk'
        #构建鉴权对象
        q = Auth(access_key, secret_key)
        private_url = q.private_download_url(base_url, expires=360)
        return HttpResponse(private_url)







    
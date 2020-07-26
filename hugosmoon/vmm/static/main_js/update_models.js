function update_models_info(){
    $.ajax({
        type: "POST",
        url: '/vmm/get_models_by_view/',
        data:{'view_id':display_view_id},
        success:function (res) {
            // console.log(res)
            models_got=res.models;
            load_models_num=models_got.length;
            models_got.forEach(model => {
                index=Number(model.serial);
                models_info[index]=new Model(model.view_id,model.model_id,model.model_name,model.model_url,index,model.materials_type);
                // models_info[index].change_po(model.position_x,model.position_y,model.position_z)
                models_info[index].change_po_x(model.position_x);
                models_info[index].change_po_y(model.position_y)
                models_info[index].change_po_z(model.position_z)
                models_info[index].change_view_po_x(model.view_position_x);
                models_info[index].change_view_po_y(model.view_position_y);
                models_info[index].change_view_po_z(model.view_position_z);

                // models_info[index].change_ro(model.rotation_x,model.rotation_y,model.rotation_z)
                models_info[index].change_ro_x(model.rotation_x)
                models_info[index].change_ro_y(model.rotation_y)
                models_info[index].change_ro_z(model.rotation_z)
                models_info[index].change_scale_x(model.scale_x)
                models_info[index].change_scale_y(model.scale_y)
                models_info[index].change_scale_z(model.scale_z)
                models_info[index].change_materials_color_r(model.materials_color_r)
                models_info[index].change_materials_color_g(model.materials_color_g)
                models_info[index].change_materials_color_b(model.materials_color_b)

                models_info[index].change_metalness(model.metalness)
                models_info[index].change_roughness(model.roughness)
                models_info[index].change_emissive_r(model.emissive_r)
                models_info[index].change_emissive_g(model.emissive_g)
                models_info[index].change_emissive_b(model.emissive_b)
                models_info[index].change_emissiveIntensity(model.emissiveIntensity)
                models_info[index].change_reflectivity(model.reflectivity)
                
            }); 
        },
        error:function (message) {
            console.log("场景加载失败");
        }
    });
    
}

function update_models(){
    for(let i=0;i<models_info.length;i++){
        if(models_info[i]){
            // console.log(models_info[i]);
            models[i].children[0].position.x=models_info[i].position_x+models_info[i].view_position_x;
            models[i].children[0].position.y=models_info[i].position_y+models_info[i].view_position_y;
            models[i].children[0].position.z=models_info[i].position_z+models_info[i].view_position_z;
            models[i].children[0].rotation.x=models_info[i].rotation_x;
            models[i].children[0].rotation.y=models_info[i].rotation_y;
            models[i].children[0].rotation.z=models_info[i].rotation_z;
            models[i].children[0].scale.x=models_info[i].scale_x;
            models[i].children[0].scale.y=models_info[i].scale_y;
            models[i].children[0].scale.z=models_info[i].scale_z;

            models[i].children[0].material.color.r=models_info[i].materials_color_r;
            models[i].children[0].material.color.g=models_info[i].materials_color_g;
            models[i].children[0].material.color.b=models_info[i].materials_color_b;

            models[i].children[0].material.emissive.r=models_info[i].emissive_r;
            models[i].children[0].material.emissive.g=models_info[i].emissive_g;
            models[i].children[0].material.emissive.b=models_info[i].emissive_b;

            models[i].children[0].material.metalness=models_info[i].metalness;

            models[i].children[0].material.roughness=models_info[i].roughness;

            models[i].children[0].material.reflectivity=models_info[i].reflectivity;

            models[i].children[0].material.emissiveIntensity=models_info[i].emissiveIntensity;
        }
    } 

}
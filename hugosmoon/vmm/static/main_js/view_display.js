// alert({{view_id}})
function load_models(display_view_id){
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
            for(let i=0;i<models_info.length;i++){
                if(models_info[i]){
                    initObject(i);
                }
            } 
        },
        error:function (message) {
            console.log("场景加载失败");
        }
    });

}
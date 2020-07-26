function create_visit_log(page){
    $.ajax({
        type: 'POST',
        url: "/vmm/create_visit_log/" ,
        data: {
        'page':page,
        'ip':returnCitySN["cip"],
        'city':returnCitySN["cname"]
        } ,   
    });
}
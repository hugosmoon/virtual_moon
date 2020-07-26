

// let username=''
// let password=''
// if($.cookie('username')&&$.cookie('password')){
//     username=$.cookie('username')
//     password=$.cookie('password')
// }
console.log("验证管理员")


$.ajax({
    

    type: 'POST',

    url: "/vmm/admin_verification/" ,

    data: {
    'username':username    
    } ,
    success: function(data){
        // alert(data)
        if(data=="False"){
            alert("请用管理员账号登录")
            document.write("<form action='/vmm/login/' method=post name=form1 style='display:none'>");  
            document.write("<input type=hidden name='url' value='"+window.location.pathname+"'/>"); 
            document.write("</form>");  
            document.form1.submit();
        }
    } ,

});
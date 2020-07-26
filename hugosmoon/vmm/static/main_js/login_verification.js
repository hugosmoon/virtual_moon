

let username=''
let password=''
if($.cookie('username')&&$.cookie('password')){
    username=$.cookie('username')
    password=$.cookie('password')
}
console.log("登录验证成功")


$.ajax({

    type: 'POST',

    url: "/vmm/login_verification/" ,

    data: {
    'username':username,
    'password':password
    } ,

    success: function(data){
        if(data=="False"){
            // alert("您还没有登录")
            document.write("<form action='/vmm/login/' method=post name=form1 style='display:none'>");  
            document.write("<input type=hidden name='url' value='"+window.location.pathname+"'/>"); 
            document.write("</form>");  
            document.form1.submit();
        }
    } ,

});
var explorer =navigator.userAgent ;
//ie
if(explorer.indexOf("Firefox")<0&&explorer.indexOf("Chrome")<0&&explorer.indexOf("Safari")<0&&explorer.indexOf("Opera")) {
    window.location.href="/vmm/view_exception/"
}
else{
    console.log("浏览器版本正常")
}
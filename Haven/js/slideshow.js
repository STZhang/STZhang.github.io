
$(document).ready(function(){
	$("#enter").click(function(){
		 //window.location.href = "http://hadonghoon.cn/bbs/forum.php";
		 window.location.href = "./index2.html";
	});
	$("#enter").each (function (dom)
    {
        dom.ontouchstart = function()
        {
            window.location.href = "./index2.html";
        }
    });
});
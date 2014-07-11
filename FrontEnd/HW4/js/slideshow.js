
$(document).ready(function(){
	//get json
	$.ajax({
		//请求方式为get
		type: "get",
		//json文件位置
		url: "./data/news.json",
		//返回数据格式为jsonp
		dataType: "json",
		//请求成功完成后要执行的方法
		success: function(data) {
			//使用$.each方法遍历返回的数据date,插入到id为#result中
			$.each(data, function(i, item) {
				i = i + 1;
				$(".slideshow").append($("<li><span>"+ i +"</span><div><h5>" + item.content + "</h5><h3>" + item.title + "</h3></div></li>"));
			})
		}
	});
	$("#enter").click(function(){
		$(".slideshow").hide();
		$(".container").hide();
	});


});

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
			//使用$.each方法遍历返回的数据
			$.each(data, function(i, item) {
				i = i + 1;
				$(".slideshow").append($("<li><span style='background-image:url("+ item.imageSrc +")'>"+ i +"</span><div><h5>" + item.content + "</h5><h3>" + item.title + "</h3></div></li>"));
			})

		}
	});
	$("#enter").click(function(){
		$(".slideshow").hide();
		$(".container").hide();
		$("#header").fadeIn();
		$("#content").fadeIn();
		$("#comment").fadeIn();	
		$(".comments-item").hide();
		var last = localStorage.LastView;
		$.ajax({
			//请求方式为get
			type: "get",
			//json文件位置
			url: "./data/news.json",
			//返回数据格式为jsonp
			dataType: "json",
			//请求成功完成后要执行的方法
			success: function(data) {
				//使用$.each方法遍历返回的数据
				$.each(data, function(i, item) {
					i = i + 1;
					$("#content").append("<div class='slide-item'><img src='" + item.imageSrc + "'style='width:600px;'><div class='description'><p class='title'>" + item.title + "</p><p class='words'>" + item.content + "</p></div>");
				})
				$('#content').slide({currentIndex:last});
			}
		});		
		$.ajax({
			//请求方式为get
			type: "get",
			//json文件位置
			url: "./data/comments.json",
			//返回数据格式为jsonp
			dataType: "json",
			//请求成功完成后要执行的方法
			success: function(data) {
				//使用$.each方法遍历返回的数据
				$.each(data, function(i, item) {
					i = i + 1;
					if(i == 1){
						$.each(item.comments, function(i, item){
							i = i + 1;						
							$(".comments-item").append("<li><div class='comments-part comments-username'><img src = '" + item.userimage + "'><div>" + item.user + "</div></div><div class='comments-part comments-content'>" + item.content + "</div></li>");
						})
					}
				})
			}
		});		
	});
});
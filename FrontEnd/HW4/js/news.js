$(document).ready(function(){
	$("#view").click(function(){
		$(".comments-item").toggle();
		$("#footer").toggle();
	});	

	$("#pre").click(function(){		
		if(parseInt(localStorage.page) > 1){
			var currentpage = parseInt(localStorage.page) - 1;
			$('.comments-item li').each(function(){
			    $(this).remove();
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
						if(i == currentpage){
							localStorage.page = i;
							$.each(item.comments, function(i, item){
								i = i + 1;						
								$(".comments-item").append("<li><div class='comments-part comments-username'><img src = '" + item.userimage + "'><div>" + item.user + "</div></div><div class='comments-part comments-content'>" + item.content + "</div></li>");
							})
						}
					})
				}
			});	
		}	
	});
	$("#next").click(function(){		
		if(parseInt(localStorage.page) < 2)
		{
			var currentpage = parseInt(localStorage.page) + 1;
			$('.comments-item li').each(function(){
			    $(this).remove();
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
						if(i == currentpage){
							localStorage.page = i;
							$.each(item.comments, function(i, item){
								i = i + 1;						
								$(".comments-item").append("<li><div class='comments-part comments-username'><img src = '" + item.userimage + "'><div>" + item.user + "</div></div><div class='comments-part comments-content'>" + item.content + "</div></li>");
							})
						}
					})
				}
			});	
		}	
	});	
});
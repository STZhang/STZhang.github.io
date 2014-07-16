window.onload = function () {
	var audio = document.getElementById("BGMusic"); 
	audio.play();
	$("#startButton").click(function(){
		var img_src = "./images/board.png";
		$("body").css("background-image", "url("+img_src+")");
		$("body").css("background-repeat", "no-repeat");
		$("body").css("background-position", "center");
		$("header").show();
		$("#wrapper").show();
		$("#init").hide();
		$("#BGMusic").src = "./music/BGMusic01.mp3";
		document.getElementById("board").style.display = "block";
		app.init("board", true);
	});
};
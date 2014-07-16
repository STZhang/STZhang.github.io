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
		$("#BGMusic").remove();
		var audio_node = document.createElement("audio");
		audio_node.setAttribute("src","./music/BGMusic01.mp3");
		audio_node.setAttribute("id","BGMusic");
		audio_node.setAttribute("loop","loop");
		document.body.appendChild(audio_node);
		var audio = document.getElementById("BGMusic"); 
		audio.play();
		document.getElementById("board").style.display = "block";
		app.init("board", true);
	});
	$("#helpButton").click(function(){
		$(".info").fadeIn();
		$("#button").hide();
	});	
	$("#returnButton").click(function(){
		$(".info").hide();
		$("#button").fadeIn();
	});		
};
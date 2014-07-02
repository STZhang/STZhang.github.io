$(document).ready(function(){
	$('#enterbutton').click(function(){
		$('#startimg').hide();
		$('#enterbutton').hide();
		$('#header').fadeIn();
		$('#about').hide();
		$('#blog').hide();
		$('#content').fadeIn();
		$('#footer').fadeIn();
		$('#blogcontentfull').hide();
		var img_src = "./img/bg.jpeg";
		$("body").css("background-image", "url("+img_src+")");
	});
	$('#homepagebutton').click(function(){
		$('#home').fadeIn();
		$('#about').hide();
		$('#blog').hide();	
		var img_src = "./img/bg.jpeg";
		$("body").css("background-image", "url("+img_src+")");	
	});
	$('#aboutmebutton').click(function(){
		$('#about').fadeIn();
		$('#home').hide();
		$('#blog').hide();
		var img_src = "./img/bg.jpeg";
		$("body").css("background-image", "url("+img_src+")");

	});
	$('#blogbutton').click(function(){
		$('#blog').fadeIn();
		$('#blogcontentfull').hide();
		$('#about').hide();
		$('#home').hide();
		var img_src = "./img/bg.jpeg";
		$("body").css("background-image", "url("+img_src+")");
	});
	$('#blogbutton').click(function(){
		$('#blog').fadeIn();
		$('#blogcontentpart').show();
		$('#blogcontentfull').hide();
		$('#about').hide();
		$('#home').hide();
		var img_src = "./img/bg.jpeg";
		$("body").css("background-image", "url("+img_src+")");
	});	
	$('.qianduanrizhi').click(function(){
		$('#blog').fadeIn();
		$('#about').hide();
		$('#home').hide();
		$('#blogcontentfull').show();
		$('#blogcontentpart').hide();
		var img_src = "./img/bgnull.png";
		$("body").css("background-image", "url("+img_src+")");
	});	
	$('.watchmore').click(function(){
		$('#blogcontentfull').fadeIn();
		$('#blogcontentpart').hide();
		var img_src = "./img/bgnull.png";
		$("body").css("background-image", "url("+img_src+")");
	});
	$('.return').click(function(){
		$('#blog').fadeIn();
		$('#blogcontentpart').show();
		$('#blogcontentfull').hide();
		$('#about').hide();
		$('#home').hide();
		var img_src = "./img/bg.jpeg";
		$("body").css("background-image", "url("+img_src+")");
	});	
});
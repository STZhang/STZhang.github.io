

$.fn.slide = function(options){
	var defaults = {     
	    currentIndex: 0,
	    direction: "right",
	    width: 2000,
	    num: 6,
  	};    

  	var t;
  	var opts = $.extend(defaults, options);  
	item = $('.slide-item');

	function update(){
		$.each(item, function(index, li){
			mleft = (index - opts.currentIndex) * opts.width;
			$('.slide-item:eq(' + index + ')').animate({left:mleft}, 500);
			// if (mleft != 0) {
			// 	$('.slide-item:eq(' + index + ')').hide();
			// }else{
			// 	$('.slide-item:eq(' + index + ')').show();
			// };
		});
		$('.pagination li a').removeClass('active');
		$('.pagination li a:eq(' + opts.currentIndex + ')').addClass('active');
	}

	$('.next').click(function(){
		opts.currentIndex++;
		opts.currentIndex = opts.currentIndex % opts.num;
		update();
	})

	$('.previous').click(function(){
		opts.currentIndex--;
		opts.currentIndex = (opts.currentIndex + opts.num) % opts.num;
		update();
	})

	$('.play').click(function(){
		$(this).hide();
		$('.stop').show();
		t = setInterval(function(){
			opts.currentIndex++;
			opts.currentIndex = opts.currentIndex % opts.num;
			update();
		},2000);
	})	

	$('.stop').click(function(){
		$(this).hide();
		$('.play').show();
		clearInterval(t);
	})

	$('.pagination li a').click(function(){
		opts.currentIndex = $(this).text() - 1;
		update();
	})

	update();
}
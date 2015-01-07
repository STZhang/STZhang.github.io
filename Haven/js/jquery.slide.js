

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
		});
		$('.pagination li a').removeClass('active');
		$('.pagination li a:eq(' + opts.currentIndex + ')').addClass('active');
	}

	$('.next').click(function(){
		opts.currentIndex++;
		opts.currentIndex = opts.currentIndex % opts.num;
		localStorage.LastView = opts.currentIndex;
		update();
	})

	$('.previous').click(function(){
		opts.currentIndex--;
		opts.currentIndex = (opts.currentIndex + opts.num) % opts.num;
		localStorage.LastView = opts.currentIndex;
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
		localStorage.LastView = opts.currentIndex;
		update();
	})

	update();
}
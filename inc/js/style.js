$(document).ready(function () {
	if($('.class_wrap').length > 0){
		$('.btn_top, .btn_kach, .btn_ytb, .btn_mango').addClass('lock');
	}
	/* gnb menu */
	$('#gnb > li a').mouseover(function(){
		$(this).next('.gnb_sub').stop().show();
    });
	$('#gnb > li').on('mouseleave', function(){
		$(this).children('.gnb_sub').stop().hide();
    });
	$('#gnb > li a').on('click',  function(){
		// $(this).next('.gnb_sub').stop().toggle();
		$(this).next('.gnb_sub').stop().show();
    });


	$('.btn_all_menu').on('click', function(){
		$(this).toggleClass('on');
		$('body').toggleClass('lock');
		$('.site_map_wrap').stop(true,true).slideToggle();
    });

	$('.end_mask').on('click', function(){
		$('.btn_all_menu').trigger('click');
    });


	$('.faq_list > li > a').click(function(){
		var checkElement = $(this).next();	
		if((checkElement.is('.answer')) && (checkElement.is(':visible'))) {	
			$('.answer:visible').slideUp('fast');
			$('.faq_list > li').removeClass('on');
		}
		if((checkElement.is('.answer')) && (!checkElement.is(':visible'))) {
			$('.answer:visible').slideUp('fast');
			checkElement.slideDown('fast');
			$('.faq_list > li').removeClass('on');
			$(this).parent().addClass('on');	
		}
    });
	
	$('.center_box #searchKeyword').focus(function(){
		$(this).attr('placeholder','');
	});

	$('.down_box > a.btn_toggle').click(function(){
		$(this).toggleClass('on');
		$(this).next('.down_list_wrap').toggleClass('on');
    });

	$('.family_site > a').click(function(){
		$(this).toggleClass('on');
		$(this).next('.family_list').stop().slideToggle();
    });

	$('.util_menu > li > a').mouseover(function(){
		$('.util_menu > li > .util_sub').hide();
		$(this).next('.util_sub').show();
    });
	$('.util_menu > li > .util_sub').mouseleave(function(){
		$(this).hide();
    });

	/* 문법예문검색 개발 방식으로 인하여 수정
	$('.check_data_wrap a').on('click', function(){
		$('.check_data_wrap a').removeClass('on');
		$(this).addClass('on');
		if($(this).hasClass('tg')){
			$(this).toggleClass('show');
		}
    });
	*/

	$('.breadcrumb .bs_list li .depth li.on a').on('click', function(e){
		e.preventDefault();
		if($(this).hasClass('show')){
			$(this).removeClass('show');	
			$(this).parent('li').siblings().stop().hide();	
		}else{
			$(this).addClass('show');	
			$(this).parent('li').parent('ul').children().stop().show();	
		}
		
    });
	

	$('.dim, .pop_close').click(function(){
		$('.pop').fadeOut();
		$('.dim').fadeOut();
	});


	$('.buy_box .btn_buy').click(function(){
		$(this).next('.buy_list').fadeIn();
	});
	$('.buy_box').mouseleave(function(){
		$('.buy_list').hide();
	});

	
	/*
	if($('.fix_bar').length > 0){
		$('.fix_bar').addClass('fix');
		
	}*/

	$('.eq_tab li a').each(function(i){
		$(this).click(function(event){
			$('ul.eq_tab li').removeClass('on');
			$(this).parent().addClass('on');
			var $section = $('div.tab_con_wrap').find('.tab_con');
			$section.each(function(){
				$(this).hide();
				$section.eq(i).show();
			});
		});
	});


	$(window).scroll(function(){
		if($('.left_fixed').length > 0){
			if($("#content").is(".detail_top") === true) {
				if($(this).scrollTop() >= $('.detail_top').offset().top ){
					$('.left_fixed').addClass('on');
				}else{
					$('.left_fixed').removeClass('on');
				}	
			}
			if($("#content").is(".smart_class") === true) {
				if($(this).scrollTop() >= $('.class_top').offset().top ){
					$('.left_fixed').addClass('on');
				}else{
					$('.left_fixed').removeClass('on');
				}
			}
		}
		if($('.step_box').length > 0 ) {
			if($(this).scrollTop() >= $('.step_box').offset().top - 149 ){
				$('.left_fixed').addClass('on2');
			}else{
				$('.left_fixed').removeClass('on2');
			}	
		}
		if($('.detail_page').length > 0 ) {
			if($(this).scrollTop() >= $('.detail_top').offset().top - 149 ){
				$('.left_fixed').addClass('on2');
			}else{
				$('.left_fixed').removeClass('on2');
			}	
		}
		if($('.header').length > 0 ) {
			if($(window).scrollTop() > 10 ){
				$('.wrap').addClass('fixed');
			}else{
				$('.wrap').removeClass('fixed');
			}	
		}
	});

	$('a.btn_top').click(function () {
		$('html,body').stop().animate({'scrollTop' : 0});
	});
});


function openPop(popName){
	$('.pop').hide();
	$('.dim').fadeIn();
	$('.pop_' + popName).fadeIn();
}

function scrollMove(targetName){
	var t_pos = $('#' + targetName).offset().top;
	var isLineBanner = $('#lineBanner').is(":visible");
	if(isLineBanner){
		$('html,body').stop().animate({'scrollTop' : t_pos - 140})
	}else{
		$('html,body').stop().animate({'scrollTop' : t_pos - 100});
	}
}

$(document).ready(function () {
if($('.input_date').length > 0){
	$(".input_date").datepicker();
	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd',
		prevText: '이전 달',
		nextText: '다음 달',
		closeText: '닫기',
		currentText: '오늘',
		monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		dayNames: ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		showMonthAfterYear: true,
		yearSuffix: '년',
		showButtonPanel: true,
	});
}

});

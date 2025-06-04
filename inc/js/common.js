var is_Resized;
var is_Resized_cnt = 0;

/* 이미지 팝업 auto_resiaing */
function win_resize(){
        $(document).attr("overflow-x","hidden");
        $(document).attr("overflow-y","auto");

        var wrapWidth = $("body").outerWidth();
        var wrapHeight = $("body").outerHeight();
        
        var w1 = $(window).width();
        var h1 = $(window).height();

		try {
			// 크롬의 문제로 W, H 값을 따로 설정
			// window.resizeBy(wrapWidth - w1, wrapHeight-h1);
			window.resizeBy(wrapWidth- w1, 0);
			window.resizeBy(0, wrapHeight - h1);
			//창 크기 자동 조절 E

			if ($(window).height() != $("#Ne_Popw").outerHeight()) {
				is_Resized = setTimeout(function(){win_resize()}, 200);
									is_Resized_cnt++;
									if (is_Resized_cnt >= 3) {
											  clearTimeout(is_Resized);
									}
			}
		}
		catch (e) {
		}
}
/*
$(function(){
	// GNB
	$(function(){
	  $('.nav>li>a').click(function(){
		  $('.nav>li').removeClass('on');
		  if ($(this).hasClass('2nd') == false)
		  {
			  $(this).parent('li').addClass('on');
		  }
		  $('.nav>li .wrapper-nav-lower').hide();
		  $(this).next('.wrapper-nav-lower').slideDown(300);
		  $(".wrapper-index-searching").slideUp(300);
	  });
	   $('.btn-nav-lower-close').click(function(){
		  $(this).parent().parent('.wrapper-nav-lower').slideUp(300);
		  $('.nav>li').removeClass('on');			
	  });
	  $('.btn-login-show').click(function(){
		  $('.wrapper-login').addClass('fadeInRight');
		  $(this).hide();
	  });
	});
	//로그인 input
	$( "#login_id" ).focus(function() {
		  $(".label-login-id").hide();
	});
	$( "#login_id" ).focusout(function() {
		var txt = $("#login_id").val();
		if (txt == "")
			{
			$(".label-login-id").show();
		};
	});
	$( "#login_pw" ).focus(function() {
		  $(".label-login-pw" ).hide();
		});
	$( "#login_pw" ).focusout(function() {
		var txt = $("#login_pw").val();
		if (txt == "")
			{
			$(".label-login-pw" ).show();
		};
	});

	// MAP
	$("body").append("<div id='dimLayer'></div>");
			
	$("#dimLayer").click(function(){
		$(this).hide();
		$("#wrapper-map").hide();
		$("body").css("overflow","auto");
		//$("body").unbind("mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll");
	});

	$(".btn-map-close").click(function(){
		$("#dimLayer").hide();
		$("#wrapper-map").hide();
		$("body").css("overflow","auto");
		//$("body").unbind("mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll");
	});

	$("a.btn-map").click(function(){
		$(".wrapper-index-searching").slideUp(300);
		$(".wrapper-nav-lower").slideUp(300);
		$(".nav>li").removeClass("on");		
		$("#dimLayer").show();
		$("#wrapper-map").show();
		$("body").css("overflow","hidden");
		//$("body").css({'position':'fixed',  'top': -offsetY + 'px'});
		//$("body").bind("mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll", function(e) {
        //e.preventDefault();
	    //});

		return false;
	});
	
	// 통합검색
	$( "#txt_search" ).focus(function() {
		  $(".label-search" ).hide();
		});
	$( "#txt_search" ).focusout(function() {
		var txt = $("#txt_search").val();
		if (txt == "")
			{
			$(".label-search" ).show();
		};
	});

	// GNB 교재 표지
	$(".books .nav-lower-list a").mouseover(function(){
		$(".books-img.nav-lower-img img").attr("src",$(this).attr("href")).attr("alt",$(this).text());
	}).click(function(){
		return false;
	});

	// Main banner
	var numberOfbanner = $('.main-banner li').length;
	if( numberOfbanner > 1 ) {
		$('.main-banner').bxSlider({
		  auto: true,
		  autoControls: true
		});
	}

	// event banner
	var numberOfebanner = $('.event-banner li').length;
	if( numberOfebanner > 1 ) {
		$('.event-banner').bxSlider({
		  auto: true,
		  autoControls: true
		});
	}

		// Notice slide
		$('.notice-list').bxSlider({
		  mode: 'vertical',
		  slideMargin: 1
		});

		//교과서 찾기, 자료찾기  input
		$( "#search_textbook" ).focus(function() {
			  $(".textbook-search .label-search2").hide();
			});
		$( "#search_textbook" ).focusout(function() {
			var txt = $("#search_textbook").val();
			if (txt == "")
				{
				$(".textbook-search .label-search2").show();
			};
		});

		$( "#search_data" ).focus(function() {
			  $(".data-search .label-search2").hide();
			});
		$( "#search_data" ).focusout(function() {
			var txt = $("#search_data").val();
			if (txt == "")
				{
				$(".data-search .label-search2").show();
			};
		});

		// 검색결과 교재 표지
		$(".searching-list a").mouseover(function(){
			$(".searching-img img").attr("src",$(this).attr("href")).attr("alt",$(this).text());
			$(".searching-img .searching-book-tit").text($(this).children(".book-tit").text());
			$(".searching-img .searching-book-author").text($(this).children(".book-author").text());
		}).click(function(){
			return false;
		});

		//checkBox
		 $(".wrapper-checkbox label").click(function(){
			 if ($(this).hasClass("on"))
			 {
				$(this).removeClass("on");
				$(this).parent().parent().parent().removeClass("on");
				$(this).prev("input").prop("checked",false) ;

			 } else {
				 $(this).addClass("on");
				 $(this).parent().parent().parent().addClass("on");
				 $(this).prev("input").prop("checked", true) ;
			 }
				return false;			
		  });

		 // select box list
		  $(document).mouseup(function(e){
			var selList = $(".selectbox-list"),
			navList = $(".sub-nav-list");

			if (selList.has(e.target).length === 0)
			{
				selList.slideUp();
			}

			if (navList.has(e.target).length === 0)
			{
				navList.slideUp();
			}
		});

		// serching data close
		  $(document).mouseup(function(e){
			var searchist = $(".wrapper-index-searching");

			if (searchist.has(e.target).length === 0)
			{
				searchist.slideUp();
			}
		});

		// serching data close
		  $(document).mouseup(function(e){
			var searchist = $(".family_list");

			if (searchist.has(e.target).length === 0)
			{
				searchist.slideUp();
			}
		});

});
*/
	


function actLogin() {

	var pForm = document.loginForm;
	if(pForm.userid.value == "") {
		alert("아이디를 입력하세요.");
		pForm.userid.focus();
		return;
	}
	if(pForm.passwd.value == "") {
		alert("비밀번호를 입력하세요.");
		pForm.passwd.focus();
		return;
	}

	pForm.submit();
}


function isNumber(data) {
	for (var i = 0; i < data.length ; i++) {
		ch = data.charAt(i);
		if (!(ch >= '0' && ch <= '9')) {
			return false;
		}
	}
	return true;
}

function file_upload(serverUrl, types, savepath, formname, textname){
	var addUrlInfo = '?sslmode=1&serverUrl=' + serverUrl + '&types=' + types + '&savepath=' + savepath + '&formname=' + formname + '&textname=' + textname;
	var newwin = window.open('https://upfile.neungyule.com/pages/common/ne_upload_utf8.asp' + addUrlInfo, 'uploadFrm', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=no,width=420,height=300,top=400,left=400');
	newwin.focus();
}

//로그아웃
function fn_logout(){
	if (confirm('로그아웃 하시겠습니까?')) {
		document.logOutForm.submit();
	}
}

// iframe resize
function autoResize(obj)
{
    var iframeHeight = (obj).contentWindow.document.body.scrollHeight;
    (obj).height=iframeHeight;
}



function autoResize2(obj)
{
    var iframeHeight = document.getElementById(obj).scrollHeight;
    obj.height=iframeHeight;
}


//파일다운로드 확장자 체크
function fnc_filExtension(fileUrl){
	if (fileUrl.indexOf(".pdf") > 0){
		return false;
	}else if (fileUrl.indexOf(".hwp") > 0){
		return false;
	}else if (fileUrl.indexOf(".jpg") > 0){
		return false;
	}else if (fileUrl.indexOf(".gif") > 0){
		return false;
	}else if (fileUrl.indexOf(".png") > 0){
		return false;
	}else if (fileUrl.indexOf(".bmp") > 0){
		return false;
	}else{
		return true;
	}
}

//중국어/일본어 교과서 메뉴 준비중 처리
function fnc_prepare(){
	alert("2015 개정 교육과정 교과서와 수업 자료를 준비 중에 있습니다.\n교과서에 상관없이 수업 시간에 바로 사용하실 수 있는 자료는\n'플러스 자료' 에서 확인하실 수 있습니다. 많은 이용 부탁드립니다.");
	return;
}

//조회수 업데이트
function fnc_ReadCntUpdate(BOARDMASTERSEQ_, boardseq_){
	$.ajax({
		type : "POST", 
		url : "/pages/common/ajax_ReadCntUpdate.asp",
		data : {BOARDMASTERSEQ:BOARDMASTERSEQ_, boardseq:boardseq_}, 
		datatype : "json",
		error : function() {
			alert("error");
		},
		success : function(data) {
		}			
	});
}

function formatnumber(num)
{
	num	=	num.toString();
	var strLen	=	num.length;
	var retVal	=	"";

	for(var i = 0; i < strLen; i++)
	{
		if(((strLen - i) % 3 == 0) && i > 0)
			retVal	=	retVal + "," + num.substring(i, i + 1);
		else
			retVal	+=	num.substring(i, i + 1);
	}

	return retVal;
}

//E-Book 바로가기
function popEbookUrl(strUrl){
	$.ajax({
		type : "GET", 
		url : "/pages/common/getenctime.asp?_v="+Math.random() ,
		datatype : "TEXT",
		error : function(request, status, error) {
			alert("데이터 연결에 실패하였습니다.");
		},
		success : function(ret) {
		   window.open(strUrl+"?authcode="+ret);
		}			
	});
 }

// 학생추가
function popSearchStd_new(){
		 var sizeX = 820;
		 var sizeY = 900;
		 var popSearchStd = window.open(
				"/pages/class/pop/popSearchStd.asp",
				"yWin",
				"left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=yes, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
		 );
	}

// 검색으로 교재추가 팝업 창 띄우기
function popSearchBooks_new(){
	 var sizeX = 820;
	 var sizeY = 950;
	 var popSearchBooks = window.open(
			"/pages/class/pop/popSearchBooks.asp",
			"bWin",
			"left=100, top=100, width="+ sizeX + ", height="+ sizeY + ", scrollbars=yes, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}

// 교재맵으로 교재추가 팝업 
function popSearchBooksMap_New(){
	var sizeX = screen.availWidth;
	var sizeY = screen.availHeight;
	sizeX = (sizeX-(sizeX*0.2));
	sizeY = (sizeY-65);
   var popSearchBooksMap = window.open(
		   "/pages/class/pop/popSearchBooksMap.asp",
		   "mWin",
		   "left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=yes, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}


 //비밀번호 변경 팝업 창 띄우기

function fnc_popChangePw(userseq){
	var sizeX = 820;
	var sizeY = 800;

	var popChangePw = window.open(
		"/pages/class/pop/popChangePw.asp?userseq="+userseq,
		"",
		"left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=no, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}

function popChangePw(flag){
	 var sizeX = 820;
	 var sizeY = 800;
	 //sizeY = (sizeY-38);
	 //sizeX = (sizeX-18);
	var popChangePw = window.open(
			"/pages/class/pop/popChangePw.asp?flag="+flag,
			"",
			"left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=no, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}
        

//아이디 중복확인 팝업 창 띄우기
function popCheckId(){
	 var sizeX = 580;
	 var sizeY = 320;
	 var popCheckId = window.open(
			"/pages/class/pop/popCheckId.asp",
			"",
			"left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=no, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}


//아이디 중복확인 팝업 창 띄우기
function popCheckIdResult(){
	 var sizeX = 580;
	 var sizeY = 280;
	 var popCheckIdResult = window.open(
			"/class/html/pop/popCheckId_result.asp",
			"",
			"left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=no, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}

// 빈값 체크
function isEmpty(data) {
	for ( var i = 0 ; i < data.length ; i++ ) {
		if ( data.substring( i, i+1 ) != " " )
			return false;
	}
	return true;
}

function fnc_chkpwdForce(pwdtxt) {
//		var year = "1999";
//		var date = "0508";

		var numberConut = 0;
		var textConut = 0;
		var specialConut = 0;
//		var yearFlag = false;
//		var dateFlag = false;

		var textRegular = /[a-zA-Z]+/;
		var numberRegular = /[0-9]+/;
		var specialRegular = /[!@#$%^&*?_~]/;

		if (textRegular.test(pwdtxt)) textConut = 1;
		if (numberRegular.test(pwdtxt)) numberConut = 1;
		if (specialRegular.test(pwdtxt)) specialConut = 1;
//		if (password.indexOf(year) > -1 ) yearFlag = true;
//		if (password.indexOf(date) > -1 ) dateFlag = true;
		var isPW = /^[a-zA-Z0-9!@#$%^&*?_~]{8,12}$/;
		if( !isPW.test(pwdtxt) ) {
			alert("비밀번호는 8~12자리의 영문/숫자/특수문자 중 3가지 조합으로 입력해주세요.\r\n특수문자는 !,@,#,$,%,^,&,*,?,_,~만 사용 가능합니다.");
			return false;
		}

		var samCount = 0;
		var continuCount = 0;
		for(var i=0; i < pwdtxt.length; i++) {
			var forSamCount = 0;
			var forContinuCount = 0;
			var char1 = pwdtxt.charAt(i);
			var char2 = pwdtxt.charAt(i+1);
			var char3 = pwdtxt.charAt(i+2);
			var char4 = pwdtxt.charAt(i+3);

			if(!char4) {
				break;
			}
			//동일문자 카운트
			if(char1 == char2) {
				forSamCount = 2;
				if(char1 == char3) {
					forSamCount = 3;
					if(char1 == char4){
						forSamCount = 4;
					}
				}
			}


			if(forSamCount == 4) {
				samCount = 1;
			}


			//4개이상
			if(char1.charCodeAt(0) - char2.charCodeAt(0) == 1 && char2.charCodeAt(0) - char3.charCodeAt(0) == 1 && char3.charCodeAt(0) - char4.charCodeAt(0) == 1) {
				samCount = 1;
			} else if(char1.charCodeAt(0) - char2.charCodeAt(0) == -1 && char2.charCodeAt(0) - char3.charCodeAt(0) == -1 && char3.charCodeAt(0) - char4.charCodeAt(0) == -1) {
				samCount = 1;
			}
/*
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == -1 && char2.charCodeAt(0) - char3.charCodeAt(0) == -1 && char3.charCodeAt(0) - char4.charCodeAt(0) == -1) {
				forContinuCount = 3;
			}
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == 1 && char2.charCodeAt(0) - char3.charCodeAt(0) == 1) {
				forContinuCount = 3;
			}
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == -1 && char2.charCodeAt(0) - char3.charCodeAt(0) == -1) {
				forContinuCount = 3;
			}
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == 1) {
				forContinuCount = 2;
			}
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == -1) {
				forContinuCount = 2;
			}

			if(forContinuCount > continuCount) {
				continuCount = forContinuCount;
			}
*/

		}

		if (pwdtxt.length < 8 || pwdtxt.length > 12) {
			alert("비밀번호는 8~12자리의 영문/숫자/특수문자 중 3가지 조합으로 입력해주세요.\r\n특수문자는 !,@,#,$,%,^,&,*,?,_,~만 사용 가능합니다.");
			return false;
		}else if (samCount >= 1) {
			alert('연속 같은 문자가 있습니다.\r\n중복 및 연속 문자 4자리 이상 사용 불가입니다.\r\n영문/숫자/특수문자 중 3가지를  조합해서 비밀번호를 입력하세요.');
			return false;
//		} else if (continuCount >= 1) {
//			alert('연속 문자가 있습니다.');
//			return false;
		} else if (textConut + numberConut + specialConut <= 2) {
			alert('비밀번호는 8~12자리의 영문/숫자/특수문자 중 3가지 조합으로 입력해주세요.\r\n특수문자는 !,@,#,$,%,^,&,*,?,_,~만 사용 가능합니다.');
			return false;
		}

		return true;

}


function fnc_chkpwdForceStud(pwdtxt) {
		var numberConut = 0;
		var textConut = 0;
		var specialConut = 0;
//		var yearFlag = false;
//		var dateFlag = false;

		var textRegular = /[a-zA-Z]+/;
		var numberRegular = /[0-9]+/;
//		var specialRegular = /[!@#$%^&*?_~]/;

		if (textRegular.test(pwdtxt)) textConut = 1;
		if (numberRegular.test(pwdtxt)) numberConut = 1;
//		if (specialRegular.test(pwdtxt)) specialConut = 1;
//		if (password.indexOf(year) > -1 ) yearFlag = true;
//		if (password.indexOf(date) > -1 ) dateFlag = true;
		var isPW = /^[a-zA-Z0-9]{4,8}$/;
		if( !isPW.test(pwdtxt) ) {
			alert("비밀번호는 4~8자리의 영문, 숫자 2가지 조합으로 입력해주세요.");
			return false;
		}

		var samCount = 0;
		var continuCount = 0;
		for(var i=0; i < pwdtxt.length; i++) {
			var forSamCount = 0;
			var forContinuCount = 0;
			var char1 = pwdtxt.charAt(i);
			var char2 = pwdtxt.charAt(i+1);
			var char3 = pwdtxt.charAt(i+2);

			if(!char3) {
				break;
			}
			//동일문자 카운트
			if(char1 == char2) {
				forSamCount = 2;
				if(char1 == char3) {
					forSamCount = 3;					
				}
			}

			if(forSamCount == 3) {
				samCount = 1;
			}


			//4개이상
			if(char1.charCodeAt(0) - char2.charCodeAt(0) == 1 && char2.charCodeAt(0) - char3.charCodeAt(0) == 1) {
				samCount = 1;
			} else if(char1.charCodeAt(0) - char2.charCodeAt(0) == -1 && char2.charCodeAt(0) - char3.charCodeAt(0) == -1) {
				samCount = 1;
			}
/*
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == -1 && char2.charCodeAt(0) - char3.charCodeAt(0) == -1 && char3.charCodeAt(0) - char4.charCodeAt(0) == -1) {
				forContinuCount = 3;
			}
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == 1 && char2.charCodeAt(0) - char3.charCodeAt(0) == 1) {
				forContinuCount = 3;
			}
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == -1 && char2.charCodeAt(0) - char3.charCodeAt(0) == -1) {
				forContinuCount = 3;
			}
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == 1) {
				forContinuCount = 2;
			}
			else if(char1.charCodeAt(0) - char2.charCodeAt(0) == -1) {
				forContinuCount = 2;
			}

			if(forContinuCount > continuCount) {
				continuCount = forContinuCount;
			}
*/

		}

		if (pwdtxt.length < 4 || pwdtxt.length > 8) {
			alert("비밀번호는 4~8자리의 영문, 숫자 2가지 조합으로 입력해주세요.");
			return false;
		}else if (samCount >= 1) {
			alert('연속 같은 문자가 있습니다.\r\n중복 및 연속 문자 3자리 이상 사용 불가입니다.\r\n영문, 숫자를  조합해서 비밀번호를 입력하세요.');
			return false;
//		} else if (continuCount >= 1) {
//			alert('연속 문자가 있습니다.');
//			return false;
		} else if (textConut + numberConut < 2) {
			alert('비밀번호는 4~8자리의 영문, 숫자 2가지 조합으로 입력해주세요.');
			return false;
		}
		return true;
}


function fnc_checkID(){
	var str = document.regForm1.userid.value;
	var isID = /^[a-zA-Z0-9_]{4,12}$/;

	if( !isID.test(str) ) {
		alert("아이디는 4-12자 영문자와 숫자,특수기호(_)만 사용할 수 있습니다."); 
		document.regForm1.userid.focus();
		return false; 
	}

	return true;
}

function fnc_checkID_student(){
	var str = document.regForm1.userid.value;
	var isID = /^[a-zA-Z0-9_]{4,20}$/;

	if( !isID.test(str) ) {
		alert("아이디는 4~20자 영문자, 숫자, 특수문자 _만 사용할 수 있습니다."); 
		document.regForm1.userid.focus();
		return false; 
	}

	return true;
}


// 학습,테스트 링크 팝업 
function popSURTest(testNum,apSeq){
	var sizeX = screen.availWidth;
	var sizeY = screen.availHeight;
	sizeX = (sizeX-18);
	sizeY = (sizeY-65);
   var popLevelTest = window.open(
		   "/level_test/pages/leveltest_question.asp?qpSeq="+testNum+"&qpinum=1&apSeq="+apSeq,
		   "",
		   "left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=yes, status=no, resizable=no, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}
// 학습체험하기
function popExperienceTest(testNum,apSeq){
	var sizeX = screen.availWidth;
	var sizeY = screen.availHeight;
	sizeX = (sizeX-18);
	sizeY = (sizeY-65);
   var popLevelTest = window.open(
		   "/level_test/pages/leveltest_question.asp?qpSeq="+testNum+"&qpinum=1&apSeq="+apSeq,
		   "",
		   "left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=yes, status=no, resizable=no, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}

 // 오답 노트 링크 팝업 
function popIncorrectTest(rs_ap_seq,pseq,unitSeq,roomSeq,mid){
	var sizeX = screen.availWidth;
	var sizeY = screen.availHeight;
	sizeX = (sizeX-18);
	sizeY = (sizeY-65);
   var popLevelTest = window.open(
		  "/level_test/pages/incorrect_note.asp?apSeq="+rs_ap_seq+"&pseq="+pseq+"&unitseq="+unitSeq+"&roomseq="+roomSeq+"&m_id="+mid,
		   "",
		   "left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=yes, status=no, resizable=no, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}


// 알림장 공지 팝업 
function popNoticeAlert(rs_ap_seq,pseq,unitSeq,roomSeq,mid){
	var sizeX = 580;
	var sizeY = 660;
   var popNoticeAlert = window.open(
		   "/class/html/pop/popNoticeAlert.asp",
		   "",
		   "left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=no, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}


// 학습방
function popStdStudy_new(userseq, roomseq, bookseq, studytypes){
		if (roomseq == undefined){
			roomseq = ''
		}

		if (bookseq == undefined){
			bookseq = ''
		}

		if (studytypes == undefined){
			studytypes = ''
		}

		var sizeX = 1500;
		var sizeY = screen.availHeight;
		sizeY = (sizeY-65);
	    var popStdStudy = window.open(
			   //"/class/pages/pop/popStdStudy.asp?userseq="+userseq+'&roomseq=<%=lv_roomseq%>&bookseq=<%=lv_bookseq%>',
			   "/pages/class/pop/popStdStudy.asp?userseq="+userseq+'&roomseq='+roomseq+'&bookseq='+bookseq+'&studytypes='+studytypes+'',
			   "tWin",
			   "left=100, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=yes, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
   )}  

//학생 등록
function fnc_popStudentReg(){
	var sizeX = 820;
	var sizeY = 800;

	var popChangePw = window.open(
		"/pages/class/pop/mng_student_regist.asp",
		"",
		"left=0, top=0, width="+ sizeX + ", height="+ sizeY + ", scrollbars=no, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
)}

// 레벨테스트 결과
function goLevelReport(apSeq){
	window.open("/level_test/pages/leveltest_result.asp?apSeq="+apSeq,"_blank","width=920, height=900, menubar=no,status=yes,scrollbars=yes");

}

// 레벨테스트 결과
function goReport(apSeq){
	window.open("/pages/class/student/report.asp?apSeq="+apSeq,"_blank","width=1120, height=900, menubar=no,status=yes,scrollbars=yes");

}

// 레벨테스트 결과
function goResultReport(apSeq){
	window.open("/level_test/pages/result_report.asp?apSeq="+apSeq,"_blank","width=1120, height=900, menubar=no,status=yes,scrollbars=yes");

}

// 업로드 팝업
function popUpload_new(serverUrl, types, savepath, formname, textname){
	var sizeX = 580;
	var sizeY = 500;
	var addUrlInfo = '?serverUrl=' + serverUrl + '&types=' + types + '&savepath=' + savepath + '&formname=' + formname + '&textname=' + textname;
	var popUpload = window.open(
			"/pages/class/pop/popUpload.asp" + addUrlInfo,
			"",
			"left=100, top=100, width="+ sizeX + ", height="+ sizeY + ", scrollbars=no, status=no, resizable=yes, direction=yes, location=no, menubar=no, toolbar=no, titlebar=no"
	);
}


function btn_del_play() {
	$(".btn_del").css("display", "");
}

// 교재 단어 트레이닝 리스트
function popTrainingLogin(apSeq){
	window.open("/pages/class/pop/popLogin.asp?apSeq="+apSeq,"_blank","width=600, height=600, menubar=no,status=yes,scrollbars=yes");
}

// 교재 단어 트레이닝 리스트
function popTrainingList(b_code,userseq,islogin){
	var return_val = fnc_authCheck2('<%=GV_EPKI%>', 2, islogin);
	//alert ('<%=isLogin%>')
	if (return_val){
	window.open("/pages/class/pop/popTrainingList.asp?b_code="+b_code+"&userseq="+userseq,"_blank","width=800, height=860, menubar=no,status=yes,scrollbars=yes");
	}
}

// 교재 단어 트레이닝
function popTraining(set_idx,b_code,set_name){
	var sizeX = screen.availWidth;
	var sizeY = screen.availHeight;
	sizeX = (sizeX-18);
	sizeY = (sizeY-65);
	window.open("/pages/class/pop/popTraining.asp?set_idx="+set_idx+"&b_code="+b_code+"&set_name="+set_name,"_blank","width="+sizeX+", height="+sizeY+", menubar=no,status=yes,scrollbars=yes");
}
// 숫자만 입력
function format_input_num(obj){
	obj.value = obj.value.replace(/[^\d]/g,"");
}
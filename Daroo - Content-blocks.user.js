// ==UserScript==
// @name         Daroo - Content-blocks
// @namespace    Content-blocks
// @version      2.0
// @include      *daroo*.*/manager/*
// @description  Удобные формы для добавления основных контент-блоков, парсинг документа на META-загловки и контент-блоки
// @updateURL 	 https://openuserjs.org/meta/frantsmn/Daroo_-_Content-blocks.meta.js
// @author       Frants Mitskun
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license	 MIT
// @copyright 	 2017, frantsmn (https://openuserjs.org/users/frantsmn)
// ==/UserScript==

//GM_deleteValue("settings");

//Координаты панелек на странице
var settings = GM_getValue("settings") ? GM_getValue("settings") :
{
	offset: {
		svPanel : {top: 200, left: 350},
		pvPanel : {top: 200, left: 350},
		sePanel : {top: 200, left: 350},
		hPanel  : {top: 200, left: 350},
		dkPanel : {top: 200, left: 350},
		rezultPanel: {top: 50, left: 600}
	}
};

//ФУНКЦИЯ ОТОБРАЖАЕТ ПОЛЕ ДЛЯ ВСТАВКИ КОДА ЕСЛИ ОНО ЗАКРЫТО
function show_textarea(){
	if($("#product_block_translations_ru_contents").css('display') == 'none')
		$("a.re-icon.re-html").click();
	if($("#product_price_block_translations_ru_contents").css('display') == 'none')
		$("a.re-icon.re-html").click();
}

//ФУНКЦИЯ ВОЗВРАЩАЕТ ЯЗЫК АКТИВНОЙ ВКЛАДКИ
function activeTabLocale(str){
	var locale;
	$("ul.a2lix_translationsLocales").find("a.language-change-button").each(function(){
		if ($(this).parent().hasClass("active"))
			locale = $(this).data('locale');
	});
	if (str && str===locale)
		return true;
	if (str && str!==locale)
		return false;
	return locale;
}

//ФУНКЦИЯ ВОЗВРАЩАЕТ ТИП РЕДАКТИРУЕМОЙ СТРАНИЦЫ
function getPageType(){
	if( $('input#product__token').length )
		return "product";
	if( $('input#product_price__token').length )
		return "price";
	if( $('input#supplier__token').length )
		return "supplier";
}

//ФУНКЦИЯ ОТКРЫВАЕТ НЕОБХОДИМЫЙ КОНТЕНТ-БЛОК ВЫБИРАЕМЫЙ ИЗ ВЫПАДАЙКИ
function select_block(by, ru, ua){
	if(location.host === "daroo.by")
	{
		$("select#product_block_content").val(by).change();
		$("select#price_block_content").val(by).change();
		$("select#supplier_block_content").val(by).change();
	}
	else
		if(location.host === "daroo.ru")
		{
			$("select#product_block_content").val(ru).change();
			$("select#price_block_content").val(ru).change();
			$("select#supplier_block_content").val(ru).change();
		}
	else
		if(location.host === "daroo.ua")
		{
			$("select#product_block_content").val(ua).change();
			$("select#price_block_content").val(ua).change();
			$("select#supplier_block_content").val(ua).change();
		}
}

//СТИЛИ
$("body").append("<style>@keyframes fade-in { 0% {opacity: 0;} 100% {opacity: 0.93;} } .content-block-panel { animation: fade-in .3s ease; } .content-block-panel { height: auto; max-height: 500px; max-width: 900px; overflow: auto; background: white; position: fixed; border: solid 1px lightgray; box-shadow: 0px 0px 17px -1px rgba(0, 0, 0, 0.5); border-radius: 5px; padding: 10px; z-index: 9999 !important; opacity: 0.93; } .hideSave{ float: right; } .closePanel, .clearPanel { float: left; margin-right: 4px; } .content-block-panel .form-control { margin-bottom: 4px; } .content-block-panel textarea { padding: 10px; } </style>");

//МЕНЮ
$("ul.top-nav").prepend("<li id='content-block-menu' class='dropdown-toggle' data-toggle='dropdown'>"+
						"<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\">" +
						"Контент-блоки <span class=\"caret\"></span></a>"+
						"<ul class=\"dropdown-menu\" style=\"cursor: pointer !important;\" role=\"menu\">" +
						" <li id=\"dk-sh\"><a>Две колонки</a></li>"+
						" <li id=\"h-sh\"><a>Характеристики (шахматный)</a></li>"+
						" <li id=\"se-sh\"><a>Структура/Этапы (последовательный)</a></li>"+
						" <li id=\"pv-sh\"><a>Преимущества (буллиты)</a></li>"+
						" <li id=\"sv-sh\"><a>Сервисные возможности</a></li>"+
						"</ul></li>");

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//ДВЕ КОЛОНКИ

$("body").prepend("<div id='dkPanel' class='content-block-panel'><table><tr><td colspan='2' align='center'><input type='text' id='dkTitle' class='form-control' placeholder='Заголовок' style='width:180px; text-align:center;'></td></tr><tr><td><input type='text' id='dkSubtitle1' class='form-control' placeholder='Подзаголовок' style='width:180px;'><textarea id='dkText1' class='form-control' cols='20' rows='5' placeholder='Текст'></textarea></td><td><input type='text' id='dkSubtitle2' class='form-control' placeholder='Подзаголовок' style='width:180px;'><textarea id='dkText2' class='form-control' cols='20' rows='5' placeholder='Текст'></textarea></td></tr><tr><td colspan='2'><button class='closePanel btn btn-default'>Закрыть</button><button class='clearPanel btn btn-default'>Очистить</button><button class='hideSave btn btn-primary'>Сохранить и закрыть</button></td></tr></table></div>");
$( "#dkPanel" ).draggable();

$("#dk-sh").click(function() {
	$(".content-block-panel").hide();
	$("#dkPanel").show();
	show_textarea();
	select_block('5000246', '4000022', '268');
});

//Собираем разметку
$('#dkPanel').keyup(function(){
	var strings = [
		"<div class=\"detail-school-desc\"><h2>" + $( "input[id='dkTitle']" ).val() + "</h2><ul>",
		"<li><h3>" + $( "input[id='dkSubtitle1']" ).val() + "</h3>" + $( "textarea[id='dkText1']" ).val() + "</li>",
		"<li><h3>" + $( "input[id='dkSubtitle2']" ).val() + "</h3>" + $( "textarea[id='dkText2']" ).val() + "</li>",
		"</ul></div>"
	];
	var dkText = strings[0] + strings[1] + strings[2] + strings[3];

	if (activeTabLocale("ru")){
		$("textarea#product_block_translations_ru_contents").val(dkText);
		$("textarea#product_price_block_translations_ru_contents").val(dkText);
	}
	if (activeTabLocale("ua")){
		$("textarea#product_block_translations_ua_contents").val(dkText);
		$("textarea#product_price_block_translations_ua_contents").val(dkText);
	}
});

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//ХАРАКТЕРИСТИКИ (шахматный)

$( "body" ).prepend("<div id='hPanel' class='content-block-panel ui-draggable ui-draggable-handle'><table id='hTable' style='width:340px;'><tr><td><input type='text' class='form-control' id='hTitle' placeholder='Заголовок' style='width:200px;'></td></tr><tr class='h_right h_tr'><td align='right'><input type='text' class='form-control' style='width:200px;' id='hSubtitle' placeholder='Подзаголовок'><textarea id='hDescText' class='form-control' style='width:200px;' rows='5' placeholder='Текст'></textarea></td></tr></table><div style='position:sticky; bottom: 0px;'><button class='closePanel btn btn-default'>Закрыть</button><button class='clearPanel btn btn-default'>Очистить</button><button class='hideSave btn btn-primary'>Сохранить и закрыть</button></div></div>");
$( "#hPanel" ).draggable();
var h_right_block = "<tr class='h_right h_tr added-h-block'><td align='right'><input type='text' class='form-control' style='width:200px;' id='hSubtitle' placeholder='Подзаголовок'><textarea id='hDescText' class='form-control' style='width:200px;' rows='5' placeholder='Текст'></textarea></td></tr>";
var h_left_block = "<tr class='h_left h_tr added-h-block'><td align='left'><input type='text' class='form-control' style='width:200px;' id='hSubtitle' placeholder='Подзаголовок'><textarea id='hDescText' class='form-control' style='width:200px;' rows='5' placeholder='Текст'></textarea></td></tr>";

$("#h-sh").click(function() {
	$(".content-block-panel").hide();
	$("#hPanel").show();
	show_textarea();
	select_block('5000250', '4000026', '276');
});

//Собираем разметку
$("#hPanel").keyup(function(){

	var hText = "<div class=\"full-desc\">"; 		    //Стартовая строка
	if($(this).find("#hTitle").val() !== "")  			//Если есть заголовок, то херачим его в кучу
	{
		hText += "<div class=\"desc\"><h2>" + $( "input[id='hTitle']" ).val() + "</h2></div><ul class=\"detail-list\">";
	}
	else
	{													//Если загловка нет
		hText += "<ul class=\"detail-list\">";
	}

	$("tr.h_tr").each(function( index ){ 					//Перебираем все поля (блоки), проверям их и добавляем соответствующую разметку
		var hSubtitle = $(this).find("#hSubtitle").val(); 						//Заголовок блока
		var hDescText = $(this).find("textarea#hDescText").val();				//Текст блока

		if($(this).hasClass("h_left") && hSubtitle !== "" && hDescText !== "")
		{
			hText += "<li><div class=\"article\"><div><h3>" + hSubtitle + "</h3>" + hDescText + "</div></div><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd618120fc9.jpg\"></figure></li>";
		}
		if($(this).hasClass("h_left") && hSubtitle === "" && hDescText !== "")
		{
			hText += "<li><div class=\"article\"><div>" + hDescText + "</div></div><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd618120fc9.jpg\"></figure></li>";
		}

		if($(this).hasClass("h_right") && hSubtitle !== "" && hDescText !== "")
		{
			hText += "<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd615ccb044.jpg\"></figure><div class=\"article\"><div><h3>" + hSubtitle + "</h3>" + hDescText + "</div></div></li>";
		}
		if($(this).hasClass("h_right") && hSubtitle === "" && hDescText !== "")
		{
			hText += "<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd615ccb044.jpg\"></figure><div class=\"article\"><div>" + hDescText + "</div></div></li>";
		}
	});

	hText += "</ul></div>"; //Финальная строка

	if (activeTabLocale("ru")){
		$("textarea#product_block_translations_ru_contents").val(hText);
		$("textarea#product_price_block_translations_ru_contents").val(hText);
	}
	else
		if (activeTabLocale("ua")){
			$("textarea#product_block_translations_ua_contents").val(hText);
			$("textarea#product_price_block_translations_ua_contents").val(hText);
		}

	addBlock(); //Добавялем на всякий еще один текстовый блок
});

//Добавляет еще один текстовый блок, если последний был заполнен
function addBlock(){
	if($( "textarea[id='hDescText']" ).last().val() !== "")
	{
		if ($("tr.h_tr").last().hasClass("h_left") === true)
		{
			$("#hTable").append(h_right_block).focus();
			$("#hPanel").scrollTop($("#hTable").height());
		}
		else
			if ($(".h_tr").last().hasClass("h_right") === true)
			{
				$("#hTable").append(h_left_block);
				$("#hPanel").scrollTop($("#hTable").height());
			}
	}
}

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//СТРУКТУРА/ЭТАПЫ (последовательный)

$( "body" ).prepend("<div id='sePanel' class='content-block-panel'><table id='seTable' style='width:340px;'><tr><td><input type='text' id='seTitle' class='form-control' placeholder='Заголовок' style='width:200px;'></td></tr><tr class='se_tr'><td align='right'><input type='text' id='seSubtitle' class='form-control' style='width:200px;' placeholder='Подзаголовок'><textarea id='seDescText' class='form-control' style='width:200px;' rows='5' placeholder='Текст'></textarea></td></tr></table><div style='position:sticky; bottom: 0px;'><button class='closePanel btn btn-default'>Закрыть</button><button class='clearPanel btn btn-default'>Очистить</button><button class='hideSave btn btn-primary'>Сохранить и закрыть</button></div></div>");
$( "#sePanel" ).draggable();

var se_block = "<tr class='se_tr added-se-block'><td align='right'><input type='text' id='seSubtitle' class='form-control' style='width:200px;' placeholder='Подзаголовок'><textarea id='seDescText' class='form-control' style='width:200px;' rows='5' placeholder='Текст'></textarea></td></tr>";

$("#se-sh").click(function() {
	$(".content-block-panel").hide();
	$("#sePanel").show();
	show_textarea();
	select_block('5000252', '4000031', '274');
});

//Собираем разметку
$("#sePanel").keyup(function(){

	var seText = '<div class="full-desc full-left">'; 				//Стартовая строка
	if($(this).find("#seTitle").val() !== "")  			//Если есть заголовок
	{
		seText += '<div class="desc"><h2>' + $( "input[id='seTitle']" ).val() + '</h2></div><ul class="detail-list">';
	}
	else
	{
		seText += '<ul class="detail-list">';
	}

	$("tr.se_tr").each(function( index ){ 						//Перебираем все поля (блоки), проверям их
		var seSubtitle = $(this).find("#seSubtitle").val(); 					//Заголовок блока
		var seDescText = $(this).find("textarea#seDescText").val();				//Текст блока

		if(seSubtitle !== "" && seDescText !== "")
		{
			seText += "<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd615ccb044.jpg\"></figure><div class=\"article\"><div><h3>" + seSubtitle + "</h3>" + seDescText + "</div></div></li>";
		}
		if(seSubtitle === "" && seDescText !== "")
		{
			seText += "<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd615ccb044.jpg\"></figure><div class=\"article\"><div>" + seDescText + "</div></div></li>";
		}
	});

	seText += '</ul></div>'; //Финальная строка

	if (activeTabLocale("ru")){
		$("textarea#product_block_translations_ru_contents").val(seText);
		$("textarea#product_price_block_translations_ru_contents").val(seText);
	}else
		if (activeTabLocale("ua")){
			$("textarea#product_block_translations_ua_contents").val(seText);
			$("textarea#product_price_block_translations_ua_contents").val(seText);
		}

	addBlockSe(); //Добавялем на всякий еще один текстовый блок
});

//Добавляет еще один, если последний был заполнен
function addBlockSe(){
	if($("textarea[id='seDescText']").last().val() !== "")
	{
		$("#seTable").append(se_block);
		$("#sePanel").scrollTop($("#seTable").height());
	}
}

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//ПРЕИМУЩЕСТВА/ВОЗМОЖНОСТИ (буллиты)

$("body").prepend("<div id='pvPanel' class='content-block-panel'><table><tr><td colspan='4' align='center'><input type='text' id='pvTitle' class='form-control' placeholder='Заголовок' style='width:240px; text-align:center;'></td></tr><tr><td><input type='text' id='pvSubtitle1' class='form-control' placeholder='Подзаголовок'><textarea id='pvText1' class='form-control' rows='4' placeholder='Описание'></textarea></td><td><input type='text' id='pvSubtitle2' class='form-control' placeholder='Подзаголовок'><textarea id='pvText2' class='form-control' rows='4' placeholder='Описание'></textarea></td><td><input type='text' id='pvSubtitle3' class='form-control' placeholder='Подзаголовок'><textarea id='pvText3' class='form-control' rows='4' placeholder='Описание'></textarea></td><td><input type='text' id='pvSubtitle4' class='form-control' placeholder='Подзаголовок'><textarea id='pvText4' class='form-control' rows='4' placeholder='Описание'></textarea></td></tr></table><button class='closePanel btn btn-default'>Закрыть</button><button class='clearPanel btn btn-default'>Очистить</button><button class='hideSave btn btn-primary'>Сохранить и закрыть</button></div>");
$( "#pvPanel" ).draggable();

//Отображаем и прячем форму
$("#pv-sh").click(function() {
	$(".content-block-panel").hide();
	$("#pvPanel").show();
	show_textarea();
	select_block('5000248', '4000024', '270');
});

//Собираем разметку
$('#pvPanel').keyup(function(){

	var strings = [
		'<div class="detail-desc-features clear"><h2>'+$("input[id='pvTitle']").val()+'</h2><ul>',
		'<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg"><br></figure><h3>'+$("input[id='pvSubtitle1']").val()+'<br></h3>'+$("textarea[id='pvText1']").val()+'</li>',
		'<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg"><br></figure><h3>'+$("input[id='pvSubtitle2']").val()+'<br></h3>'+$("textarea[id='pvText2']").val()+'</li>',
		'<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg"><br></figure><h3>'+$("input[id='pvSubtitle3']").val()+'<br></h3>'+$("textarea[id='pvText3']").val()+'</li>',
		'<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg"><br></figure><h3>'+$("input[id='pvSubtitle4']").val()+'<br></h3>'+$("textarea[id='pvText4']").val()+'</li>',
		'</ul></div>'
	];

	var pvText = strings[0] + strings[1] + strings[2] + strings[3];

	if ($( "input[id='pvSubtitle4']" ).val() !== "" || $( "textarea[id='pvText4']" ).val() !== "") //Если в 4 колонке есть что-нибудь, то
	{
		pvText += strings[4]; //Добавляем строку с содержимым 4 колонки
	}
	pvText += strings[5]; //Добавляем финальную строку

	if (activeTabLocale("ru")){
		$("textarea#product_block_translations_ru_contents").val(pvText);
		$("textarea#product_price_block_translations_ru_contents").val(pvText);
	}
	else
		if (activeTabLocale("ua")){
			$("textarea#product_block_translations_ua_contents").val(pvText);
			$("textarea#product_price_block_translations_ua_contents").val(pvText);
		}
});

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//СЕРВИСНЫЕ ВОЗМОЖНОСТИ

//$("body").prepend("<div id='svPanel' class='content-block-panel'><input class='form-control' type='text' tabindex='1' id='check1' placeholder='Что взять с собой?'><input class='form-control' type='text' tabindex='2' id='check2' placeholder='C кем пойти?'><input class='form-control' type='text' tabindex='3' id='check3' placeholder='Сезон'><input class='form-control' type='text' tabindex='4' id='check4' placeholder='Сколько дарить'><input class='form-control' type='text' tabindex='5' id='check5' placeholder='Расписание и время'><input class='form-control' type='text' tabindex='6' id='check6' placeholder='Безопасность'><input class='form-control' type='text' tabindex='7' id='check7' placeholder='Программа'><input class='form-control' type='text' tabindex='8' id='check8' placeholder='Дополнительные возможности'><input class='form-control' type='text' tabindex='9' id='check9' placeholder='Возраст'><button class='closePanel btn btn-default'>Закрыть</button><button class='clearPanel btn btn-default'>Очистить</button><button class='hideSave btn btn-primary'>Сохранить и закрыть</button></div>");
$("body").prepend("<div id='svPanel' class='content-block-panel' style='max-height:505px !important;'><textarea type='text' class='form-control' id='table-check' placeholder='Вставить контент-блок таблицей'></textarea><hr><input class='form-control' type='text' tabindex='1' id='check1' placeholder='Что взять с собой?'><input class='form-control' type='text' tabindex='2' id='check2' placeholder='C кем пойти?'><input class='form-control' type='text' tabindex='3' id='check3' placeholder='Сезон'><input class='form-control' type='text' tabindex='4' id='check4' placeholder='Сколько дарить'><input class='form-control' type='text' tabindex='5' id='check5' placeholder='Расписание и время'><input class='form-control' type='text' tabindex='6' id='check6' placeholder='Безопасность'><input class='form-control' type='text' tabindex='7' id='check7' placeholder='Программа'><input class='form-control' type='text' tabindex='8' id='check8' placeholder='Дополнительные возможности'><input class='form-control' type='text' tabindex='9' id='check9' placeholder='Возраст'><button class='closePanel btn btn-default'>Закрыть</button><button class='clearPanel btn btn-default'>Очистить</button><button class='hideSave btn btn-primary'>Сохранить и закрыть</button></div>");
$( "#svPanel" ).draggable();

var ruLabels = [
	"",
	"Что взять с собой?",
	"С кем пойти?",
	"Сезон",
	"Сколько дарить",
	"Расписание и время",
	"Безопасность",
	"Программа",
	"Дополнительные возможности",
	"Возраст"
];

var uaLabels = [
	"",
	"Що взяти з собою?",
	"З ким піти?",
	"Коли активувати сертифікат?",
	"Скільки дарувати",
	"Розклад і час",
	"Безпека",
	"Програма",
	"Додаткові можливості",
	"Вік"
];

var langLabels = ruLabels; //По умолчанию русский

//Отображаем и прячем форму
$("#sv-sh").click(function() {
	$(".content-block-panel").hide();
	$("#svPanel").show();
	show_textarea();
	select_block('5000253', '4000029', '275');
});

//Переводим placeholder'ы формы на соотв. язык
$("html").click(function(){
	if (activeTabLocale("ua"))
	{
		$("#svPanel input").each(function(){
			$(this).attr("placeholder", uaLabels[(($(this).attr('tabindex'))*1)]);
		});
	}
	else
		if (activeTabLocale("ru"))
		{
			$("#svPanel input").each(function(){
				$(this).attr("placeholder", ruLabels[(($(this).attr('tabindex'))*1)]);
			});
		}
});

//Собираем разметку
$("input").keyup(function(){makeSvBlock();});

function makeSvBlock(){

	if (activeTabLocale("ua"))
	{
		langLabels = uaLabels;
	}
	else
		if (activeTabLocale("ru"))
		{
			langLabels = ruLabels;
		}

	var strings=[
		'<br><div class="detail-faq-block infoscroll-content"><div class="row">',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-01.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[1]+'</h3><p>'+$("input[tabindex='1']").val()+'</p></div></dd></dl></div>',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-06.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[2]+'</h3><p>'+$("input[tabindex='2']").val()+'</p></div></dd></dl></div>',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-02.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[3]+'</h3><p>'+$("input[tabindex='3']").val()+'</p></div></dd></dl></div>',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-07.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[4]+'</h3><p>'+$("input[tabindex='4']").val()+'</p></div></dd></dl></div>',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-03.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[5]+'</h3><p>'+$("input[tabindex='5']").val()+'</p></div></dd></dl></div>',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-08.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[6]+'</h3><p>'+$("input[tabindex='6']").val()+'</p></div></dd></dl></div>',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-04.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[7]+'</h3><p>'+$("input[tabindex='7']").val()+'</p></div></dd></dl></div>',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-09.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[8]+'</h3><p>'+$("input[tabindex='8']").val()+'</p></div></dd></dl></div>',
		'<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-05.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[9]+'</h3><p>'+$("input[tabindex='9']").val()+'</p></div></dd></dl></div>',
		'</div></div>',
		'</div><div class="row">'
	];

	var counter = 0; //Счетчик пары
	var svText = "";

	svText = svText + strings[0]; //Добавляем стартовую строку
	for (i = 0; i <= 9; i++) {
		$("input").each(function(){
			if ((($(this).attr('tabindex'))*1) === i && $(this).val() !== "") //Ищем наше поле и если оно не пустое то,
			{
				//alert(($(this).attr('tabindex'))*1 + " Номер поля");
				svText = svText + strings[i]; //Добавляем строку с содержимым этого поля
				//alert(strings[i] + " Строка i");
				counter++; //Счетчик для определения пары столбцов
				if (counter === 2) //Если столбец второй то,
				{
					svText = svText + strings[11]; //Добавим теги перехода на следующюю строку
					counter = 0; //И обнулим счетчик
				}
			}
		});
	}
	svText = svText + strings[10]; //Добавляем финальную строку

	if (activeTabLocale("ru")){
		$("textarea#product_block_translations_ru_contents").val(svText);
		$("textarea#product_price_block_translations_ru_contents").val(svText);
	}
	else
		if (activeTabLocale("ua")){
			$("textarea#product_block_translations_ua_contents").val(svText);
			$("textarea#product_price_block_translations_ua_contents").val(svText);
		}
}

//Разбираем текст вставленный таблицей на строки
$("#table-check").keyup(function(){
	var arr = $('#table-check').val().split('\n');
	var strings = {
		label : [],
		text : []
	};
	var i = 0;
	arr.forEach(function(){
		if(arr[i].length > 10)
		{
			var ss = arr[i].split('\t');
			strings.label[i] = ss[0];
			strings.text[i] = ss[1];
		}
		i++;
	});

	for(var j=0;j<=strings.label.length;j++)
	{
		switch (strings.label[j]) {
			case "Что взять с собой?":
				$("#check1").val(strings.text[j]);
				break;
			case "С кем пойти?":
				$("#check2").val(strings.text[j]);
				break;
			case "Сезон":
				$("#check3").val(strings.text[j]);
				break;
			case "Сколько дарить":
				$("#check4").val(strings.text[j]);
				break;
			case "Расписание и время":
				$("#check5").val(strings.text[j]);
				break;
			case "Безопасность":
				$("#check6").val(strings.text[j]);
				break;
			case "Программа":
				$("#check7").val(strings.text[j]);
				break;
			case "Дополнительные возможности":
				$("#check8").val(strings.text[j]);
				break;
			case "Возраст":
				$("#check9").val(strings.text[j]);
				break;
		}
	}
	makeSvBlock();
});

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//После того как все панели были добавлены в DOM

//Скрываем все добавленные к body панели
$(".content-block-panel").hide();

//Ратаскиваем их по сохраненным позициям на странице
$("#dkPanel").offset(settings.offset.dkPanel);
$("#hPanel").offset(settings.offset.hPanel);
$("#sePanel").offset(settings.offset.sePanel);
$("#pvPanel").offset(settings.offset.pvPanel);
$("#svPanel").offset(settings.offset.svPanel);

//По кнопке закрываем панель
$("button.closePanel").click(function(){
	$(".content-block-panel").hide();
});

//По кнопке очищаем панель
$("button.clearPanel").click(function(){
	$("tr.added-se-block").remove();
	$("tr.added-h-block").remove();
	$(".content-block-panel input").val("");
	$(".content-block-panel textarea").val("");
});

//По кнопке закрываем панель и сохраняем контент
$("button.hideSave").on('click', function() {
	$(".content-block-panel").hide();
	$('.btn-primary:first-child').first().click();
});

//После drag'n'drop панели сохраняем координаты панели в базу
var isDragging = false;
$(".content-block-panel")
	.mousedown(function() {
	isDragging = false;
})
	.mousemove(function() {
	isDragging = true;
})
	.mouseup(function(){
	var wasDragging = isDragging;
	isDragging = false;
	if (wasDragging){
		settings.offset[$(this).attr('id').toString()] = $(this).offset();
		GM_setValue("settings", settings);
		//console.log(GM_getValue("settings"));
	}
});




//==========================================================================================================================================================//
// Зависимости:
// js       : activeTabLocale(str) — Узнаем/проверяем локаль открытой вкладки языка; select_block(by, ru, ua) - открываем необходимый редактор блока по id (для каждой страны свой); getPageType() - узнать тип редактируемой страницы
// css      : .content-block-panel
// settings : положение блока на странице; ($("#rezultPanel").offset(settings.offset.rezultPanel);)

//МЕНЮ
$("ul.top-nav").prepend("<li data-toggle='dropdown'><a href='#' id='open-textarea' aria-expanded='false'><i class='fa fa-file-word-o'></i> Разобрать документ</a><div style='position:absolute;'><textarea id='docText' style='box-shadow: 0 6px 12px rgba(0,0,0,.175); display: none; width: 250px; height: 150px; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; padding:5px; margin-top:1px;' placeholder='Вставьте содержимое документа в это поле'></textarea></div></li>");
$("#open-textarea").click(function(){
	$( "#docText" ).fadeIn(1, function(){
		$(this).focus();
	});
});
$("#docText").focusout(function(){
	$("#docText").delay(50).fadeOut(0);
});

//СТИЛИ
$("body").append("<style>#rezultPanel{display:none; max-width: 370px; max-height: max-content;} #rezultPanel .first-row { padding: 0 0 5px 0; font-size: 13pt; } #rezultPanel .row { border-radius: 3px; border: solid 1px lightgrey; margin: 2px 0 0 0; padding: 5px; background-color: #f9f9f9; } #rezultPanel #buttons { float: right; } #rezultPanel button{margin-left: 5px;} #rezultPanel button.paste-meta-info-button{width:100%; height:30px; margin: 5px 5px 0 0;} </style>");

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//ПАНЕЛЬ РЕЗУЛЬТАТА
$("body").prepend("<div id='rezultPanel' class='content-block-panel'><div class='first-row'><button type='button' class='close'>×</button><span></span></div><div id='rows'></div><div class='form-actions'></div></div>");
$( "#rezultPanel" ).draggable();
$("#rezultPanel").offset(settings.offset.rezultPanel);
$( "#rezultPanel .close" ).on("click", function(){$( "#rezultPanel").hide(); clearRezultPanelRow();});

//После drag'n'drop панели сохраняем координаты панели в базу
var isDragging = false;
$("#rezultPanel")
	.mousedown(function() {
	isDragging = false;
})
	.mousemove(function() {
	isDragging = true;
})
	.mouseup(function(){
	var wasDragging = isDragging;
	isDragging = false;
	if (wasDragging){
		settings.offset[$(this).attr('id').toString()] = $(this).offset();
		GM_setValue("settings", settings);
		//console.log(GM_getValue("settings"));
	}
});

//Массив объектов (контент-блоков)
var blocks = [];
/* = [{
code: "",
name: "",
text: ""
}];
*/
var meta = {};

//По вставке текста разбираем текст по строкам
$("textarea#docText").on("input",function(){

	var strings = $('textarea#docText').val().split('\n'); //Разбираем текст по строкам
	var number = 0; //Порядковый номер блока
	var titles = ""; //Строка для названий всех найденных META-заголовков

	//Очищаем объект мета-заголовков
	meta = {
		title: "",
		description: "",
		keywords: "",
		title_for_catalog: "",
		h1: "",
		title_for_marketing: "",
		announcement: "",
		description_for_marketing: ""
	};

	//Очищаем панель результата
	clearRezultPanelRow();

	//Очищаем массив объектов контент-блоков
	blocks = [];

	//Поиск META-заголовков
	for(let i=0; i<=strings.length; i++) {
		switch(true) {
			case /Title	/.test(strings[i]):
				meta.title = strings[i].slice(6);
				titles += "Title, ";
				break;
			case /Description	/.test(strings[i]):
				meta.description = strings[i].slice(12);
				titles += "Description, ";
				break;
			case /Заголовок в каталоге для товаров \/ Название партнера	/.test(strings[i]):
				meta.title_for_catalog = strings[i].slice(53);
				titles += (getPageType() == "product" || getPageType() == "price") ? "Крошка, Наименование, Наименование для каталога, " : "Крошка, Наименование партнера, Краткое наименование, ";
				break;
			case /Заголовок H1 \(только для товаров\)	/.test(strings[i]):
				meta.h1 = strings[i].slice(34);
				titles += "Заголовок H1, ";
				break;
			case /Заголовок для рекламы \(только для товаров\) 25 символов	/.test(strings[i]):
				meta.title_for_marketing = strings[i].slice(55);
				titles += (getPageType() == "product" || getPageType() == "price") ? "Наименование для маркетинга, " : "";
				break;
			case /Анонс \(аннотация\) для товаров \/ Лид для партнера/.test(strings[i]):
				while(strings[i+1]==="")
					i++;
				meta.announcement = strings[i+1];
				titles += "Аннотация, ";
				break;
			case /Описание для маркетинга/.test(strings[i]):
				while(strings[i+1]==="")
					i++;
				meta.description_for_marketing = strings[i+1];
				titles += "Описание для маркетинга";
				break;
			case /.*-sh/.test(strings[i]):
				console.log("Finished at: "+ i);
				console.log(meta);
				i = Infinity;
				break;
		}
	}

	if(titles.length>0) //Если заголовки нашлись
		addMetaPanelRow(titles); //Добавим запись и кнопку на их вставку в панельку результата

	strings.forEach(function(item, i) {
		switch (item) {
			case "dk-sh":
				blocks.push({id: number, code:"dk", name:"Две колонки", text: makeDkText(i, strings)});
				addRezultPanelRow(number, "dk", "Две колонки");
				number++;
				break;
			case "ci-sh":
				blocks.push({id: number, code:"ci", name:"Цитата", text: makeCiText(i, strings)});
				addRezultPanelRow(number, "ci", "Цитата");
				number++;
				break;
			case "pv-sh":
				blocks.push({id: number, code:"pv", name:"Преимущества/возможности", text: makePvText(i, strings)});
				addRezultPanelRow(number, "pv", "Преимущества/возможности");
				number++;
				break;
			case "ot-sh":
				blocks.push({id: number, code:"ot", name:"Подзаголовок/Обычный текст", text: makeOtText(i, strings)});
				addRezultPanelRow(number, "ot", "Подзаголовок/Обычный текст");
				number++;
				break;
			case "h-sh":
				blocks.push({id: number, code:"h", name:"Характеристики", text: makeHText(i, strings)});
				addRezultPanelRow(number, "h", "Характеристики");
				number++;
				break;
			case "se-sh":
				blocks.push({id: number, code:"se", name:"Структура/этапы", text: makeSeText(i, strings)});
				addRezultPanelRow(number, "se", "Структура/этапы");
				number++;
				break;
			case "sv-sh":
				blocks.push({id: number, code:"sv", name:"Сервисные возможности", text: makeSvText(i, strings, activeTabLocale())});
				addRezultPanelRow(number, "sv", "Сервисные возможности");
				number++;
				break;
		}
	});

	$(".content-block-panel").hide();
	$("#rezultPanel div.first-row span").html("<b>Найдено контент-блоков: <b>"+blocks.length+"</b>");
	// if (blocks.length>0)
	// {
	$("#rezultPanel").show();
	// 	console.log(blocks);
	// }
	// else
	// 	$("#rezultPanel").show().delay(5000).fadeOut(700);

	$("textarea#docText").fadeOut(700);
});

//Очистка панели результата
function clearRezultPanelRow() {
	$("#rezultPanel .row:not(first-child)").remove();
}

//Вставка META-заголовков по клику на кнопку
function addMetaPanelRow(titles){
	$("#rezultPanel #rows").append('<div class="row">Найдены заголовки: <b>'+titles+'<b><div id="buttons"><button class="btn btn-xs btn-default paste-meta-info-button">Вставить заголовки</button></div></div>');
	$("button.paste-meta-info-button").on("click", function(){
		let pagetype = getPageType();
		if(pagetype==="product")
		{
			//Заголовки
			$("input#product_translations_ru_name").css("border-color", "#00c14b").val(meta.title_for_catalog);
			$("input#product_translations_ru_header").css("border-color", "#00c14b").val(meta.h1);
			$("input#product_translations_ru_marketingName").css("border-color", "#00c14b").val(meta.title_for_marketing);
			$("input#product_translations_ru_catalogName").css("border-color", "#00c14b").val(meta.title_for_catalog);

			//SEO
			$("input#product_seo_translations_ru_metaTitle").css("border-color", "#00c14b").val(meta.title);
			/*keywords*/
			$("textarea#product_seo_translations_ru_metaDescription").css("border-color", "#00c14b").val(meta.description);
			$("input#product_seo_translations_ru_metaBreadcrumbs").css("border-color", "#00c14b").val(meta.title_for_catalog);

			//Аннотация и описание для маркетинга
			$("div.redactor-editor").hide();
			$("textarea#product_description_translations_ru_annotation").css({"display":"block", "height":"100px", "padding":"10px"}).val(meta.announcement);
			$("textarea#product_description_translations_ru_marketingDescription").css({"display":"block", "height":"100px", "padding":"10px"}).val(meta.description_for_marketing);
		}

		if(pagetype==="price")
		{
			//Заголовки
			$("input#product_price_translations_ru_name").css("border-color", "#00c14b").val(meta.title_for_catalog);
			$("input#product_price_translations_ru_header").css("border-color", "#00c14b").val(meta.h1);
			$("input#product_price_translations_ru_marketingName").css("border-color", "#00c14b").val(meta.title_for_marketing);
			$("input#product_price_translations_ru_catalogName").css("border-color", "#00c14b").val(meta.title_for_catalog);

			//SEO
			$("input#product_price_seo_translations_ru_metaTitle").css("border-color", "#00c14b").val(meta.title);
			/*keywords*/
			$("textarea#product_price_seo_translations_ru_metaDescription").css("border-color", "#00c14b").val(meta.description);
			$("input#product_price_seo_translations_ru_metaBreadcrumbs").css("border-color", "#00c14b").val(meta.title_for_catalog);

			//Аннотация и описание для маркетинга
			$("div.redactor-editor").hide();
			$("textarea#product_price_description_translations_ru_annotation").css({"display":"block", "height":"100px", "padding":"10px"}).val(meta.announcement);
			$("textarea#product_price_description_translations_ru_marketingDescription").css({"display":"block", "height":"100px", "padding":"10px"}).val(meta.description_for_marketing);
		}

		if(pagetype==="supplier")
		{
// 			//Заголовки
// 			$("input#product_price_translations_ru_name").css("border-color", "#00c14b").val(meta.title_for_catalog);
// 			$("input#product_price_translations_ru_header").css("border-color", "#00c14b").val(meta.h1);
// 			$("input#product_price_translations_ru_marketingName").css("border-color", "#00c14b").val(meta.title_for_marketing);
// 			$("input#product_price_translations_ru_catalogName").css("border-color", "#00c14b").val(meta.title_for_catalog);

// 			//SEO
// 			$("input#product_price_seo_translations_ru_metaTitle").css("border-color", "#00c14b").val(meta.title);
// 			/*keywords*/
// 			$("textarea#product_price_seo_translations_ru_metaDescription").css("border-color", "#00c14b").val(meta.description);
// 			$("input#product_price_seo_translations_ru_metaBreadcrumbs").css("border-color", "#00c14b").val(meta.title_for_catalog);

// 			//Аннотация и описание для маркетинга
// 			$("div.redactor-editor").hide();
// 			$("textarea#product_price_description_translations_ru_annotation").css({"display":"block", "height":"100px", "padding":"10px"}).val(meta.announcement);
// 			$("textarea#product_price_description_translations_ru_marketingDescription").css({"display":"block", "height":"100px", "padding":"10px"}).val(meta.description_for_marketing);
		}
	});
}


//Добавление строки на панель результата, вставка блоков по кликам на соотв. кнопки
function addRezultPanelRow(number, code, name) {
	$("#rezultPanel #rows").append('<div class="row">' + name + '<div id="buttons"><button class="open-editor btn btn-xs btn-default" data-code="'+code+'" data-number="'+number+'">Вставить текст</button></div></div>');

	//Нажатие кнопки ОТКРЫТЬ РЕДАКТОР БЛОКА
	$("button.open-editor").on("click", function(){
		switch ($(this).data("code")) {
			case "dk": select_block('5000246', '4000022', '268');
				break;
			case "ci": select_block('5000247', '4000023', '269');
				break;
			case "pv": select_block('5000248', '4000024', '270');
				break;
			case "ot": select_block('5000249', '4000025', '271');
				break;
			case "h" : select_block('5000250', '4000026', '276');
				break;
			case "se": select_block('5000252', '4000031', '274');
				break;
			case "sv": select_block('5000253', '4000029', '275');
				break;
		}

		if (activeTabLocale("ru")){
			$("textarea#product_block_translations_ru_contents").val(blocks[$(this).data("number")].text);
			$("textarea#product_price_block_translations_ru_contents").val(blocks[$(this).data("number")].text);
		}
		else
			if (activeTabLocale("ua")){
				$("textarea#product_block_translations_ua_contents").val(blocks[$(this).data("number")].text);
				$("textarea#product_price_block_translations_ua_contents").val(blocks[$(this).data("number")].text);
			}
		$("a.re-icon.re-html").click().delay(1000).click();
	});
}



//===============================================================================================
//  ДВЕ КОЛОНКИ
//===============================================================================================

function makeDkText(start, arr){
	arr=arr.slice(++start);
	/*arr.forEach(function(item,i) {
        const regex = /^.{1,2}-sh$/g;
        if (regex.test(item)) //Если нашли начало следующего контент-блока
            arr = arr.slice(0,i); //обрезаем массив
        return;
    });*/
	var dk_text =
		"<div class=\"detail-school-desc\"><h2>" + arr[0] + "</h2><ul>" +
		"<li><h3>" + arr[1].split('\t')[0] + "</h3>" + arr[2].split('\t')[0] + "</li>" +
		"<li><h3>" + arr[1].split('\t')[1] + "</h3>" + arr[2].split('\t')[1] + "</li>" +
		"</ul></div>";

	return dk_text;
}

//===============================================================================================
//  ЦИТАТА
//===============================================================================================

function makeCiText(start, arr){
	arr=arr.slice(++start);

	let txt = "<p><em>" + arr[1].split('\t')[1];
	if (arr[0].length === 0) //Если нет заголовка
	{
		if (txt.length < 210) //Текст недостаточно длинный — добавляем 1 перенос
			txt = "<em><br></em>" + txt;
	}

	var ci_text =
		"<div class=\"detail-quote-block clear\">" +
		"<div class=\"quoute-holder\"><figure><img src=\"http://images.daroo.gift/daroo.ru/gallery/editor/2016/03/22/56f0e860c3ba9.jpg\"></figure>" +
		"<div class=\"desc\">" +
		"<h2>"+ arr[0] +"</h2>" +
		txt +"</em></p>" +
		"<p>"+ arr[2].split('\t')[1] +"</p>" +
		"</div></div></div>";

	return ci_text;
}

//===============================================================================================
//  ПРЕИМУЩЕСТВА/ВОЗМОЖНОСТИ
//===============================================================================================

function makePvText(start, arr){
	arr=arr.slice(++start);

	var strings = [
		'<div class="detail-desc-features clear"><h2>'+ arr[0] +'</h2><ul>',
		'<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg"><br></figure><h3>'+arr[2].split('\t')[0]+'<br></h3>'+arr[3].split('\t')[0]+'</li>',
		'<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg"><br></figure><h3>'+arr[2].split('\t')[1]+'<br></h3>'+arr[3].split('\t')[1]+'</li>',
		'<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg"><br></figure><h3>'+arr[2].split('\t')[2]+'<br></h3>'+arr[3].split('\t')[2]+'</li>',
		'</ul></div>'
	];

	var pv_text = strings[0] + strings[1] + strings[2] + strings[3];

	if (arr[2].split('\t')[3].length || arr[3].split('\t')[3].length) //Если в 4 колонке есть что-нибудь, то
		pv_text += '<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg"><br></figure><h3>'+arr[2].split('\t')[3]+'<br></h3>'+arr[3].split('\t')[3]+'</li>'; //Добавляем строку с содержимым 4 колонки

	pv_text += strings[4]; //Добавляем финальную строку

	return pv_text;
}

//===============================================================================================
//  ОБЫЧНЫЙ ТЕКСТ ot-sh
//===============================================================================================

function makeOtText(start, arr){
	arr=arr.slice(++start);
	const regex = /^.{1,2}-sh$/g;
	arr.some(function(item, i){ //Подрезаем массив по началу следующего блока
		if (regex.test(item)) //Если нашли начало следующего контент-блока
		{
			arr = arr.slice(0,i); //Обрезаем массив
			return true; //Выходим из цикла
		}
	});
	for(let i = arr.length-1;i>=0; i--) //Подрезаем пустые строки с конца массива
	{
		if(arr[i]==="")
			arr = arr.slice(0, i);
		else
			break;
	}

	var ot_text = '<div class="full-desc"><div class="desc">';
	if (arr[0].length) //Если есть заголовок
		ot_text += '<h2>' + arr[0] + '</h2>'; //Вставляем заголовок в итоговый текст

	for(let i = 1; i<=arr.length-1; i++)
	{
		if (arr[i][0] == '●')
		{
			if (ot_text.slice(-11) == '<p><br></p>') //Убираем лишний перенос (если есть), т.к. следующим в тексте идет список
			{
				ot_text = ot_text.slice(0,-11);
			}
			ot_text += '<ul>';
			while(i <= arr.length-1 && arr[i][0] == '●')
			{
				ot_text += '<li>'+ arr[i].slice(2) +'</li>';
				i++;
			}
			ot_text += '</ul>';
		}
		if (i <= arr.length-1 && arr[i].length > 2) //Если i не вышел за допустимое кол-во строк в массиве и текущая строка не пустая, то
			ot_text += '<p>' + arr[i] + '</p><p><br></p>'; //добавляем строку и добавляем перенос, т.к. следующим в тексте идет абзац, либо это конец контент-блока
	}
	ot_text += '</div></div>';
	return ot_text;
}

//===============================================================================================
//  ХАРАКТЕРИСТИКИ h-sh
//===============================================================================================

function makeHText(start, arr){
	arr=arr.slice(++start);
	const regex = /^.{1,2}-sh$/g;
	arr.some(function(item, i){ //Подрезаем массив по началу следующего блока
		if (regex.test(item)) //Если нашли начало следующего контент-блока
		{
			arr = arr.slice(0,i); //Обрезаем массив
			return true; //Выходим из цикла
		}
	});
	for(let i = arr.length-1;i>=0; i--) //Подрезаем пустые строки с конца массива
	{
		if(arr[i]==="")
			arr = arr.slice(0, i);
		else
			break;
	}

	var h_text = "<div class=\"full-desc\">";
	if (arr[0].length) //Если есть заголовок
		h_text += '<div class="desc"><h2>' + arr[0] + '</h2></div>'; //Вставляем заголовок в итоговый текст
	h_text += "<ul class=\"detail-list\">";

	let last_side = "left";

	for(let i = 1; i<=arr.length-1; i++){
		if(i%2){
			if( last_side === "right")
			{
				h_text += '<li><div class="article"><div><h3>' + arr[i].split('\t')[0] + '</h3>' + arr[i+1].split('\t')[0] + '</div></div><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd618120fc9.jpg"></figure></li>';
				last_side = "left";
			} else {

				h_text += '<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd615ccb044.jpg\"></figure><div class="article"><div><h3>' + arr[i].split('\t')[1] + '</h3>' + arr[i+1].split('\t')[1] + '</div></div></li>';
				last_side = "right";
			}
		}
	}
	h_text += "</ul></div>";
	return h_text;
}

//===============================================================================================
//  СТРУКТУРА/ЭТАПЫ se-sh
//===============================================================================================

function makeSeText(start, arr){
	arr=arr.slice(++start);
	const regex = /^.{1,2}-sh$/g;
	arr.some(function(item, i){ //Подрезаем массив по началу следующего блока
		if (regex.test(item)) //Если нашли начало следующего контент-блока
		{
			arr = arr.slice(0,i); //Обрезаем массив
			return true; //Выходим из цикла
		}
	});
	for(let i = arr.length-1;i>=0; i--) //Подрезаем пустые строки с конца массива
	{
		if(arr[i]==="")
			arr = arr.slice(0, i);
		else
			break;
	}

	var se_text = '<div class="full-desc full-left">';
	if (arr[0].length) //Если есть заголовок
		se_text += '<div class="desc"><h2>' + arr[0] + '</h2></div>'; //Вставляем заголовок в итоговый текст
	se_text += "<ul class=\"detail-list\">";

	for(let i = 1; i<=arr.length-1; i++){
		se_text += '<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd615ccb044.jpg\"></figure><div class="article"><div><h3>' + arr[i].split('\t')[1] + '</h3>' + arr[i+1].split('\t')[1] + '</div></div></li>';
		i++;
	}

	se_text += "</ul></div>";
	return se_text;
}

//===============================================================================================
//  СЕРВИСНЫЕ ВОЗМОЖНОСТИ
//===============================================================================================

function makeSvText(start, arr, lang) {
	arr = arr.slice(++start);
	var sv_strings = {
		label: [],
		text: []
	};

	arr.forEach(function(item, i) {
		sv_strings.label[i] = item.split('\t')[0];
		sv_strings.text[i] = item.split('\t')[1];
	});

	var ruLabels = [
		"",
		"Что взять с собой?",
		"С кем пойти?",
		"Сезон",
		"Расписание и время",
		"Безопасность",
		"Программа",
		"Дополнительные возможности",
		"Возраст"
	];

	var uaLabels = [
		"",
		"Що взяти з собою?",
		"З ким піти?",
		"Сезон",
		"Розклад і час",
		"Безпека",
		"Програма",
		"Додаткові можливості",
		"Вік"
	];

	var langLabels = lang === "ua" ? uaLabels : ruLabels; //Выбираем язык лейблов в зависимости от активной вкладки (RU) (UA)
	var counter = 0; //Счетчик пары

	var sv_text = '<div class="detail-faq-block infoscroll-content"><div class="row">'; //Стартовая строка
	for(var j=0;j<=sv_strings.label.length;j++) //Перебираем найденные строки и собираем из найденного разметку
	{
		if (sv_strings.text[j]) //Если не пустая ячейка
		{
			if (counter === 2) //Если был заполнен второй столбец то,
			{
				sv_text += '</div><div class="row">'; //Добавим теги перехода на следующюю строку
				counter = 0; //И обнулим счетчик
			}
			switch (sv_strings.label[j]) {
				case "Что взять с собой?":
					sv_text += '<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-01.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[1]+'</h3><p>'+sv_strings.text[j]+'</p></div></dd></dl></div>';
					break;
				case "С кем пойти?":
					sv_text += '<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-06.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[2]+'</h3><p>'+sv_strings.text[j]+'</p></div></dd></dl></div>';
					break;
				case "Сезон":
					sv_text += '<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-02.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[3]+'</h3><p>'+sv_strings.text[j]+'</p></div></dd></dl></div>';
					break;
				case "Расписание и время":
					sv_text += '<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-03.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[4]+'</h3><p>'+sv_strings.text[j]+'</p></div></dd></dl></div>';
					break;
				case "Безопасность":
					sv_text += '<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-08.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[5]+'</h3><p>'+sv_strings.text[j]+'</p></div></dd></dl></div>';
					break;
				case "Программа":
					sv_text += '<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-04.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[6]+'</h3><p>'+sv_strings.text[j]+'</p></div></dd></dl></div>';
					break;
				case "Дополнительные возможности":
					sv_text += '<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-09.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[7]+'</h3><p>'+sv_strings.text[j]+'</p></div></dd></dl></div>';
					break;
				case "Возраст":
					sv_text += '<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-05.png"></figure></dt><dd><div class="desc"><h3>'+langLabels[8]+'</h3><p>'+sv_strings.text[j]+'</p></div></dd></dl></div>';
					break;
			}
			counter++; //Счетчик для определения пары столбцов
		}
	}
	sv_text += '</div></div>';//Финальная строка

	return sv_text;
}

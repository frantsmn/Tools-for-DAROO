// ==UserScript==
// @name         Daroo - Front - PageInfo
// @namespace    PageInfo
// @version      4.4
// @description  Добавляет на страницы сайта DAROO вспомогательные ссылки и информацию (для редактора/контент-менеджера)
// @updateURL    https://github.com/frantsmn/userscripts/raw/master/Daroo%20-%20Front%20-%20PageInfo.user.js
// @author       Frants Mitskun
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @include      *daroo.*
// @exclude		 *daroo.*/manager*
// @run-at	 document-end
// @license		 MIT
// @copyright 	 2017-2019, frantsmn (https://github.com/frantsmn/userscripts)
// ==/UserScript==


$(function(){

	var d = new Date();
	var time = d.toLocaleTimeString();
	var date = d.toLocaleDateString();
	var settings = GM_getValue("settings") ? GM_getValue("settings") : {show_meta : false};

	var page = {
		id          : google_tag_params.local_id,
		// title       : $("div.nav :last").html(),
		url         : window.location.href,
		time        : time.slice(0, -3)+"  "+date.slice(0, 6)+date.slice(8, 10),
		type        : get_type(),
		hostname    : window.location.hostname
	};

	if (page.id == null){
		alert("Для работы кнопок редактирования карточки - обновите страницу. Если данная ошибка появляется слишком часто, сообщите об этом разработчику скрипта DAROO-Front-PageInfo \n ERROR:\n local_id = " + google_tag_params.local_id + "\n page.id = " + page.id);
	}

	//Возвращает тип страницы {type, str1, str2} //Используется для page.type
	function get_type(){
		var obj;
		if(typeof Product !== 'undefined')
			obj = Product.get('type') === "product" && $('div.accordion-header').length ? {type:"product", str1:"Редактировать разводящую карточку", str2:"Разводящая карточка"} :
			obj = Product.get('type') === "product" ? {type:"product", str1:"Редактировать карточку товара", str2:"Карточка товара"} :
			obj = Product.get('type') === "price" ? {type:"price", str1:"Редактировать ценовое предложение", str2:"Ценовое предложение"} : {};

		if ($('.card-partner').length)
			obj = {type:"supplier", str1:"Редактировать карточку партнера", str2:"Партнер"};

		if(/(\/life\/)/.exec(window.location.href) !== null)
			obj = {type:"blog", str1:"Редактировать запись", str2:"Запись блога"};
		return obj;
	}


	//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
	//МЕНЮ

	var style = `
<style>

#edit-info {
position: absolute;
top: 68px;
right: 10px;
background-color: white;
}

#edit-info input {
border: solid lightgray 1px;
border-radius: 2px;
padding: 1px;
}

.page-menu-el {
display: inline-block;
margin-left: 10px;
padding: 5px;
border-radius: 3px;
border: 1px dashed orange;
}

#page-canonical-info.clone {
border: red dashed 1px;
background-color: #ffeaf7;
}

#page-canonical-info.original {
border: green dashed 1px;
background-color: #e9ffe9;
}

.__a{color:orange;}

#page-meta-info,
#page-history-info {
cursor: pointer;
}

#page-meta-info:hover,
#page-history-info:hover,
#edit-button:hover,
.page-menu-el:hover {
border: 1px solid orange;
color: orange;
}

#page-id-info input {
width: 45px;
}

#page-url-info input,
#page-canonical-info input {
width: 80px;}

</style>
`;
	$("head").append(style);

	var div = '<div id="edit-info"><div id="page-id-info" class="page-menu-el">ID: <input value='+google_tag_params.local_id+'></div><div id="page-url-info" class="page-menu-el">URL: <input value='+window.location.pathname.split("/").slice(-1)[0]+'></div></div>';
	$("div.nav").append(div);

	$("#page-id-info").mouseenter(function(){
		$("#page-id-info input").select();
	});
	$("#page-url-info").mouseenter(function(){
		$("#page-url-info input").select();
	});

	//Ссылка на каноническую страницу (если текущая страница канонизирована)
	$("head").find("link[rel='canonical']").each(function(){
		$('#page-url-info').after('<div id="page-canonical-info" class="page-menu-el clone"><a href='+$(this).attr('href')+' target="_blank">Каноническая:</a><input value='+$(this).attr('href').split("/").slice(-1)[0]+'></div>');
	});

	//Кнопка редактирования страницы в меню
	if (page.type){
		$("#edit-info").append('<a id="edit-button" href=\"https://'+window.location.hostname+'/manager/'+page.type.type+'/edit/'+google_tag_params.local_id+'" target="_blank" class="page-menu-el">'+page.type.str1+'</a>');
		$("#page-canonical-info").mouseenter(function(){
			$("#page-canonical-info input").select();
		});
	}

	//Кнопка таблицы последних посещенных страниц
	// if (list.length > 1) //Если количество элементов в списке истории больше 1
	// 	$("#edit-info").prepend('<div id="page-history-info" class="page-menu-el">История</div>');

	//Кнопка META-информации о странице
	$("#edit-info").prepend('<div id="page-meta-info" class="page-menu-el">Мета</div>');

	//Разметка блока Meta
	var style_meta = '<style>#meta{padding: 7px 18px 7px 40px; border-bottom: 1px solid #ededed;}'+
		'#meta table{width:100%; margin:auto;} #meta table td:first-child{width:90px; padding-right:5px; line-height:30px;} #meta table td:last-child, #meta table td:nth-child(3){width:150px; vertical-align:top; padding-left:10px;}'+
		'#meta input{width:100% !important; height: 22px; border: solid #eaeaea 1px; border-radius: 2px; padding: 1px 3px 2px 3px; margin:2px 0 0 2px;} #meta input:hover{border:1px solid lightgrey;}'+
		'#metatext-for-table{margin-left:10px; margin-left: 10px; height: 79px; margin-top: 2px; border: solid #eaeaea 1px; border-radius: 2px; resize: none;} #copyButton{height: 85px; margin-top: 2px; margin-left:0px; background-color:white; cursor:pointer;}</style>';
	var meta = '<div id="meta"><table><tr><td><b>Title:</b><br><b>Description:</b><br><b>Keywords:</b></td>'+
		'<td><input value="'+$("title").html()+'"><br><input value="'+$('meta[name="description"]').attr('content')+'"><br><input value="'+$('meta[name="keywords"]').attr('content')+'">'+
		'</td><td><textarea id="metatext-for-table">'+document.location.href+'&#9;'+$("title").html()+'&#9;'+$("h1").html().replace(/\r?\n/g, "")+'&#9;'+$('meta[name="description"]').attr('content')+'&#9;'+ date +'</textarea></td><td><button id="copyButton" class="page-menu-el">Скопировать для вставки в Google Таблицы</button></td></tr></table></div>';
	$("head").append(style_meta);

	//Отображаем блок Meta согласно настройкам
	if(settings.show_meta)
	{
		$("div.textBlock").prepend(meta);
		$("#page-meta-info").addClass("__a");
		copying_by_button();
	}

	//Отображаем/прячем блок Meta по кнопке
	$("#page-meta-info").click(function(){
		if(!$("#meta").length)
		{
			$("div.textBlock").prepend(meta);
			$("#page-meta-info").addClass("__a");
			copying_by_button();
			settings.show_meta = true;
			GM_setValue("settings", settings);
		}
		else
		{
			$("#meta").remove();
			$("#page-meta-info").removeClass("__a");
			settings.show_meta = false;
			GM_setValue("settings", settings);
		}
	});

	//Функция копирования meta-информации для вставки в Google Таблицы
	function copying_by_button(){
		var textarea = document.getElementById("metatext-for-table");
		var copyButton= document.getElementById("copyButton");
		try{
			copyButton.addEventListener('click', function(e) {
				textarea.select();
				document.execCommand('copy');
			});
		} catch(e) {}


	}


	//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
	//ВСПОМОГАТЕЛЬНЫЕ ЭЛЕМЕНТЫ НА СНИППЕТЕ КАРТОЧКИ ТОВАРА


	let catalog_card_style = `
<style>
.catalog-card-image .edit-card{
display: block;
position: absolute;
top: 0;
right: 0;
height: 30px;
width: 30px;
background: rgba(0, 0, 0, 0.5);
border-radius: 5px;
border: solid 1px rgba(255, 255, 255, 0.5);
background-image: url('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQ1OSA0NTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ1OSA0NTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iY3JlYXRlIj4KCQk8cGF0aCBkPSJNMCwzNjIuMVY0NTloOTYuOWwyODAuNS0yODMuMDVsLTk2LjktOTYuOUwwLDM2Mi4xeiBNNDUxLjM1LDEwMmMxMC4yLTEwLjIsMTAuMi0yNS41LDAtMzUuN0wzOTIuNyw3LjY0OSAgICBjLTEwLjItMTAuMi0yNS41LTEwLjItMzUuNywwbC00NS45LDQ1LjlsOTYuOSw5Ni45TDQ1MS4zNSwxMDJ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==');
background-repeat: no-repeat;
background-position: center;
transition: background .2s ease, border .2s ease;
}

.catalog-card-image .edit-card:hover{
background-color: rgba(0, 0, 0, 0.8);
border: solid 1px rgba(255, 255, 255, 0.8);
}

.jsonInput {
position: absolute;
top: 0;
right: 40px;
height: 30px;
width: 100px;
background: rgba(0, 0, 0, 0.5);
border-radius: 5px;
border: solid 1px rgba(255, 255, 255, 0.5);
transition: background .2s ease, border .2s ease;
padding: 0 0 0 5px;
color: white;
}

.jsonInput:hover{
background-color: rgba(0, 0, 0, 0.8);
border: solid 1px rgba(255, 255, 255, 0.8);
}

</style>
`;

	$("head").append(catalog_card_style);

	$( document ).ready(function() {
		$(".catalog-card:not(.penAdded), .big-catalog-card:not(.penAdded)").each(function () {
			addEditButton(this);
			addTextarea(this);
		});
	});

	$(document).on('mouseenter', ".catalog-card:not(.penAdded)", function () {
		$(".catalog-card:not(.penAdded), .big-catalog-card:not(.penAdded)").each(function () {
			addEditButton(this);
			addTextarea(this);
		});
	});

	//Функция добавляет textarea c json-инорфмацией для рассылки
	function addTextarea(item){
		let _ = $(item);
		if (!_.hasClass("jsonInputAdded")){
			const data = JSON.stringify({
				title: _.find('.cc-name p').text(),
				image: _.find('.catalog-card-image a img').attr('data-src'),
				link: _.find('.catalog-card-image a')[0].href,
				isNew: _.find('.catalog-card-statuses').has('.cc-new').length ? true : false,
				discount: _.find('.catalog-card-statuses').has('.cc-promo').length ? _.find('.catalog-card-image a .cc-promo').text() : false,
				price: _.find('.catalog-card-content .cc-price').text().replace(/\n?/g, ""),
				partner: _.find('.catalog-card-content .cc-partner').text(),
				rating: _.find('.catalog-card-content .cc-popularity').has('.cc-rating').length ? _.find('.catalog-card-content .cc-popularity .cc-rating').text() : 'Рейтинг 4/5',
			});

			const a = $(document.createElement('input'))
			.val(data)
			.addClass('jsonInput')
			.hover(function(){
				$(this).select();
			});

			_.addClass("jsonInputAdded").find(".catalog-card-statuses").append(a);
		}
	}

	//Функция добавляет кнопку редактирования карточки товара
	function addEditButton (item){
		let _ = $(item);
		if (!_.hasClass("penAdded")){
			let id = $(this).data("card-id");

			_.addClass("penAdded").find(".catalog-card-statuses").append('<a class="edit-card" href="https://'+window.location.hostname+'/manager/product/edit/'+id+'" target="_blank"></a>');
		}
	}


	//=======================================================================================================


	//Кнопки редактирования цен в аккордеон цен на карточке
	$("div.accordion-content-buy").each(function(){
		$(this).after('<div class="accordion-content-buy"><a class="page-menu-el" href="https://'+window.location.hostname+'/manager/price/edit/'+$(this).find("a.btn-2").attr("href").split("/").slice(-1)[0]+'" target="_blank">Редактировать</a></div>');
	});

	//Кнопки перехода с разводящей на цены в аккордеон с партнерами
	$("ul.accordion-goto-next-page").each(function(){
		$("div.accordion-header").css({"padding": "10px 40px 0","height": "90px"});
		$(this).after('<a class="page-menu-el" style="position:relative; top:-55px; left:500px; padding:10px 30px; background-color:white;" href="'+$(this).attr("data-ajax-url")+'" target="_blank">Открыть в новой вкладке</a>');
	});

	//Ссылка на изображение баннера на Карточке товара/Ценовом предложении
	$("body").append("<style>#banner-url{"+
					 "float:right; position:relative; height:50px; width:200px; margin-bottom:-75px; margin-top:5px; margin-right:5px; padding:5px;"+
					 "background:rgba(52, 52, 52, 0.7); color:white;"+
					 "border:1px dashed orange; border-radius:3px;"+
					 "z-index:9999999 !important;}"+
					 "#banner-url a{color:white; letter-spacing:1px; padding-left:2px;}"+
					 "#banner-url a:hover{color:orange;}"+
					 "#banner-url input{color:white; background:black; border:solid gray 1px; border-radius:2px; padding-left:2px; width:195px;}"+
					 "</style>");

	$("ul.details-slider").find("li").each(function(){
		$(this).prepend("<div id=\"banner-url\">"+
						"<a href=\""+$(this).find("img").attr("src")+"\" target=\"_blank\" download>Сохранить изображение</a><br>"+
						"<input value=\""+$(this).find("img").attr("src")+"\">"+
						"</div>");
	});

	$("#banner-url input").mouseenter(function(){
		$("#banner-url input").select();
	});

	//Счетчик цен на баннере
	$("body").append("<style>#prices-counter{"+
					 "float:left; position:absolute; margin-top:5px; margin-left:5px; padding:5px;"+
					 "background:rgba(52, 52, 52, 0.7); color:white; border:1px dashed orange; border-radius:3px; z-index:9999999 !important;}#prices-counter div{background-color: black; margin-top: 4px; border-radius: 2px; border: solid gray 1px; padding: 4px 6px;} #prices-counter span{color:orange; font-weight: bold;}"+
					 "</style>");

	$("ul.details-slider").find("li").each(function(){
		$(this).prepend("<div id=\"prices-counter\">"+
						"Счетчик цен<div>"+
						"Акций: <span>"+ count_prices().promos +"</span><br>"+
						"Обычных: <span>"+ count_prices().prices +"</span><br>"+
						"Всего цен: <span>"+ count_prices().all + "</span></div>"+
						"</div>");
	});

	//Функция подсчета цен в карточке
	function count_prices(){
		var prices = 0;
		var promos = 0;
		$(".accordion-content [itemprop='offers']")
			.each(function(){
			prices++;
			if ($(this).find(".accordion-content-discount").children().length > 0)
				promos++;
		});
		return {all: prices, prices:prices-promos, promos: promos};
	}
});

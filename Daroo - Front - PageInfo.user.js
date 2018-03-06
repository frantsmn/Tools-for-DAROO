// ==UserScript==
// @name         Daroo - Front - PageInfo
// @namespace    PageInfo
// @version      3.5
// @description  Добавляет на страницу некоторую информацию и ссылку на редактирование карточки товара/цены/партнера
// @updateURL    https://openuserjs.org/meta/frantsmn/Daroo_-_Front_-_PageInfo.meta.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @author       Frants Mitskun
// @include      *daroo.by/life*
// @include      *daroo.ru/life*
// @include      *daroo.by/minsk*
// @include      *daroo.by/brest*
// @include      *daroo.by/vitebsk*
// @include      *daroo.by/gomel*
// @include      *daroo.by/grodno*
// @include      *daroo.by/mogilev*
// @include      *daroo.by/polotsk*
// @include      *daroo.ru/msk*
// @include      *daroo.ru/spb*
// @include      *daroo.ru/nsk*
// @include      *daroo.ru/ekb*
// @include      *daroo.ua/ru/kiev*
// @include      *daroo.ua/kiev*
// @license		 MIT
// @copyright 	 2017, frantsmn (https://openuserjs.org/users/frantsmn)
// ==/UserScript==

//GM_deleteValue("history");

(function(){
	var d = new Date();
	var time = d.toLocaleTimeString();
	var date = d.toLocaleDateString();
	var settings = GM_getValue("settings") ? GM_getValue("settings") : {show_meta : false, show_history : false};
	var list = GM_getValue("history") ? GM_getValue("history") : [];
	var page = {
		id          : google_tag_params.local_id,
		title       : $("div.nav :last").html(),
		url         : window.location.href,
		time        : time.slice(0, -3)+"  "+date.slice(0, 6)+date.slice(8, 10),
		type        : get_type(),
		hostname    : window.location.hostname
	};

	//Возвращает тип страницы {type, str1, str2}
	function get_type(){
		var obj;
		if ($('.card-partner').length)
			obj = {type:"supplier", str1:"карточку партнера", str2:"Партнер"};
		else
			if(typeof Product !== 'undefined')
				obj = Product.get('type') === "product" && $('div.accordion-header').length ? {type:"product", str1:"разводящую карточку", str2:"Разводящая карточка"}:
				obj = Product.get('type') === "product" ? {type:"product", str1:"карточку товара", str2:"Карточка товара"} :
				obj = Product.get('type') === "price" ? {type:"price", str1:"ценовое предложение", str2:"Ценовое предложение"} : {};
		return obj;
	}

	if (page.type) //Если мы на странице цены/карточки/партнера
	{
		for(var i = list.length-1;i>=0;i--) //Проверяем на наличие такой же записи
		{
			console.log("Search for doubles. #"+i);
			if(list[i].id === page.id && list[i].hostname === page.hostname)
			{
				list.splice(i, 1);
				console.log("Double was founded at #"+i);
				break;
			}
		}
		if (list.length-1 === 15) //Если список достиг ограничения
		{
			list.splice(0, 1); //Удаляем последний элемент
			console.log("Limit was reached! First item was deleted from list.");
		}

		list.push(page); //Добавляем новую запись
		GM_setValue("history", list); //Сохраняем в базу
		console.log(list);
	}

	//Разметка меню
	var style = '<style>#edit-info{position: absolute; top: 68px; right: 10px; background-color:white;} #edit-info input{border:solid lightgray 1px; border-radius:2px; padding:1px;}'+
		'.page-menu-el{display:inline-block; margin-left:10px; padding:5px; border-radius:3px; border: 1px dashed orange;} #page-canonical-info{border:red dashed 1px; background-color:#ffeaf7;} .__a{color:orange;}'+
		'#page-meta-info, #page-history-info{cursor:pointer;} #page-meta-info:hover, #page-history-info:hover, #edit-button:hover, .page-menu-el:hover{border: 1px solid orange; color:orange;}'+
		'#page-id-info input{width:45px;} #page-url-info input, #page-canonical-info input{width:80px;}</style>';

	var div = '<div id="edit-info"><div id="page-id-info" class="page-menu-el">ID: <input value='+google_tag_params.local_id+'></div><div id="page-url-info" class="page-menu-el">URL: <input value='+window.location.pathname.split("/").slice(-1)[0]+'></div></div>';

	$("head").append(style);
	$("div.nav").append(div);

	//Ищем ссылку на каноническую страницу и добавлем в меню, если нашли
	$( document ).find("link[rel='canonical']").each(function(){
		//alert($(this).attr('href'));
		if ($(this).attr('href') !== undefined)
			$('#page-url-info').after('<div id="page-canonical-info" class="page-menu-el"><a href='+$(this).attr('href')+' target="_blank">Canonical</a>: <input value='+$(this).attr('href').split("/").slice(-1)[0]+'></div>');
	});

	if (page.type) //Если мы на странице цены/карточки/партнера
		$("#edit-info").append('<a id="edit-button" href=\"https://'+window.location.hostname+'/manager/'+page.type.type+'/edit/'+google_tag_params.local_id+'" target="_blank" class="page-menu-el">Редактировать '+page.type.str1+'</a>');

	var pri = /(\/life\/)/;
	if (pri.exec(window.location.href)) //Если мы на странице блога
	{
		$("#edit-info").append('<a id="edit-button" href=\"https://'+window.location.hostname+'/manager/blog/edit/'+google_tag_params.local_id+'" target="_blank" class="page-menu-el">Редактировать запись</a>');
	}

	if (list.length>1) //Если количество элементов в списке истории больше 1
		$("#edit-info").prepend('<div id="page-history-info" class="page-menu-el">History</div>');

	$("#edit-info").prepend('<div id="page-meta-info" class="page-menu-el">Meta</div>');

	$("#page-url-info").mouseenter(function(){
		$("#page-url-info input").select();
	});
	$("#page-canonical-info").mouseenter(function(){
		$("#page-canonical-info input").select();
	});
	$("#page-id-info").mouseenter(function(){
		$("#page-id-info input").select();
	});

	//Разметка таблицы истории
	var style_table = '<style>#history{padding: 0 40px; border-bottom: 1px solid #ededed;} #history table{width:100%;} #history table th{background-color:#ffeaf7; text-align: left; padding:0 0 0 5px; font-weight:bold;} #history table tr{border-bottom:1px solid #ededed;} #history tr:last-child{border-bottom:0px !important;} #history table td{padding:2px 2px 2px 5px} #history table tr td > img{vertical-align:middle;}</style>';
	var table_start = '<div id="history"><table><tr><th> </th><th>id</th><th>Тип</th><th>Наименование</th><th>Адрес</th><th>Ред.</th><th>Время</th></tr>';
	var table_end = '</table></div>';
	$("head").append(style_table);

	//Собираем таблицу
	function createTable(){
		var table = table_start;
		for (var i=list.length-2;i>=0;i--)
			table += '<tr><td>'+ flag(list[i].hostname) +'</td><td>'+list[i].id+'</td><td>'+list[i].type.str2+'</td><td>'+list[i].title+'</td><td><a href="'+list[i].url+'" target="_blank">'+list[i].url+'</a></td><td><a href=\"https://'+list[i].hostname+'/manager/'+list[i].type.type+'/edit/'+list[i].id+'" target="_blank">Ред.</a></td><td>'+list[i].time+'</td></tr>';
		return table += table_end;
	}

	//Возвращает картинку флага
	function flag(str){
		return str === "daroo.by" ? '<img src="https://daroo.by/img/flags/by.png">' : str === "daroo.ru" ? '<img src="https://daroo.by/img/flags/ru.png">' : '<img src="https://daroo.by/img/flags/ua.png">';
	}

	//Отображаем/прячем таблицу по кнопке
	$("#page-history-info").click(function(){
		if(!$("#history").length)
		{
			$("div.textBlock").prepend(createTable());
			$("#page-history-info").addClass("__a");
		}
		else
		{
			$("#history").remove();
			$("#page-history-info").removeClass("__a");
		}
	});

	//Добавлем кнопки редактирования цен в аккордеон цен на карточке
	$("div.accordion-content-buy").each(function(){
		$(this).after('<div class="accordion-content-buy"><a class="page-menu-el" href="https://'+window.location.hostname+'/manager/price/edit/'+$(this).find("a.btn-2").attr("href").split("/").slice(-1)[0]+'" target="_blank">Редактировать</a></div>');
	});

	//Добавлем кнопки перехода с разводящей на цены в аккордеон с партнерами
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

	//Разметка блока Meta
	var style_meta = '<style>#meta{padding: 7px 18px 7px 40px; border-bottom: 1px solid #ededed;}'+
		'#meta table{width:100%; margin:auto;} #meta table td:first-child{width:90px; padding-right:5px; line-height:30px;} #meta table td:last-child, #meta table td:nth-child(3){width:150px; vertical-align:top; padding-left:10px;}'+
		'#meta input{width:100% !important; height: 22px; border: solid #eaeaea 1px; border-radius: 2px; padding: 1px 3px 2px 3px; margin:2px 0 0 2px;} #meta input:hover{border:1px solid lightgrey;}'+
		'#metatext-for-table{margin-left:10px; margin-left: 10px; height: 79px; margin-top: 2px; border: solid #eaeaea 1px; border-radius: 2px; resize: none;} #copyButton{height: 85px; margin-top: 2px; margin-left:0px; background-color:white; cursor:pointer;}</style>';
	var meta = '<div id="meta"><table><tr><td><b>Title:</b><br><b>Description:</b><br><b>Keywords:</b></td>'+
		'<td><input value="'+$("title").html()+'"><br><input value="'+$('meta[name="description"]').attr('content')+'"><br><input value="'+$('meta[name="keywords"]').attr('content')+'">'+
		'</td><td><textarea id="metatext-for-table">'+document.location.href+'&#9;'+$("title").html()+'&#9;'+$("h1[itemprop='name']").html()+'&#9;'+$('meta[name="description"]').attr('content')+'&#9;'+ date +'</textarea></td><td><button id="copyButton" class="page-menu-el">Скопировать для вставки в Google Таблицы</button></td></tr></table></div>';
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

	$("div.textBlock").on("click", "input", function(){
		$(this).select();
	});

	//Функция копирования meta-информации для вставки в Google Таблицы
	function copying_by_button(){
		var textarea = document.getElementById("metatext-for-table");
		var copyButton= document.getElementById("copyButton");
		copyButton.addEventListener('click', function(e) {
			textarea.select();
			document.execCommand('copy');
		});
	}

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

})();

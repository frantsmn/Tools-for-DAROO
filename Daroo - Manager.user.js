// ==UserScript==
// @name         Daroo - Manager
// @namespace    Scripts for Daroo Manager
// @include      *daroo*.*/manager/*
// @version      1.4
// @description  Исправления и улучшения для админки DAROO
// @updateURL    https://openuserjs.org/meta/frantsmn/Daroo_-_Manager.meta.js
// @author       Frants Mitskun
// @grant		 GM_addStyle
// @license		 MIT
// @copyright 	 2017, frantsmn (https://openuserjs.org/users/frantsmn)
// ==/UserScript==

//Ссылки из МЕНЮ открываются не в фрейме
$("#admin-nav").find('a.admin-nav-item').each(function(){$(this).removeClass("admin-nav-item");});

//========================================================================================================

//Запуск всех функций по таймауту
setTimeout(function run() {

	tableImprove();
	checkContacts();
	restyleBlog();

	setTimeout(run, 1000);
}, 1000);

//======================================================================================================== tableImprove

//ТОЛЬКО ДЛЯ ТАБЛИЦЫ ТОПОВ — Функция проверяет активный элемент в выпадающем списке городов и возвращает часть урла (msk, spb, ...)
function tops_city(){
	if (~$("#select2--container").text().indexOf('Москва'))
		return "msk";
	if (~$("#select2--container").text().indexOf('Санкт-Петербург'))
		return "spb";
	if (~$("#select2--container").text().indexOf('Екатеринбург'))
		return "ekb";
	if (~$("#select2--container").text().indexOf('Новосибирск'))
		return "nsk";
	if (~$("#select2--container").text().indexOf('Минск'))
		return "minsk";
	/* - - - */
}

//Ссылки на редактирование страниц карточек и цен в таблицах + ссылки на страницу товара из таблицы топов

function tableImprove(){
	if($("table#grid_results_product_grid").length || $("table#grid_results_product_price_grid").length || $("form#top-form").length || $("#product-contents").length || $("#grid_results_supplier_grid").length )  /*Для страницы с таблицей ( ЦЕН || КАРТОЧЕК || ТОПОВ || ЦЕН в карточке товара)*/
	{
		$("table").find("tr").each(function()
								   {
			if (!$(this).hasClass("link-added"))
			{
				$(this).addClass("link-added");
				var id = $(this).find(".ig-grid-cell-id").text().trim();
				var route = $(this).find(".ig-grid-cell-price").length ? "http://" + window.location.hostname + "/manager/price/edit/" + id : "http://" + window.location.hostname + "/manager/product/edit/" + id;
				$(this).find(".ig-grid-cell-id").html('<a href="'+ route +'" target="_blank"><input type="button" value="Edit" style="margin:0px; margin-left:4px; width:50px; height:22px;" class="btn btn-primary btn-xs"/></a>');

				if (window.location.href.indexOf("manager/tops/create")>0)
				{
					$(this).find(".route").prepend('<a href="http://'+ window.location.hostname +'/' + tops_city() + '/'+ $(this).find(".route").text().trim() +'" target="_blank" style="display:inline-block;"><input type="button" value="Open" style="margin-left:2px; width:45px; height:20px;" class="btn btn-xs btn-primary"/></a>');
				}
			}
		});

		//Кнопки редактирования для таблицы цен на странице редактирования карточки товара
		if (!$("#tab-prices").hasClass("link-added"))
			$("#tab-prices").find("tr").each(function(){
				if(typeof $(this).attr('data-sort-id') !== "undefined")
					$(this).append('<td align="center"><a href="/manager/price/edit/'+ $(this).attr('data-sort-id') +'" target="_blank"><input type="button" value="Edit" style="margin:2px; margin-left:4px; width:50px; height:22px;" class="btn btn-xs btn-primary"/></a></td>');
				$("#tab-prices").addClass("link-added");
			});
	}
}

//======================================================================================================== checkContacts

//Включает чекбокс контакта на цене, если он 1
function checkContacts(){
	if ($("#product_price_contacts div.checkbox").length === 1 && !$("#product_price_contacts div.checkbox").find("input:checkbox").prop("checked"))
	{
		$("#product_price_contacts div.checkbox").find("input:checkbox").prop( "checked", true );
		$("div#message").show().append('<div id="ok" class="alert alert-success checkbox-message" style="display:block !important; opacity:0.5; text-align:center;">Чекбокс контакта был включен! <b style="color:maroon">🡇 Сохраните изменения 🡇</b> <button class="btn btn-primary btn-block" id="save-contact" style="margin-top:10px;">Сохранить</button></div>');
		$( ".checkbox-message" ).animate({opacity: "1"}, 700 );
		$("button#save-contact").on('click', function(){
			$("#tab-contacts button.btn.btn-primary").click();
		});
	}
}

//======================================================================================================== restyleBlog

function restyleBlog(){

if (/https:\/\/daroo*.*manager\/blog\/edit*.*/.test(window.location.href ) && !$("body").hasClass("restyled"))
{
$("body").addClass("restyled");
	GM_addStyle(
`
/*Общие исправления*/

#body-contents {
	margin-top: 50px !important;
}

.container {
	min-width: 800px !important;
}

#body-contents,
.container {
	margin-left: 0px;
	margin-right: 0px;
	padding: 0px;
}
/*Заголовок статьи на шапке*/

div.container h1 {
	left: 224px;
	position: fixed;
	top: -9px;
	z-index: 1030;
	color: #ffffffe8;
	font-size: 27px;
	cursor: pointer;
	border-bottom: dashed 2px #222;
	transition: border-bottom .5s ease-out, color .5s ease-out;
}

div.container h1:hover{
	transition: all .2s ease-out;
	border-bottom: dashed 2px #337ab7;
	color: white;
}
/*Вкладки локалей*/

ul.a2lix_translationsLocales.nav.nav-tabs {
	display: none;
}
/**/
/*		GRID*/
/**/

form#product-block-cont {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-gap: 15px;
}
/**/
/*		TAB MAIN*/
/**/

#tab-main {
	grid-column-start: 1;
	grid-column-end: 2;
	grid-row-start: 1;
	grid-row-end: 4;
}

#tab-main{
	max-width: 1000px !important;
}

#tab-main table {
	width: 100% !important;
}

#tab-main tbody tr td:first-child {
	width: 40% !important;
	min-width: 300px !important;
}

#tab-main tbody tr td:nth-child(2n) {
	width: 60% !important;
}

span.select2.select2-container.select2-container--default {
	width: 100% !important;
}

button[data-id="blog_blogCatalogCategory"] {
	overflow: hidden !important;
	width: 100% !important;
	height: 34px !important;
	white-space: normal !important;
}

button[data-id="blog_blogCatalogCategory"]:hover {
	height: auto !important;
	overflow: hidden !important;
}
/**/
/*		TAB SEO*/
/**/

li>[name="#tab-seo"] {
	display: none;
}

form#product-block-cont div#tab-seo {
	display: block !important;
	grid-column-start: 2;
	grid-column-end: 3;
	grid-row-start: 1;
	grid-row-end: 2;
	padding: 10px;
	border: 1px dashed lightgrey;
	border-radius: 5px;
}

form#product-block-cont div#tab-seo:before{
	content:"SEO-заголовки";
	font-size:20px;
	top: -6px;
    position: relative;
	color: #c7c7c7;
}

#tabs-content div#tab-seo .col-md-6 {
	width: 100% !important;
	min-width: 350px;
}

label[for="blog_seo_translations_ru_metaKeywords"] {
	display: none !important;
}

textarea#blog_seo_translations_ru_metaKeywords {
	display: none;
}

/**/
/*		TAB REGIONS*/
/**/

li>[name="#tab-regions"] {
	display: none;
}

form#product-block-cont div#tab-regions {
	display: block !important;
	grid-column-start: 2;
	grid-column-end: 3;
	grid-row-start: 2;
	grid-row-end: 3;
	padding: 10px;
	border: 1px dashed lightgrey;
	border-radius: 5px;
}

form#product-block-cont div#tab-regions:before{
	content:"Регионы для отображения записи";
	font-size:20px;
	top: -6px;
    position: relative;
	color: #c7c7c7;
}

#tab-regions .alert{
	display: none;
}
`
	);

	//Переключение вкладок на странице редактирования блога
	$("a[href='#gallery']").on("click", function(){
		$("form#product-block-cont").hide();
	});

	$("a[href='#snippets']").on("click", function(){
		$("form#product-block-cont").hide();
	});

	$("a[href='#main']").on("click", function(){
		$("form#product-block-cont").show();
	});

		$(".container h1").on("click", function(){
		window.open($("#tab-main table tr:first-child td a").attr('href'));
	});
}


}

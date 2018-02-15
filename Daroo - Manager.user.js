// ==UserScript==
// @name         Daroo - Manager
// @namespace    Scripts for Daroo Manager
// @include      *daroo*.*/manager/*
// @version      1.2
// @description  Исправления и улучшения для админки DAROO
// @updateURL    https://openuserjs.org/meta/frantsmn/Daroo_-_Manager.meta.js
// @author       Frants Mitskun
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

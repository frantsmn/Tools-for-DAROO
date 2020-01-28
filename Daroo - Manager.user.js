// ==UserScript==
// @name         Daroo - Manager
// @namespace    Scripts for Daroo Manager
// @include 	 *daroo*.*/manager/*
// @version      3.3
// @description  Исправления и улучшения для админки DAROO
// @updateURL    https://github.com/frantsmn/userscripts/raw/master/Daroo%20-%20Manager.user.js
// @author       Frants Mitskun
// @grant		 GM_addStyle
// @license		 MIT
// @copyright 	 2017-2019, frantsmn (https://github.com/frantsmn/userscripts)
// ==/UserScript==

const regionCodes = {
    'Москва': 'msk',
    'Санкт-Петербург': 'spb',
    'Екатеринбург': 'ekb',
    'Новосибирск': 'nsk',
    'Брест': 'brest',
    'Витебск': 'vitebsk',
    'Гомель': 'gomel',
    'Гродно': 'grodno',
    'Могилев': 'mogilev',
    'Минск': 'minsk',
    'Полоцк и Новополоцк': 'polotsk',
}

//Запуск функций по таймауту
setTimeout(function run() {

    tableImprove();
    commentsTableImprove()
    checkContacts();
    restyleBlog();
    categoryTableImprove();
    categoryPageImprove();
    landingTableImprove();
    commentsTableImprove();
    deleteGalleryHelper();
    makePhotoPreviewsBigger();

    setTimeout(run, 1000);
}, 1000);


//ПУНКТЫ ГЛАВНОГО МЕНЮ открываются как обычные ссылки (не в фрейме)
$("#admin-nav").find('a.admin-nav-item').each(function () {
    $(this).removeClass("admin-nav-item");
});


//ОПРЕДЕЛЕНИЕ ТИПА РЕДАКТИРУЕМОЙ СТРАНИЦЫ
const pageType = new class PageType {
    constructor() { }
    getType() {
        console.log('Отладка скрипта [Daroo - content-blocks.user.js] : Определение типа страницы — PageType.getType()');
        switch (true) {
            case $('input#product__token').length > 0:
                return "product";
            case $('input#supplier__token').length > 0:
                return "supplier";
            default:
                return "product";
        }
    }
    getText() {
        console.log('Отладка скрипта [Daroo - content-blocks.user.js] : Определение типа страницы — PageType.getText()');
        switch (true) {
            case $('input#product__token').length > 0:
                return "карточка товара";
            case $('input#supplier__token').length > 0:
                return "карточка партнера";
            default:
                return "карточка товара";
        }
    }
}


//======================================================================================================== tableImprove
//Ссылки на редактирование страниц карточек и цен в таблицах + ссылки на страницу товара из таблицы топов

function tableImprove() {

    //Добавление кнопок редактирования для таблицы карточек товаров
    const grid = $("#grid_results_product_grid tbody");
    if (grid.length && !grid.find('tr:first').hasClass('edit-link-added')) {
        console.log('[Daroo - Mamager.user.js] : Добавление кнопок редактирования для таблицы карточек товаров');
        grid
            .find('tr[id*=grid-row-]')
            .each(function () {
                const regex = /[0-9]*$/gm;
                const id = regex.exec(this.id)[0];
                $(this)
                    .addClass('edit-link-added') //Присваеваем каждой строчке (а не таблице), т.к. результаты могут быть подгружены динамически
                    .find('td:last')
                    .html(`<a href="/manager/product/edit/${id}" target="_blank"><input type="button" value="Edit" style="width: 100%; padding: 2px;" class="btn btn-primary btn-sm"></a>`);
            });
    }

    //Добавление кнопок редактирования для цен карточки товара
    const grid2 = $("#tab-prices #product-contents");
    if (grid2.length && !grid2.hasClass("edit-links-added")) {
        console.log('[Daroo - Mamager.user.js] : Добавление кнопок редактирования для цен карточки товара');
        grid2
            .addClass("edit-links-added")
            .find("tr")
            .each(function () {
                if ($(this).attr('data-sort-id')) {
                    $(this)
                        .find('td:last')
                        .html(`<a href="/manager/price/edit/${$(this).attr('data-sort-id')}" target="_blank"><input type="button" value="Edit" style="width:50px;" class="btn btn-sm btn-primary"></a>`);
                }
            });
    }

    //Добавление кнопок редактирования для таблицы цен на странице карточки товара
    const grid3 = $('#grid_results_product_price_search_grid tbody');
    if (grid3.length && !grid3.find('tr:first').hasClass("edit-link-added")) {
        console.log('[Daroo - Mamager.user.js] : Добавление кнопок редактирования для таблицы цен на странице карточки товара');
        grid3
            .find('tr[id*=grid-row-]')
            .each(function () {
                const regex = /[0-9]*$/gm;
                const id = regex.exec(this.id)[0];
                $(this)
                    .addClass('edit-link-added') //Присваеваем каждой строчке (а не таблице), т.к. результаты могут быть подгружены динамически
                    .find('td:last')
                    .html(`<a href="/manager/price/edit/${id}" target="_blank"><input type="button" value="Edit" style="width: 100%; padding: 2px;" class="btn btn-primary btn-sm"></a>`);
            });
    }

    //Исправления для таблицы топов
    const rows = $('#existent-list tr');
    if ($('#top-form').length && rows.length) {

        //#1 Добавление кнопок перехода на страницу товара из таблицы топов
        rows.each(function () {
            if (!$(this).hasClass('open-link-added')) {
                console.log('[Daroo - Mamager.user.js] : Добавление кнопки перехода на страницу товара из таблицы топов');
                $(this)
                    .addClass("open-link-added") //Присваеваем каждой строчке (а не таблице), т.к. результаты могут быть подгружены динамически
                    .find(".route")
                    .prepend(`<a href="/${regionCodes[$("#select2--container").attr('title').trim()]}/${$(this).find(".route").text().trim()}" target="_blank" style="display:inline-block;"><input type="button" value="Open" style="margin-left:2px; width:45px; height:20px;" class="btn btn-xs btn-primary"></a>`);
            }
        });
    }

}

//======================================================================================================== categoryTableImprove

function categoryTableImprove() {
    if ($("#grid_results_taxonomy_grid").length && !$("#grid_results_taxonomy_grid").hasClass("improved")) {

        $("#grid_results_taxonomy_grid tbody").find("tr").each(function () {
            let id = $(this).attr("id") ? parseInt(($(this).attr("id")).slice(9)) : '';
            let route = $(this).find("td.ig-grid-cell-router-route").html() ? $(this).find("td.ig-grid-cell-router-route").html().trim() : '';
            let primaryCategory = $(this).find("td.ig-grid-cell-ct-name").length && $(this).find("td.ig-grid-cell-ct-name").html().includes(' ...... ') ? true : false;
            let secondaryCategory = $(this).find("td.ig-grid-cell-ct-name").length && $(this).find("td.ig-grid-cell-ct-name").html().includes(' ............ ') ? true : false;
            let tertiaryCategory = $(this).find("td.ig-grid-cell-ct-name").length && $(this).find("td.ig-grid-cell-ct-name").html().includes(' .................. ') ? true : false;
            let categoryName = $(this).find("td.ig-grid-cell-ct-name").length ? $(this).find("td.ig-grid-cell-ct-name").html().replace(/\./g, '').trim() : '';

            $(this).find("td:last-child div").prepend('<a href="/manager/category/product/edit/' + id + '" target="_blank"><input type="button" value="Edit" style="margin:0px; width:50px; height:22px;" class="btn btn-primary btn-xs"/></a>')
                .css({
                    "width": "auto"
                });
            $(this).find("button[title='Редактирование']").each(function () {
                $(this).remove();
            });
            $(this).find("td.ig-grid-cell-router-route").html('<a href="http://' + window.location.hostname + '/minsk/' + route + '" target="_blank">' + route + '</a>');

            if (!categoryName.includes('...') && !/.*Каталог.*/.test(categoryName) && !/.*Без категории.*/.test(categoryName) && !/.*Акции и скидки.*/.test(categoryName) && !/.*Акции и скидки.*/.test(categoryName) && !/.*Подарочные наборы.*/.test(categoryName)) {
                $(this).find("td.ig-grid-cell-ct-name").html("<span>" + categoryName + "</span>");

                if (primaryCategory) {
                    $(this).find("td.ig-grid-cell-ct-name").css({
                        "font-size": "14px",
                        "font-weight": "bold",
                        "background-color": "rgba(46, 108, 162, 0.30)",
                        "border-top": "1px solid black"
                    });
                }
                if (secondaryCategory) {
                    $(this).find("td.ig-grid-cell-ct-name").css({
                        "font-size": "14px",
                        "padding-left": "30px",
                        "background-color": "rgba(46, 108, 162, 0.10)"
                    });
                }
                if (tertiaryCategory) {
                    $(this).find("td.ig-grid-cell-ct-name").css({
                        "font-style": "italic",
                        "padding-left": "60px",
                        "background-color": "rgba(46, 108, 162, 0.01)"
                    });
                }
            } else {
                $(this).find("td.ig-grid-cell-ct-name").html("<span>" + categoryName + "</span>");
                $(this).find("td.ig-grid-cell-ct-name").css({
                    "color": "lightgrey"
                });
            }
        });
        $("#grid_results_taxonomy_grid").addClass("improved");
    }
}

//======================================================================================================== commentsTableImprove

function commentsTableImprove() {
    if ($("#grid_results_comments_grid").length && !$("#grid_results_comments_grid .lasttr").length) {
        $("#grid_results_comments_grid").addClass("improved");

        GM_addStyle(`

thead tr{
	display: table;
	width: 100%;
}

tbody{
	display: flex;
	flex-flow: column nowrap;
}

tbody td{
    width: auto !important;
    min-width: 80px !important;
}

tbody td.ig-grid-cell-pdt-usageCondition{
     min-width: 200px !important;
}

tbody td.ig-grid-cell-commentsPrice-comment {
     min-width: 400px !important;
}

tbody td:nth-child(2){
    min-width: 20px !important;
}

tbody td:first-child{
	display: none;
}

tbody td.ig-grid-cell-commentsPrice-rating{
	font-size: 30px;
	opacity: 0.6;
	text-align: center;
	transition: opacity 0.2s ease;
}

tbody tr:hover > td.ig-grid-cell-commentsPrice-rating{
	opacity: 1;
}

.lasttr {
	display: block !important;
	height: 100px !important;
	position: absolute !important;
	top: -25px !important;
	right: 0 !important;
	background: none !important;
}

.lasttr td {
	border: none;
	display: block !important;
}



/* Serice classes */

.good-bg {
	background: rgba(38, 255, 0, .2);
}

.soso-bg {
	background: rgba(255, 221, 0, .2);
}

.bad-bg {
	background: rgba(244, 137, 137, .2);
}


.good-sh {
	box-shadow: inset 0px 0px 3px 3px  rgba(38, 255, 0, .4);
}

.soso-sh {
	box-shadow: inset 0px 0px 3px 3px  rgba(255, 221, 0, .4);
}

.bad-sh {
	box-shadow: inset 0px 0px 3px 3px rgba(244, 137, 137, .4);
}`);

        $("#grid_results_comments_grid tbody").find("tr").each(function () {
            var id = $(this).attr("id") ? Number(($(this).attr("id")).slice(9)) : '';
            $(this).find("td:last-child div").prepend('<a href="/manager/comments/edit/' + id + '" target="_blank"><input type="button" value="Edit" value="Title" style="margin:0px; width:50px; height:22px;" class="btn btn-primary btn-xs"/></a>').css({
                "width": "auto"
            });
            $(this).find("button[title='Редактирование']").each(function () {
                $(this).remove();
            });

            $("#grid_results_comments_grid tbody").find("tr").last().addClass('lasttr');


            var statusCell = $(this).find('.ig-grid-cell-commentsPrice-status');
            var statusCellText = $(this).find('.ig-grid-cell-commentsPrice-status').text().trim();
            if (statusCellText == "Опубликован") {
                statusCell.addClass('good-bg');
            } else
                if (statusCellText == "Отказано в публикации") {
                    statusCell.addClass('bad-bg');
                } else
                    if (statusCellText == "На модерации") {
                        statusCell.addClass('soso-bg');
                    }

            var markCell = $(this).find('.ig-grid-cell-commentsPrice-rating');
            var markCellText = $(this).find('.ig-grid-cell-commentsPrice-rating').text().trim();
            if (markCellText == "5" || markCellText == "4") {
                markCell.addClass('good-sh');
            } else
                if (markCellText == "3") {
                    markCell.addClass('soso-sh');
                } else
                    if (markCellText == "2" || markCellText == "1" || markCellText == "0") {
                        markCell.addClass('bad-sh');
                    }
        });

    }
}

//======================================================================================================== landingTableImprove

function landingTableImprove() {
    if ($("#grid_results_landing_page_grid").length && !$("a.im-link").length) {
        $("#grid_results_landing_page_grid tbody").find("tr").each(function () {
            var id = $(this).attr("id") ? parseInt(($(this).attr("id")).slice(9)) : '';
            var url = "http://" + window.location.hostname + "/manager/landing/page/edit/" + id;
            $(this).find("td:last-child div").prepend('<a href="' + url + '" target="_blank" class="im-link"><input type="button" value="Edit" style="margin:0px; width:50px; height:22px;" class="btn btn-primary btn-xs"/></a>').css({
                "width": "auto"
            });
        });
    }
}

//======================================================================================================== categoryPageImprove

function categoryPageImprove() {
    if (!$('#category_router_route').hasClass("improved")) {
        var route = $('#category_router_route').val();
        $('#category_router_route')
            .after('<span id="category_router_route_link"><a style="border: solid 1px #c3c3c3;border-radius:  4px;padding: 5px 10px 4px;position:  relative;top: 3px;display: inline;" href="http://' + window.location.hostname + '/minsk/' + route + '" target="_blank">' + route + '</a></span>');
        $('#category_router_route').on('input', function () {
            var route = $('#category_router_route').val();
            $('#category_router_route_link')
                .html('<a style="border: solid 1px #c3c3c3;border-radius:  4px;padding: 5px 10px 4px;position:  relative;top: 3px;display: inline;" href="http://' + window.location.hostname + '/minsk/' + route + '" target="_blank">' + route + '</a>');
        });
        $('#category_router_route').addClass("improved");
    }
}

//======================================================================================================== checkContacts — Включает чекбокс контакта на цене, если он 1

function checkContacts() {
    if ($("#product_price_contact div.checkbox").length === 1 && !$("#product_price_contact div.checkbox").find("input:checkbox").prop("checked")) {
        $("#product_price_contact div.checkbox").find("input:checkbox").prop("checked", true);
        $("div#message").show().append('<div id="ok" class="alert alert-success checkbox-message" style="display:block !important; opacity:0.5; text-align:center;">Чекбокс контакта был включен! <b style="color:maroon">🡇 Сохраните изменения 🡇</b> <button class="btn btn-primary btn-block" id="save-contact" style="margin-top:10px;">Сохранить</button></div>');
        $(".checkbox-message").animate({
            opacity: "1"
        }, 700);
        $("button#save-contact").on('click', function () {
            $("#tab-contacts button.btn.btn-primary").click();
        });
    }
}

//======================================================================================================== restyleBlog

function restyleBlog() {

    if (/https:\/\/daroo*.*manager\/blog\/edit*.*/.test(window.location.href) && !$("ul#tabs").hasClass("restyled")) {
        $("ul#tabs").addClass("restyled");
        GM_addStyle(`
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

div.container h1{
display:none;
}

div.navbar-header{
z-index: -1 !important;
}

ul.navbar-right li{
z-index: 1 !important;
background-image: linear-gradient(to bottom,#3c3c3c 0,#222 100%) !important;
}

ul.navbar-right li:first-child:before{
content:"";
width: 50px;
height: 100%;
left:-50px;
position:absolute;
background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(47,47,47,0.93) 89%, rgba(47,47,47,1) 96%);
}

a#brand-name {
font-size: 22px;
margin-left: 210px;
border-bottom: dashed 2px #222;
transition: border-bottom .5s ease-out, color .5s ease-out;
position: absolute;
overflow: hidden;

}

a#brand-name:hover{
transition: all .2s ease-out;
color: white;
}

@keyframes slide {
from {
right: 100%;
}

to {
right: -100%;
}
}

.navbar-brand:before{
content: " ";
display: block;
background: linear-gradient(to right, rgba(36,36,36,1) 0%,rgba(36,36,36,0) 20%,rgba(36,36,36,0) 80%,rgba(36,36,36,1) 100%);
width: 100%;
height: 3px;
position: absolute;
bottom: 4px;
z-index: 99999;
right:0;
}

.navbar-brand:after{
content: " ";
display: block;
background: linear-gradient(to right, rgba(36,36,36,1) 1%,rgba(255,255,255,1) 50%,rgba(36,36,36,1) 100%);
width: 100%;
height: 1px;
position: absolute;
bottom: 5px;
right: 100%;
}

.navbar-brand:hover:after{
animation-name: slide;
animation-timing-function: cubic-bezier(.42,0,.58,1);
animation-duration: 1.2s;
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

/**/
/*		TAB SNIPPETS*/
/**/

div#tab-snippets table td img{
width: 504px !important;
height: 216px !important;
}
`);

        //Переключение вкладок на странице редактирования блога
        $("a[href='#gallery']").on("click", function () {
            $("form#product-block-cont").hide();
        });

        $("a[href='#snippets']").on("click", function () {
            $("form#product-block-cont").hide();
        });

        $("a[href='#main']").on("click", function () {
            $("form#product-block-cont").show();
        });

        $("div.navbar-header").html("<a class='navbar-brand' id='brand-name' href=" + $("#tab-main table tr:first-child td a").attr('href') + " target='_blank'>" + $(".container h1").html() + "</a>");
    }
}

//========================================================================================================
//Переход со страницы товара в редактор контент-блока

//Получить порядковый номер блока из URL
const number = function getBlockNumberFromUrl() {
    const params = new URLSearchParams(location.search)
    return params.get('editBlock') != null && params.get('editBlock').length ? params.get('editBlock') : null;
}();

//Перейти в редактирование соотв. блока
if (number) {
    if (pageType.getType() === 'product') {
        const blockId = $(`#tab-description #block-table tbody tr:eq(${number})`).data('sort-id');
        const itemId = $(`#tab-description #block-table tbody tr:eq(${number}) td[id*='content-block-edit']`).data('product-id');
        location.href = `https://${location.host}/manager/product-content-block/edit/${itemId}/${blockId}`;
    }
    if (pageType.getType() === 'supplier') {
        const blockId = $(`#supplier-blocks-contents tr:eq(${number})`).data('sort-id');
        const itemId = $(`#supplier-blocks-contents tr:eq(${number}) td[id*='content-block-edit']`).data('supplier-id');
        location.href = `https://${location.host}/manager/supplier-content-block/edit/${itemId}/${blockId}`;
    }
}

//========================================================================================================
//Помощник удаления галереи

function deleteGalleryHelper() {
    if (!$('#delete-galery-button').length) {
        $('#tab-images').prepend(`<button id="delete-galery-button" class="btn btn-danger">Удалить галерею</button>`);
        $('#delete-galery-button').on('click', function () {
            $('#tab-images').find('a.image-delete-btn.btn.btn-default.btn-xs').each(function () {
                var button = $(this);
                if (!button.parents('#tpl').length) {
                    $(this).click();
                }
            });
        });
    }
}


//========================================================================================================
//Большие превью в предпросмотре фотографий прикрепленных к комметарию

function makePhotoPreviewsBigger() {

    if (/https:\/\/daroo*.*manager\/comments\/edit*.*/.test(window.location.href) && document.querySelector('#tab-photos')) {

        if (document.querySelector('#tab-photos').classList.contains('previewfix') === false) {

            document.querySelectorAll('#tab-photos a.thumbnail img')
                .forEach(item => {
                    item.src = item.src.replace(/https:\/\/daroo\.by\/media\/cache\/small\//, 'http://');
                    item.width = 700;
                });

            document.querySelectorAll('#js-sort-image li')
                .forEach(item => {
                    item.classList.remove('col-md-3');
                });

            document.querySelector('#tab-photos').classList.add('previewfix');
            
        }

    }

}
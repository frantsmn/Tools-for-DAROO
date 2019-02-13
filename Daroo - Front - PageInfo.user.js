// ==UserScript==
// @name         Daroo - Front - PageInfo
// @namespace    PageInfo
// @version      5.2
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


$(function () {

	new class MetaPanel {
		constructor() {

			$('body').append(`
			<style>
		
			/*Меню*/
			#edit-info {
				position: absolute;
				top: 10px;
				right: 20px;
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
		
			.__a {
				color: orange;
			}
		
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
				width: 80px;
			}

			/*Панель*/
			#meta {
				padding: 7px 0px 4px 0px;
				border-bottom: 1px solid #ededed;
			}
			#meta table {
				width: 100%;
				margin: auto;
			}
			#meta table td:first-child {
				width: 90px;
				padding-right: 5px;
				line-height: 30px;
			}
			#meta table td:last-child,
			#meta table td:nth-child(3) {
				width: 150px;
				vertical-align: top;
				padding-left: 10px;
			}
			#meta input {
				width: 100% !important;
				height: 22px;
				border: solid #eaeaea 1px;
				border-radius: 2px;
				padding: 1px 3px 2px 3px;
				margin: 2px 0 0 2px;
			}
			#meta input:hover {
				border: 1px solid lightgrey;
			}
			#metatext-for-table {
				margin-left: 10px;
				height: 79px;
				margin-top: 2px;
				border: solid #eaeaea 1px;
				border-radius: 2px;
				resize: none;
			}
			#copyButton {
				height: 85px;
				margin-top: 2px;
				margin-left: 0px;
				background-color: white;
				cursor: pointer;
			}
			
			</style>
			`);

			//Определение типа страницы
			this.getPageType = () => {

				//Определение типа страницы по классу Product (карточка товара || ценовое предложение)
				if (typeof Product !== 'undefined') {
					switch (Product.get('type')) {
						case 'product':
							return {
								type: "product",
								str1: "Редактировать карточку товара",
								str2: "Карточка товара"
							}
						case 'price':
							return {
								type: "price",
								str1: "Редактировать ценовое предложение",
								str2: "Ценовое предложение"
							}
						default:
							break;
					}
				}

				//Определение типа страницы (карточка партнера)
				if ($('.card-partner').length)
					return {
						type: "supplier",
						str1: "Редактировать карточку партнера",
						str2: "Партнер"
					};

				//Определение типа страницы (запись блога)
				if (/(\/life\/)/.exec(window.location.href) !== null)
					return {
						type: "blog",
						str1: "Редактировать запись",
						str2: "Запись блога"
					};
			}

			const date = new Date().toLocaleDateString();
			const settings = GM_getValue("settings") ? GM_getValue("settings") : {
				show_meta: true
			};
			const page = {
				id: google_tag_params.local_id,
				url: window.location.href,
				type: this.getPageType(),
				hostname: window.location.hostname
			};

			if (page.id == null) {
				alert("Пожалуйста, обновите страницу для полноценной работы вспомогательных скриптов. Если данная ошибка появляется слишком часто, сообщите об этом разработчику скрипта DAROO-Front-PageInfo \n ERROR:\n local_id = " + google_tag_params.local_id + "\n page.id = " + page.id);
			}

			//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
			//МЕНЮ

			$("div.nav").append(`
				<div id="edit-info">
					<div id="page-meta-info" class="page-menu-el">Мета</div>
					<div id="page-id-info" class="page-menu-el">ID: <input value="${google_tag_params.local_id}"></div>
					<div id="page-url-info" class="page-menu-el">URL: <input value="${window.location.pathname.split("/").slice(-1)[0]}"></div>
				</div>
			`);

			$("#page-id-info, #page-url-info").mouseenter(function () {
				$(this).find('input').select();
			});

			//Ссылка на каноническую страницу (если есть тег canonical)
			$("head").find("link[rel='canonical']").each(function () {
				$('#page-url-info').after(`
					<div id="page-canonical-info" class="page-menu-el clone">
						<a href="${$(this).attr('href')}" target="_blank">Каноническая:</a><input value="${$(this).attr('href').split("/").slice(-1)[0]}">
					</div>
				`);
			});

			//Кнопка редактирования страницы в меню
			if (page.type) {
				$("#edit-info").append(`<a id="edit-button" href="/manager/${page.type.type}/edit/${google_tag_params.local_id}" target="_blank" class="page-menu-el">${page.type.str1}</a>`);
				$("#page-canonical-info").mouseenter(function () {
					$("#page-canonical-info input").select();
				});
			}

			const meta = `
			<div id="meta">
				<table>
					<tr>
						<td><b>Title:</b><br>
						<b>Description:</b><br>
						<b>Keywords:</b></td>
		
						<td><input value="${$("title").html()}"><br>
						<input value="${$('meta[name="description"]').attr('content')}"><br>
						<input value="${$('meta[name="keywords"]').attr('content')}"></td>
						
						<td><textarea id="metatext-for-table">` + document.location.href + '&#9;' + $("title").html() + '&#9;' + $("h1").html().replace(/\r?\n/g, "") + '&#9;' + $('meta[name="description"]').attr('content') + '&#9;' + date + `</textarea></td>
						<td><button id="copyButton" class="page-menu-el">Скопировать для вставки в Google Таблицы</button></td>
					</tr>
				</table>
			</div>
			`;

			//Отображаем блок Meta согласно настройкам
			if (settings.show_meta) {
				$("div.textBlock").prepend(meta);
				$("#page-meta-info").addClass("__a");
				copying_by_button();
			}

			//Отображаем/прячем блок Meta по кнопке
			$("#page-meta-info").click(function () {
				if (!$("#meta").length) {
					$("div.textBlock").prepend(meta);
					$("#page-meta-info").addClass("__a");
					copying_by_button();
					settings.show_meta = true;
					GM_setValue("settings", settings);
				} else {
					$("#meta").remove();
					$("#page-meta-info").removeClass("__a");
					settings.show_meta = false;
					GM_setValue("settings", settings);
				}
			});

			//Функция копирования meta-информации для вставки в Google Таблицы
			function copying_by_button() {
				var textarea = document.getElementById("metatext-for-table");
				var copyButton = document.getElementById("copyButton");
				try {
					copyButton.addEventListener('click', function (e) {
						textarea.select();
						document.execCommand('copy');
					});
				} catch (e) {}
			}

		}
	}



	//#####################################################
	//Кнопки редактирования цен в аккордеон цен на карточке
	new class PriceEditButton {
		constructor() {
			$('body').append(`
				<style>
			
				.edit-price {
					display: block;
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%);
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
			
				.edit-price:hover {
					background-color: rgba(0, 0, 0, 0.8);
					border: solid 1px rgba(255, 255, 255, 0.8);
				}

				</style>
			`);

			$("div.accordion-content-buy").each(function () {
				$(this).after(`<a class="edit-price" href="/manager/price/edit/${$(this).find("a.btn-2").attr("href").split("/").slice(-1)[0]}" target="_blank" title="Редактировать цену"></a>`);
			});
		}
	}


	//################################################
	//Вспомогательные элементы на сниппете КТ и набора
	new class SnippetElements {
		constructor() {
			$('body').append(`
				<style>
			
				.catalog-card-image .edit-card {
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
			
				.catalog-card-image .edit-card:hover {
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
			
				.jsonInput:hover {
					background-color: rgba(0, 0, 0, 0.8);
					border: solid 1px rgba(255, 255, 255, 0.8);
				}
			
				</style>
			`);

			$(document)
				.ready(function () {
					$(".catalog-card:not(.penAdded), .big-catalog-card:not(.penAdded)").each(function () {
						addEditButton(this);
						addTextarea(this);
					});
				})
				.on('mouseenter', ".catalog-card:not(.penAdded)", function () {
					$(".catalog-card:not(.penAdded), .big-catalog-card:not(.penAdded)").each(function () {
						addEditButton(this);
						addTextarea(this);
					});
				});

			//Функция добавляет textarea c json-инорфмацией для рассылки
			function addTextarea(item) {
				let _ = $(item);
				if (!_.hasClass("jsonInputAdded")) {
					const data = JSON.stringify({
						title: _.find('.cc-name p').text(),
						image: _.find('.catalog-card-image a img').attr('data-src'),
						link: _.find('.catalog-card-image a')[0].href,
						isNew: _.find('.catalog-card-statuses').has('.cc-new').length ? true : false,
						isSet: _.find('.catalog-card-statuses').has('.cc-set').length ? true : false,
						discount: _.find('.catalog-card-statuses').has('.cc-promo').length ? _.find('.catalog-card-image a .cc-promo').text() : false,
						price: _.find('.catalog-card-content .cc-price').text().replace(/\n?/g, ""),
						partner: _.find('.catalog-card-content .cc-partner').text(),
						rating: _.find('.catalog-card-content .cc-popularity').has('.cc-rating').length ? _.find('.catalog-card-content .cc-popularity .cc-rating').text() : 'Рейтинг 4/5',
					});

					const a = $(document.createElement('input'))
						.val(data)
						.addClass('jsonInput')
						.hover(function () {
							$(this).select();
						});
					_.addClass("jsonInputAdded").find(".catalog-card-statuses").append(a);
				}
			}

			//Функция добавляет кнопку редактирования карточки товара
			function addEditButton(item) {
				let _ = $(item);
				if (!_.hasClass("penAdded")) {
					let id = _.data("card-id");
					_.addClass("penAdded").find(".catalog-card-statuses").append(`<a class="edit-card" href="/manager/product/edit/${id}" target="_blank"></a>`);
				}
			}
		}
	}


	//###########################################
	//Ссылка на скачивание баннеров (на КП/КТ/ЦП)
	new class BannerDownloadLink {
		constructor() {
			$('body').append(`
				<style>

				#banner-url {
					float: right;
					position: relative;
					margin-bottom: -75px;
					margin-top: 5px;
					margin-right: 5px;
					padding: 5px;
					background: rgba(52, 52, 52, 0.7);
					border: solid 1px gray;
					border-radius: 3px;
					z-index: 999999 !important;
					opacity: .5;
					transition: .2s ease opacity;
				}

				#banner-url:hover {
					opacity: 1;
				}

				#banner-url a {
					color: white;
					transition: .2s ease color;
				}

				#banner-url a:hover {
					color: orange;
				}

				#banner-url input {
					height: 30px;
					width: 100%;
					box-sizing: border-box;
					color: white;
					background: #000;
					border: solid 1px gray;
					border-radius: 3px;
					margin-top: 4px;
					padding: 0 0 0 5px;
				}

				</style>
			`);

			//Добавить разметку для КТ/ЦП
			// if (page.type.type && page.type.type === 'product' || page.type.type === 'price')
			$("ul.details-slider")
				.find('li')
				.each(function () {
					$(this).prepend(`
						<div id="banner-url">
							<a href="${$(this).find('img').attr('src')}" target="_blank" download>Сохранить изображение</a><br>
							<input value="${$(this).find('img').attr('src')}">
						</div>
				`);
				});

			//Добавить разметку для КП
			// if (page.type.type && page.type.type === 'supplier')
			$('div.card-partner div.box-img')
				.each(function () {
					$(this).prepend(`
						<div id="banner-url">
							<a href="${$(this).find('img').attr('src')}" target="_blank" download>Сохранить изображение</a><br>
							<input value="${$(this).find('img').attr('src')}">
						</div>
					`);
				});

			$("#banner-url input").mouseenter(function () {
				$("#banner-url input").select();
			});
		}
	}


	//########################
	//Счетчик цен (на баннере)
	new class PricesCounter {
		constructor() {
			$('body').append(`
				<style>

				#prices-counter {
					position: absolute;
					margin-top: 5px;
					margin-left: 5px;
					padding: 5px;
					background: rgba(52, 52, 52, 0.7);
					color: white;
					border: solid gray 1px;
					border-radius: 3px;
					z-index: 9999999 !important;
					opacity: .5;
					transition: .2s ease opacity;
				}
				
				#prices-counter:hover {
					opacity: 1;
				}
				
				#prices-counter div {
					background-color: #000;
					margin-top: 4px;
					border-radius: 3px;
					border: solid gray 1px;
					padding: 4px 6px;
				}
				
				#prices-counter span {
					font-weight: bold;
					color: orange;
				}
				
				</style>
			`);

			let prices = 0;
			let promos = 0;
			$('.accordion-content [itemprop="offers"]').each(function () {
				prices++;
				if ($(this).find('.accordion-content-discount').children().length)
					promos++;
			});

			$('ul.details-slider').prepend(`

				<div id="prices-counter">Счетчик цен
					<div>
						Акций: <span>${promos}</span><br>
						Обычных: <span>${prices-promos}</span><br>
						Всего: <span>${prices}</span>
					</div>
				</div>
	
			`);
		}
	}


	//####################################
	//Кнопки редактирования контент-блоков
	new class ContentBlockButtons {
		constructor() {
			$('body').append(`
				<style>
				/* Кнопка редактирования контент-блока */
				.content-block-button {
					position: absolute;
					top: 0;
					right: 0;
					display: block;
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
				
				.content-block-button:hover {
					background-color: rgba(0, 0, 0, 0.8);
					border: solid 1px rgba(255, 255, 255, 0.8);
				}

				/* Подсветка контент-блока */
				.button-hovered {
					background-color: #e9edff;
					border-radius: 5px;
				}

				.detail-content > div {
					transition: background-color .2s ease;
				}
				</style>
			`);

			//Счетчик блоков
			let counter = 0;
			$('.detail-content:first > div')
				.each(function () {
					//Текущий контент-блок
					let block = $(this);
					//Если блок не является блоком со списком цен
					if (!block.has('.detail-order-panel').length) {
						counter++;
						block.append(`
							<a class="content-block-button" href="https://${window.location.hostname}/manager/${page.type.type}/edit/${google_tag_params.local_id}?editBlock=${counter}" title="Редактировать контент-блок #${counter}" target="_blank"></a>
						`)
							.css('position', 'relative')
							.on('hover', '.content-block-button', function () {
								block.addClass('button-hovered');
							})
							.on('mouseout', '.content-block-button', function () {
								block.removeClass('button-hovered');
							});
					}
				});
		}
	}

	/* END */
});
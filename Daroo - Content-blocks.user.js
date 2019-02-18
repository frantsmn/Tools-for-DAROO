// ==UserScript==
// @name         Daroo - Content-blocks
// @namespace    Content-blocks
// @version      3.8
// @include      *daroo*.*/manager/*
// @description  Парсинг документа на заголовки, META-заголовки и контент-блоки с последующей их вставкой в текстовый редактор сайта.
// @updateURL 	 https://github.com/frantsmn/userscripts/raw/master/Daroo%20-%20Content-blocks.user.js
// @author       Frants Mitskun
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license	 	 MIT
// @copyright 	 2017-2019, frantsmn (https://github.com/frantsmn/Tools-for-DAROO)
// ==/UserScript==

// GM_deleteValue("settings");

$(document).ready(function () {

	GM_addStyle(`

	/* Панель результата парсинга */
	#rezultPanel {
		overflow: auto;
		background: rgba(255, 255, 255, 0.90);
		position: fixed;
		border: solid 1px lightgray;
		box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		padding: 10px;
		z-index: 9999 !important;
		display: none;
		max-width: 370px;
		max-height: 750px;
		user-select: none;
	}

	#rezultPanel .first-row {
		padding: 0 0 5px 0;
		font-weight: bold;
		font-size: 17px;
		line-height: 21px;
	}

	#rezultPanel .row {
		border-radius: 3px;
		border: solid 1px lightgray;
		margin: 2px 0 0 0;
		padding: 5px;
		background-color: #f9f9f9;
	}

	#rezultPanel .row span {
		display: inline-block;
		min-width: 10px;
		padding: 3px 7px;
		margin-right: 2px;
		font-size: 12px;
		font-weight: 700;
		line-height: 1;
		color: #fff;
		white-space: nowrap;
		vertical-align: middle;
		background-color: #6c757d;
		border-radius: 3px;
	}

	#rezultPanel .row span.seo {
		background-color: #007bff;
	}

	#rezultPanel .row span.text {
		background-color: #28a745;
	}

	#rezultPanel button {
		margin: 0 0 0 10px;
		float: right;
	}

	#rezultPanel button.paste-meta-info-button,
	#rezultPanel button.paste-lid-text-button,
	#rezultPanel button.add-new-banner-button {
		min-width: 150px;
		height: 30px;
		margin: 5px 0 0 5px;
		clear: right;
	}

	#rezultPanel button.add-new-banner-button {
		margin-top: 0px;
	}

	#rezultPanel .close {
		font-size: 30px;
		margin-top: -5px;
		margin-left: 10px;
	}

	/* textarea в меню для парсера */
	div#doc-textarea-holder {
		position: absolute;
	}

	div#doc-textarea-holder #doc-text {
		display: none;
		margin-top: 1px;
		width: 250px;
		height: 150px;
		padding: 5px;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
	}

`);

	//ОПРЕДЕЛЕНИЕ ТИПА РЕДАКТИРУЕМОЙ СТРАНИЦЫ
	const pageType = new class PageType {
		constructor() {
			//Если есть хеш, то проверять его, если нет, то проверяем путь
			const str = window.location.hash.length ? window.location.hash : window.location.pathname;

			switch (true) {
				case /product/.exec(str) !== null:
					this.type = 'product';
					this.text = 'карточка товара';
					console.log(`[Daroo - content-blocks.user.js] : Определение типа страницы > ${this.type}, ${this.text}`);
					return;
				case /supplier/.exec(str) !== null:
					this.type = 'supplier';
					this.text = 'карточка партнера';
					console.log(`[Daroo - content-blocks.user.js] : Определение типа страницы > ${this.type}, ${this.text}`);
					return;
				default:
					this.type = 'unknown type';
					this.text = '<span style="color:red;">неизвестный тип страницы</span>';
					console.log(`[Daroo - content-blocks.user.js] : Определение типа страницы > ${this.type}, ${this.text}`);
					return
			}
		}
	}

	//===============================================
	// __________
	// \______   \_____ _______  ______ ___________
	//  |     ___/\__  \\_  __ \/  ___// __ \_  __ \
	//  |    |     / __ \|  | \/\___ \\  ___/|  | \/
	//  |____|    (____  /__|  /____  >\___  >__|
	//                 \/           \/     \/
	//===============================================

	class Menu {
		constructor() {
			$("ul.top-nav").prepend(`
			<li data-toggle="dropdown" id="doc-textarea-dropdown">
				<a href="#" id="doc-textarea-button" aria-expanded="false"><i class="fa fa-file-word-o"></i> Разобрать документ</a>
				<div id="doc-textarea-holder"></div>
			</li>
	`);

			//Клик на кнопку "Разобрать документ"
			$("#doc-textarea-button").click(function () {

				console.log('[Daroo - content-blocks.user.js] : Нажатие на кнопку "Разобрать документ"');

				//Создаем поле для текста с пояснением в tooltip о типе карточки
				$("#doc-textarea-holder").html(`<textarea id='doc-text' placeholder='Вставьте содержимое документа в это поле' data-toggle='tooltip' data-trigger='manual' data-html='true' data-placement='left' data-original-title='Текст будет разобран как <b>${pageType.text}</b>'></textarea>`);


				$("#doc-text").fadeIn(1, function () {

						console.log('[Daroo - content-blocks.user.js] : Коллбэк — отображение tooltip к полю ввода');

						$(this).focus().tooltip('show');
					})
					//Передаем содержимое поля парсеру при input и скрываем поле
					.on("input", function () {

						console.log('[Daroo - content-blocks.user.js] : Коллбэк — парсинг и работа с панелью результата');

						//Парсить содержимое поля
						parser.parse($(this).val());

						//Очистить панель результата
						panel.removeRows();

						//Добавить на панель результата инф. о кол-ве найденных контент-блоков
						panel.addBlocksCounter(parser.blocks.length);

						//Добавить на панель результата кнопку вставки заголовков
						panel.addMetaRow(parser.meta.titlesHtml);

						//Добавить на панель результата кнопку вставки лида
						panel.addLidTextRow(parser.meta.lid);

						//Добавить на панель результата контент-блоки
						panel.addRezultRows(parser.blocks);

						//Показать панель результата
						panel.show();

						//Скрыть tooltip
						$(this).delay(50).tooltip('hide').fadeOut(0);

					})
					//Скрываем поле для текста при focusout
					.on("focusout", function () {
						$("#doc-text").delay(50).tooltip('hide').fadeOut(0);
					});
			});
		}
	}

	class Panel {
		constructor() {

			//Координаты панели на странице из settings
			let settings = GM_getValue("settings") ? GM_getValue("settings") : {
				offset: {
					top: 50,
					left: 600
				}
			}

			$("body").prepend(`
			<div id='rezultPanel'>
				<div class='first-row'>
					<button type='button' class='close'>×</button>
					<span></span>
				</div>
				<div id='rows'></div>
				<div class='form-actions'></div>
			</div>
		`);

			console.log('[Daroo - content-blocks.user.js] : Панель результата добавлена к body c offset > ' + settings);

			$("#rezultPanel")
				.draggable()
				.offset(settings.offset)
				//Сохранять положение панели на экране
				.on('mouseup', function () {
					settings.offset = $(this).offset();
					GM_setValue("settings", settings);
					console.log('[Daroo - content-blocks.user.js] : Объект settings в storage после сохранения по mouseup > ' + GM_getValue("settings"));
				})
				//Закрывать по клику на крестик
				.on('click', '.close', function () {
					$("#rezultPanel").hide();
					$("#rezultPanel .row:not(first-child)").remove();
				})
				.on('click', '.paste-meta-info-button', function () {

					if (pageType.type === "product") {

						//Заголовки
						$("input#product_translations_ru_name").css("border-color", "#00c14b").val(parser.meta.title_for_catalog);
						$("input#product_translations_ru_header").css("border-color", "#00c14b").val(parser.meta.h1);
						$("input#product_translations_ru_marketingName").css("border-color", "#00c14b").val(parser.meta.title_for_marketing);
						$("input#product_translations_ru_catalogName").css("border-color", "#00c14b").val(parser.meta.title_for_catalog);

						//SEO
						$("input#product_seo_translations_ru_metaTitle").css("border-color", "#00c14b").val(parser.meta.title);
						/*keywords*/
						$("textarea#product_seo_translations_ru_metaDescription").css("border-color", "#00c14b").val(parser.meta.description);
						$("input#product_seo_translations_ru_metaBreadcrumbs").css("border-color", "#00c14b").val(parser.meta.title_for_catalog);

						//Описание для маркетинга
						$("div.redactor-editor").hide();
						$("textarea#product_description_translations_ru_marketingDescription").css({
							"display": "block",
							"height": "100px",
							"padding": "10px"
						}).val(parser.meta.description_for_marketing);
					}

					if (pageType.type === "supplier") {

						//Заголовки
						$("input#supplier_translations_ru_name").css("border-color", "#00c14b").val(parser.meta.title_for_catalog);
						$("input#supplier_translations_ru_shortName").css("border-color", "#00c14b").val(parser.meta.title_for_catalog);

						//SEO
						$("input#supplier_seo_translations_ru_metaTitle").css("border-color", "#00c14b").val(parser.meta.title);
						/*keywords*/
						$("textarea#supplier_seo_translations_ru_metaDescription").css("border-color", "#00c14b").val(parser.meta.description);
						$("input#supplier_seo_translations_ru_metaBreadcrumbs").css("border-color", "#00c14b").val(parser.meta.title_for_catalog);

						//Аннотация (Лид для партнера) и описание для маркетинга
						$("div.redactor-editor").hide();
						$("textarea#supplier_description_translations_ru_annotation").css({
							"display": "block",
							"height": "100px",
							"padding": "10px"
						}).val(parser.meta.lid);
						$("textarea#supplier_description_translations_ru_marketingDescription").css({
							"display": "block",
							"height": "100px",
							"padding": "10px"
						}).val(parser.meta.description_for_marketing);
					}
				});

			//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
			//ФУНКЦИЯ ВСТАВКИ КОНТЕНТ-БЛОКА В РЕДАКТОР

			this.insertText = function (code, text) {

				//Выбор необходимого контент-блока из выпадайки
				function select(by, ru) {
					if (location.host === "daroo.by") {
						$("select#product_block_content").val(by).change();
						$("select#supplier_block_content").val(by).change();
					} else
					if (location.host === "daroo.ru") {
						$("select#product_block_content").val(ru).change();
						$("select#supplier_block_content").val(ru).change();
					}
				}

				//Выбираем необходимый блок согласно кодовому имени
				switch (code) {
					case "dk":
						select('two_columns', 'two_columns');
						break;
					case "ci":
						select('quote', 'quote');
						break;
					case "pv":
						select('advantages_opportunities', 'advantages_opportunities');
						break;
					case "ot":
						select('subtitle', 'subtitle');
						break;
					case "h":
						select('characteristics', 'Характеристики 3 блока');
						break;
					case "se":
						select('structure_milestones', 'Структура-этапы 2 блока');
						break;
					case "sv":
						select('service_block', 'service_block');
						break;
				}

				$("textarea#product_block_translations_ru_contents").val(text); //Вставляем текст в редактор кода для карточки товара или карточки партнера
				$(".redactor-editor").html(text); //Вставляем текст в визуальный редактор
			}
		}

		//Добавление строки с кнопкой вставки META-заголовков на панель результата
		addMetaRow(html) {
			if (html.length > 0) {
				$("#rezultPanel #rows").append(`<div class="row" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<span class='glyphicon glyphicon-stop' aria-hidden='true' style='color:#007bff;'></span> SEO-заголовки<br><span class='glyphicon glyphicon-stop' aria-hidden='true' style='color:#6c757d;'></span> Заголовки<br><span class='glyphicon glyphicon-stop' aria-hidden='true' style='color:#28a745;'></span> Тексты">${html}<button class="btn btn-xs btn-default paste-meta-info-button">Вставить заголовки</button></div>`);
				//Инициализируем tooltip'ы для панельки результата
				$('#rezultPanel [data-toggle="tooltip"]').tooltip({
					delay: {
						"show": 800,
						"hide": 100
					}
				});
			}
		}

		//Добавление строки с кнопкой вставки лида (текста для баннера) на панель результата
		addLidTextRow(text) {
			//Если есть Лид и мы на странице редактирования карточки
			if (text != null && pageType.type === "product") {

				$("#rezultPanel #rows").append('<div class="row"><b>Лид (текст для баннера)</b><button class="btn btn-xs btn-default add-new-banner-button">Добавить новый баннер</button><button class="btn btn-xs btn-default paste-lid-text-button">Вставить лид</button></div>');
				$("button.paste-lid-text-button").on("click", function () {
					$("input#productBanner_translations_ru_name").val("Баннер");
					$("textarea#productBanner_translations_ru_description").val(text);
					$("input.field-active[name='productBanner[visible]']").bootstrapSwitch("state", true);
				});

				$("button.add-new-banner-button").on("click", function () {
					if (pageType.type === "product")
						$("a[id='product-banner-create'] button").click();
				});

			}
		}

		//Добавление строк с кнопкой вставки текста (контент-блоков) на панель результата
		addRezultRows(blocks) {
			blocks.forEach((item, i) => {
				const insertText = this.insertText;

				$("#rezultPanel #rows").append(`
				<div class="row">${item.name}
					<button class="insert-text btn btn-xs btn-default" data-code="${item.code}" data-number="${i}">Вставить текст</button>
				</div>
			`);

				$("button.insert-text").on("click", function () {
					insertText($(this).data("code"), parser.blocks[$(this).data("number")].text); //Вставляет текст из соотв. объекта массива blocks
				});
			});
		}

		//Добавление инормации о кол-ве найденных контент-блоков
		addBlocksCounter(n) {
			$("#rezultPanel div.first-row span").html(`Найдено контент-блоков: ${n}`);
		}

		//Удаление строк с кнопокой вставки текста
		removeRows() {
			$("#rezultPanel .row:not(first-child)").remove();
		};

		show() {
			$("#rezultPanel").show();
		}
	}

	class Parser {

		constructor() {

			//Объект для META-информации и заголовков
			this.meta = {};
			/* = {
				title: "",
				description: "",
				keywords: "",
				title_for_catalog: "",
				h1: "",
				title_for_marketing: "",
				lid: "",
				description_for_marketing: "",
				titlesHtml: []
			}; */

			//Массив контент-блоков
			this.blocks = [];
			/* = [{
				code: "",
				name: "",
				text: ""
			}]; */

		}

		parse(text) {

			console.log('[Daroo - content-blocks.user.js] : Вызов parse() c параметром > ' + text);

			//Разбираем текст по строкам
			let strings = text.split('\n');

			//Очищаем объект мета-заголовков
			this.meta = {
				titlesHtml: "" //html для вставки на панель результата 
			};

			//Очищаем массив объектов контент-блоков
			this.blocks = [];

			//Поиск META-заголовков
			for (let i = 0; i <= strings.length; i++) {
				switch (true) {
					case /Title	/.test(strings[i]):
						this.meta.title = strings[i].slice(6);
						this.meta.titlesHtml += "<span class='seo'>Мета-заголовок</span>";
						break;
					case /Description	/.test(strings[i]):
						this.meta.description = strings[i].slice(12);
						this.meta.titlesHtml += "<span class='seo'>Мета-описание</span>";
						break;
					case /Заголовок в каталоге для товаров \/ Название партнера	/.test(strings[i]):
						this.meta.title_for_catalog = strings[i].slice(53);
						this.meta.titlesHtml += pageType.type === "product" ? "<span class='seo'>Крошка</span><span>Наименование</span><span>Наименование для каталога</span>" : "<span class='seo'>Крошка</span><span>Наименование</span><span>Краткое наименование</span>";
						break;
					case /Заголовок H1 \(только для товаров\)	/.test(strings[i]):
						this.meta.h1 = strings[i].slice(34);
						this.meta.titlesHtml += pageType.type === "product" ? "<span>Заголовок H1</span>" : "";
						break;
					case /Заголовок для рекламы \(только для товаров\) 25 символов	/.test(strings[i]):
						this.meta.title_for_marketing = strings[i].slice(55);
						this.meta.titlesHtml += pageType.type === "product" ? "<span>Наименование для маркетинга</span>" : "";
						break;
					case /Лид для товара \/ Лид для партнера/.test(strings[i]):
						while (strings[i + 1] === "")
							i++;
						this.meta.lid = strings[i + 1];
						this.meta.titlesHtml += pageType.type === "product" ? "" : "<span class='text'>Аннотация</span>";
						break;
					case /Описание для маркетинга/.test(strings[i]):
						while (strings[i + 1] === "")
							i++;
						this.meta.description_for_marketing = strings[i + 1];
						this.meta.titlesHtml += "<span class='text'>Описание для маркетинга</span>";
						break;
					case /.*-sh/.test(strings[i]): //Если нашли начало контент-блока
						i = Infinity; //Присваиваем i бесконечность, чтобы выйти из цикла и не проверять дальше текст
						break;
				}
			}

			//Формирование массива контент-блоков и добавление названий и кнопок контент-блоков на панельку результата
			strings.forEach((item, i) => {
				switch (item) {
					case "dk-sh":
						this.blocks.push({
							code: "dk",
							name: "Две колонки",
							text: blockConstructor.makeDkText(i, strings)
						});
						break;
					case "ci-sh":
						this.blocks.push({
							code: "ci",
							name: "Цитата",
							text: blockConstructor.makeCiText(i, strings)
						});
						break;
					case "pv-sh":
						this.blocks.push({
							code: "pv",
							name: "Преимущества/возможности",
							text: blockConstructor.makePvText(i, strings)
						});
						break;
					case "ot-sh":
						this.blocks.push({
							code: "ot",
							name: "Подзаголовок/Обычный текст",
							text: blockConstructor.makeOtText(i, strings)
						});
						break;
					case "h-sh":
						this.blocks.push({
							code: "h",
							name: "Характеристики",
							text: blockConstructor.makeHText(i, strings)
						});
						break;
					case "se-sh":
						this.blocks.push({
							code: "se",
							name: "Структура/этапы",
							text: blockConstructor.makeSeText(i, strings)
						});
						break;
					case "sv-sh":
						this.blocks.push({
							code: "sv",
							name: "Сервисные возможности",
							text: blockConstructor.makeSvText(i, strings)
						});
						break;
				}
			});
		}
	}

	class BlockConstructor {
		constructor() {}

		//===============================================================================================
		//  ДВЕ КОЛОНКИ
		//===============================================================================================
		makeDkText(start, arr) {
			arr = arr.slice(++start);
			return `<div class="detail-school-desc">
					<h2>${arr[0]}</h2>
					<ul>
						<li>
							<h3>${arr[1].split('\t')[0]}</h3>
								${arr[2].split('\t')[0]}
						</li>
						<li>
							<h3>${arr[1].split('\t')[1]}</h3>
							${arr[2].split('\t')[1]}
						</li>
					</ul>
				</div>`;
		}

		//===============================================================================================
		//  ЦИТАТА
		//===============================================================================================
		makeCiText(start, arr) {
			arr = arr.slice(++start);
			return `<div class="detail-quote-block clear">
				<div class="quoute-holder">
					<figure>
						<img src="http://images.daroo.gift/daroo.ru/gallery/editor/2016/03/22/56f0e860c3ba9.jpg">
					</figure>
					<div class="desc">
						<h2>${arr[0]}</h2>
						<p><em>${arr[1].split('\t')[1]}</em></p>
						<p>${arr[2].split('\t')[1]}</p>
					</div>
				</div>
			</div>`;
		}

		//===============================================================================================
		//  ПРЕИМУЩЕСТВА/ВОЗМОЖНОСТИ
		//===============================================================================================
		makePvText(start, arr) {
			arr = arr.slice(++start);
			const strings = [
				`<div class="detail-desc-features clear"><h2>${arr[0]}</h2><ul>`,
				`<li><figure><img src="http://images.daroo.gift/daroo.ru/gallery/editor/2018/01/12/5a58c61b50bf3.jpg"><br></figure><h3>${arr[2].split('\t')[0]}<br></h3>${arr[3].split('\t')[0]}</li>`,
				`<li><figure><img src="http://images.daroo.gift/daroo.ru/gallery/editor/2018/01/12/5a58c65320868.jpg"><br></figure><h3>${arr[2].split('\t')[1]}<br></h3>${arr[3].split('\t')[1]}</li>`,
				`<li><figure><img src="http://images.daroo.gift/daroo.ru/gallery/editor/2018/01/12/5a58c66630874.jpg"><br></figure><h3>${arr[2].split('\t')[2]}<br></h3>${arr[3].split('\t')[2]}</li>`,
				`</ul></div>`
			];

			let pv_text = strings[0] + strings[1] + strings[2] + strings[3];

			if (/\s/.test(arr[2].split('\t')[3]) || /\s/.test(arr[3].split('\t')[3])) { //Если в 4 колонке есть что-нибудь кроме пробелов, то
				pv_text += `<li><figure><img src="http://images.daroo.gift/daroo.ru/gallery/editor/2018/01/12/5a58c675a1fc8.jpg"><br></figure><h3>${arr[2].split('\t')[3]}<br></h3>${arr[3].split('\t')[3]}</li>`; //Добавляем строку с содержимым 4 колонки
			}

			pv_text += strings[4]; //Добавляем финальную строку

			return pv_text;
		}

		//===============================================================================================
		//  ОБЫЧНЫЙ ТЕКСТ ot-sh
		//===============================================================================================
		makeOtText(start, arr) {
			arr = arr.slice(++start);
			const regex = /^.{1,2}-sh$/g;
			arr.some(function (item, i) { //Подрезаем массив по началу следующего блока
				if (regex.test(item)) { //Если нашли начало следующего контент-блока
					arr = arr.slice(0, i); //Обрезаем массив
					return true; //Выходим из цикла
				}
			});


			for (let i = arr.length - 1; i >= 0; i--) { //Подрезаем пустые строки с конца массива
				if (!/\S/.test(arr[i]) || arr[i].length < 2) //Если строка состоит только из пробелов или её длина меньше 2 симв.
					arr = arr.slice(0, i); //То удаляем строку
				else
					break;
			}

			let ot_text = '<div class="full-desc"><div class="desc row-text">';
			if (arr[0].length) { //Если есть заголовок
				ot_text += `<h2>${arr[0]}</h2>`; //Вставляем заголовок в итоговый текст
			}
			for (let i = 1; i <= arr.length - 1; i++) {
				if (arr[i][0] == '●' || arr[i][0] == '•') {
					if (ot_text.slice(-11) === '<p><br></p>') { //Убираем лишний перенос (если есть), т.к. следующим в тексте идет список
						ot_text = ot_text.slice(0, -11);
					}
					ot_text += '<ul>';
					while (i <= arr.length - 1 && (arr[i][0] == '●' || arr[i][0] == '•')) {
						ot_text += '<li>' + arr[i].slice(2) + '</li>';
						i++;
					}
					ot_text += '</ul>';
				}
				if (i <= arr.length - 1 && arr[i].length > 2) //Если i не вышел за допустимое кол-во строк в массиве и текущая строка не пустая, то
					ot_text += `<p>${arr[i]}</p><p><br></p>`; //добавляем строку и добавляем перенос, т.к. следующим в тексте идет абзац, либо это конец контент-блока
			}
			ot_text += '</div></div>';
			return ot_text;
		}

		//===============================================================================================
		//  ХАРАКТЕРИСТИКИ h-sh
		//===============================================================================================
		makeHText(start, arr) {
			arr = arr.slice(++start);
			const regex = /^.{1,2}-sh$/g;
			arr.some(function (item, i) { //Подрезаем массив по началу следующего блока
				if (regex.test(item)) { //Если нашли начало следующего контент-блока
					arr = arr.slice(0, i); //Обрезаем массив
					return true; //Выходим из цикла
				}
			});

			for (let i = arr.length - 1; i >= 0; i--) { //Подрезаем пустые строки с конца массива
				if (!/\S/.test(arr[i]) || arr[i].length < 2) //Если строка состоит только из пробелов или её длина меньше 2 симв.
					arr = arr.slice(0, i); //То удаляем строку
				else
					break;
			}


			let h_text = '<div class="full-desc">';

			if (arr[0].length) { //Если есть заголовок
				h_text += `<div class="desc"><h2>${arr[0]}</h2></div>`; //Вставляем заголовок в итоговый текст
			}
			h_text += '<ul class="detail-list">';

			let last_side = "left";

			for (let i = 1; i <= arr.length - 1; i++) {
				if (i % 2) {
					if (last_side === "right") {
						h_text += `<li><div class="article"><div><h3>${arr[i].split('\t')[0]}</h3>${arr[i + 1].split('\t')[0]}</div></div><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd618120fc9.jpg"></figure></li>`;
						last_side = "left";
					} else {

						h_text += `<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd615ccb044.jpg"></figure><div class="article"><div><h3>${arr[i].split('\t')[1]}</h3>${arr[i + 1].split('\t')[1]}</div></div></li>`;
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
		makeSeText(start, arr) {
			arr = arr.slice(++start);
			const regex = /^.{1,2}-sh$/g;
			arr.some(function (item, i) { //Подрезаем массив по началу следующего блока
				if (regex.test(item)) { //Если нашли начало следующего контент-блока
					arr = arr.slice(0, i); //Обрезаем массив
					return true; //Выходим из цикла
				}
			});

			for (let i = arr.length - 1; i >= 0; i--) //Подрезаем пустые строки с конца массива
			{
				if (!/\S/.test(arr[i]) || arr[i].length < 2) //Если строка состоит только из пробелов или её длина меньше 2 симв.
					arr = arr.slice(0, i); //То удаляем строку
				else
					break;
			}

			let se_text = '<div class="full-desc full-left">';
			if (arr[0].length) //Если есть заголовок
				se_text += `<div class="desc"><h2>${arr[0]}</h2></div>`; //Вставляем заголовок в итоговый текст
			se_text += '<ul class="detail-list">';

			for (let i = 1; i <= arr.length - 1; i++) {
				se_text += `<li><figure><img src="http://images.daroo.gift/daroo.by/gallery/editor/2016/08/24/57bd615ccb044.jpg"></figure><div class="article"><div><h3>${arr[i].split('\t')[1]}</h3>${arr[i + 1].split('\t')[1]}</div></div></li>`;
				i++;
			}

			se_text += "</ul></div>";
			return se_text;
		}

		//===============================================================================================
		//  СЕРВИСНЫЕ ВОЗМОЖНОСТИ
		//===============================================================================================
		makeSvText(start, arr) {
			arr = arr.slice(++start);
			let sv_strings = {
				label: [],
				text: []
			};

			arr.forEach(function (item, i) {
				sv_strings.label[i] = item.split('\t')[0];
				sv_strings.text[i] = item.split('\t')[1];
			});

			let langLabels = [
				'',
				'Что взять с собой?',
				'С кем пойти?',
				'Сезон',
				'Расписание и время',
				'Безопасность',
				'Программа',
				'Дополнительные возможности',
				'Возраст'
			];

			let counter = 0; //Счетчик пары

			let sv_text = '<div class="detail-faq-block infoscroll-content"><div class="row">'; //Стартовая строка
			for (let j = 0; j <= sv_strings.label.length; j++) { //Перебираем найденные строки и собираем из найденного разметку
				if (sv_strings.text[j]) { //Если не пустая ячейка
					if (counter === 2) { //Если был заполнен второй столбец то,
						sv_text += '</div><div class="row">'; //Добавим теги перехода на следующюю строку
						counter = 0; //И обнулим счетчик
					}
					switch (sv_strings.label[j]) {
						case "Что взять с собой?":
							sv_text += `<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-01.png" alt="Портфель"></figure></dt><dd><div class="desc"><h3>${langLabels[1]}</h3><p>${sv_strings.text[j]}</p></div></dd></dl></div>`;
							break;
						case "С кем пойти?":
							sv_text += `<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-06.png" alt="Рукопожатие"></figure></dt><dd><div class="desc"><h3>${langLabels[2]}</h3><p>${sv_strings.text[j]}</p></div></dd></dl></div>`;
							break;
						case "Сезон":
							sv_text += `<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-02.png" alt="Календарь"></figure></dt><dd><div class="desc"><h3>${langLabels[3]}</h3><p>${sv_strings.text[j]}</p></div></dd></dl></div>`;
							break;
						case "Расписание и время":
							sv_text += `<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-03.png" alt="Настенные часы"></figure></dt><dd><div class="desc"><h3>${langLabels[4]}</h3><p>${sv_strings.text[j]}</p></div></dd></dl></div>`;
							break;
						case "Безопасность":
							sv_text += `<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-08.png" alt="Шлем"></figure></dt><dd><div class="desc"><h3>${langLabels[5]}</h3><p>${sv_strings.text[j]}</p></div></dd></dl></div>`;
							break;
						case "Программа":
							sv_text += `<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-04.png" alt="Список"></figure></dt><dd><div class="desc"><h3>${langLabels[6]}</h3><p>${sv_strings.text[j]}</p></div></dd></dl></div>`;
							break;
						case "Дополнительные возможности":
							sv_text += `<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-09.png" alt="Горячая кружка"></figure></dt><dd><div class="desc"><h3>${langLabels[7]}</h3><p>${sv_strings.text[j]}</p></div></dd></dl></div>`;
							break;
						case "Возраст":
							sv_text += `<div class="col"><dl><dt><figure><img src="/img/design/desktop/faq-img-05.png" alt="Люди"></figure></dt><dd><div class="desc"><h3>${langLabels[8]}</h3><p>${sv_strings.text[j]}</p></div></dd></dl></div>`;
							break;
					}
					counter++; //Счетчик для определения пары столбцов
				}
			}
			sv_text += '</div></div>'; //Финальная строка

			return sv_text;
		}
	}

	const parser = new Parser();
	const blockConstructor = new BlockConstructor();
	const menu = new Menu();
	const panel = new Panel();

});
// ==UserScript==
// @name         Daroo - Content-blocks
// @namespace    Content-blocks
// @version      1.0
// @include      *daroo*.*/manager/*
// @description  Добавляет формы для добавления основных контент блоков
// @author       Frants Mitskun
// ==/UserScript==

//ФУНКЦИЯ СОКРЫТИЯ ПАНЕЛЕЙ
function hide_all_panels()
{
    $("#dkPanel").hide();
    $("#hPanel").hide();
    $("#sePanel").hide();
    $("#pvPanel").hide();
    $("#svPanel").hide();
}

//ФУНКЦИЯ ОТОБРАЖАЕТ ПАНЕЛЬ ДЛЯ ВСТАВКИ РАЗМЕТКИ ЕСЛИ ОНА ЗАКРЫТА
function show_textarea()
{
    if($("#product_block_translations_ru_contents").css('display') == 'none')
        $("a.re-icon.re-html").click();
    if($("#product_price_block_translations_ru_contents").css('display') == 'none')
        $("a.re-icon.re-html").click();
}

//СТИЛИ
$("body").append("<style>#dkPanel, #hPanel, #sePanel, #pvPanel, #svPanel{height:auto; max-height:400px; max-width:900px; overflow: auto; background: white;" +
                 "border:solid 1px lightgray; box-shadow: 0px 0px 17px -1px rgba(0,0,0,0.5); border-radius:5px; padding:10px; z-index:9999 !important; /*margin-top:60px; margin-left:250px;*/ margin-top:460px; margin-left:290px; position:fixed; opacity:0.93;}"+
                 "#dkPanel input, #hPanel input, #sePanel input, #pvPanel input{width:161px; height:40px;} #svPanel input{width:450px; height:30px;}"+
                 "#hideSaveDk, #hideSaveH, #hideSaveSe, #hideSavePv, #hideSaveSv, #clearDk, #clearH, #clearSe, #clearPv, #clearSv{float: left; margin-right:10px;}"+
                 "#content-block-menu .dropdown-toggle:hover{color:red !important;} body{background-color:white !important;}</style>");

//МЕНЮ
$("ul.top-nav").prepend("<li style=\"\" id=\"content-block-menu\" class=\"dropdown-toggle\"" +
                        "data-toggle=\"dropdown\" role=\"button\">"+
                        "<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\" style=\"color:#999; font-size:14px; font-family:Helvetica,Arial,sans-serif\">" +
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

$("body").prepend( "<div id=\"dkPanel\"><table><tr><td colspan=\"2\" align=\"center\"><input type=\"text\" id=\"dkTitle\" placeholder=\"Заголовок\" style=\"width:180px; text-align:center;\"></td></tr>"+
                  "<tr><td><input type=\"text\" id=\"dkSubtitle1\" placeholder=\"Подзаголовок\" style=\"width:180px;\"><br><textarea id=\"dkText1\" cols=\"23\" rows=\"5\" placeholder=\"Текст\"></textarea></td>"+
                  "<td><input type=\"text\" id=\"dkSubtitle2\" placeholder=\"Подзаголовок\" style=\"width:180px;\"><br><textarea id=\"dkText2\" cols=\"23\" rows=\"5\" placeholder=\"Текст\"></textarea></td></tr>"+
                  "</table><div id=\"hideSaveDk\" class=\"btn btn-primary\">Сохранить и закрыть</div> <div id=\"clearDk\" class=\"btn btn-primary\">Очистить</div> <div id=\"closekb\" class=\"btn btn-primary\">Закрыть</div></div>" );
$( "#dkPanel" ).draggable();
$("#dk-sh").click(function() {

    hide_all_panels();
    show_textarea();
    $("#dkPanel").show();

    var string = window.location.href,
        substring = "ua";
    if(string.indexOf(substring) !== -1)
    {
        $("select#product_block_content").val('268').change();
        $("select#price_block_content").val('268').change();
        $("select#supplier_block_content").val('268').change();
    }
    else
    {
        $("select#product_block_content").val('5000246').change();
        $("select#price_block_content").val('5000246').change();
        $("select#supplier_block_content").val('5000246').change();
    }
});

$("#clearDk").click(function() {
    $("#dkPanel input").val("");
    $("#dkPanel textarea").val("");
    $("input").keyup();
});

$("#hideSaveDk").click(function() {
    $('.btn-primary:first-child').first().click();
    hide_all_panels();
});

//Собираем разметку
$('#dkPanel').keyup(function( event ){
    var strings = [
        "<div class=\"detail-school-desc\"><h2>" + $( "input[id='dkTitle']" ).val() + "</h2><ul>",
        "<li><h3>" + $( "input[id='dkSubtitle1']" ).val() + "</h3>" + $( "textarea[id='dkText1']" ).val() + "</li>",
        "<li><h3>" + $( "input[id='dkSubtitle2']" ).val() + "</h3>" + $( "textarea[id='dkText2']" ).val() + "</li>",
        "</ul></div>"
    ];

    var dkText = "";
    dkText += strings[0] + strings[1] + strings[2] + strings[3];

    /* Вставка текста в textarea */

    //if (lang == "ru"){
    $("textarea#product_block_translations_ru_contents").val(dkText);
    $("textarea#product_price_block_translations_ru_contents").val(dkText);
    //}
    //if (lang == "ua"){
    //$("textarea#product_block_translations_ua_contents").val(dkText);
    //$("textarea#product_price_block_translations_ua_contents").val(dkText);
    //}

});

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

//ХАРАКТЕРИСТИКИ (шахматный)

$( "body" ).prepend( "<div id=\"hPanel\"><table id=\"hTable\"><tr><td align=\"center\"><input type=\"text\" id=\"hTitle\" placeholder=\"Заголовок\" style=\"width:240px; text-align:center;\"></td></tr><tr class=\"h_right h_tr\"><td align=\"right\"><input type=\"text\" id=\"hSubtitle\" placeholder=\"Подзаголовок\"><br><textarea id=\"hDescText\" cols=\"20\" rows=\"5\" placeholder=\"Текст\"></textarea></td></tr>      </table>      <div id=\"hideSaveH\" class=\"btn btn-primary\">Сохранить и закрыть</div> <div id=\"clearH\" class=\"btn btn-primary\">Очистить</div> <div id=\"closekb\" class=\"btn btn-primary\">Закрыть</div></div>");
$( "#hPanel" ).draggable();
var h_right_block = "<tr class=\"h_right h_tr added-h-block\"><td align=\"right\"><input type=\"text\" id=\"hSubtitle\" placeholder=\"Подзаголовок\"><br><textarea id=\"hDescText\" cols=\"20\" rows=\"5\" placeholder=\"Текст\"></textarea></td></tr>";
var h_left_block = "<tr class=\"h_left h_tr added-h-block\"><td align=\"left\"><input type=\"text\" id=\"hSubtitle\" placeholder=\"Подзаголовок\"><br><textarea id=\"hDescText\" cols=\"20\" rows=\"5\" placeholder=\"Текст\"></textarea></td></tr>";

$("#h-sh").click(function() {

    hide_all_panels();
    show_textarea();
    $("#hPanel").show();

    var string = window.location.href,
        substring = "ua";
    if(string.indexOf(substring) !== -1)
    {
        $("select#product_block_content").val('276').change();
        $("select#price_block_content").val('276').change();
        $("select#supplier_block_content").val('276').change();
    }
    else
    {
        $("select#product_block_content").val('5000250').change();
        $("select#price_block_content").val('5000250').change();
        $("select#supplier_block_content").val('5000250').change();
    }
});

$("#clearH").click(function() {
    $("tr.added-h-block").remove();
    $("#hPanel input").val("");
    $("#hPanel textarea").val("");
    $("input").keyup();
});

$("#hideSaveH").click(function() {
    hide_all_panels();
    $('.btn-primary:first-child').first().click();
});

//Собираем разметку
$("#hPanel").keyup(function( event ){

    var hText = "<div class=\"full-desc\">"; 				//Стартовая строка
    if($(this).find("#hTitle").val() !== "")  			//Если есть заголовок, то херачим его в кучу
    {
        hText += "<div class=\"desc\"><h2>" + $( "input[id='hTitle']" ).val() + "</h2></div><ul class=\"detail-list\">";
    }
    else{													//Если загловка нет
        hText += "<ul class=\"detail-list\">"; 				//Тлен
    }

    $("tr.h_tr").each(function( index ) 					//Перебираем все поля (блоки), проверям их
                      {									//и добавляем соответствующую разметку

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


    // if (lang == "ru"){
    $("textarea#product_block_translations_ru_contents").val(hText);
    $("textarea#product_price_block_translations_ru_contents").val(hText);
    // }
    // if (lang == "ua"){
    // 	$("textarea#product_block_translations_ua_contents").val(hText);
    // 	$("textarea#product_price_block_translations_ua_contents").val(hText);
    // }

    addBlock(); //Добавялем на всякий еще один текстовый блок
    //Важно добавлять его после сбора строк, что бы поля не лезли в цикл перебора полей,
    //а то еще потом проверки писать на заполненность. Хуйня полная будет.

});

//Добавляет еще один, если последний был заполнен
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

$( "body" ).prepend( "<div id=\"sePanel\"><table style=\"padding-bottom:20px;\" id=\"seTable\"><tr><td align=\"center\"><input type=\"text\" id=\"seTitle\" placeholder=\"Заголовок\" style=\"text-align:center; width:240px;\"></td></tr><tr class=\"se_tr\"><td align=\"right\"><input type=\"text\" id=\"seSubtitle\" placeholder=\"Подзаголовок\"><br><textarea id=\"seDescText\" cols=\"20\" rows=\"5\" placeholder=\"Текст\"></textarea></td></tr></table><div id=\"hideSaveSe\" class=\"btn btn-primary\">Сохранить и закрыть</div> <div id=\"clearSe\" class=\"btn btn-primary\">Очистить</div> <div id=\"closekb\" class=\"btn btn-primary\">Закрыть</div></div>");
$( "#sePanel" ).draggable();
//Строки для добавления новых полей в окне инструмента
var se_block = "<tr class=\"se_tr added-se-block\"><td align=\"right\"><input type=\"text\" id=\"seSubtitle\" placeholder=\"Подзаголовок\"><br><textarea id=\"seDescText\" cols=\"20\" rows=\"5\" placeholder=\"Текст\"></textarea></td></tr>";

$("#se-sh").click(function() {

    hide_all_panels();
    show_textarea();
    $("#sePanel").show();

    var string = window.location.href,
        substring = "ua";
    if(string.indexOf(substring) !== -1)
    {
        $("select#product_block_content").val('274').change();
        $("select#price_block_content").val('274').change();
        $("select#supplier_block_content").val('274').change();
    }
    else
    {
        $("select#product_block_content").val('5000252').change();
        $("select#price_block_content").val('5000252').change();
        $("select#supplier_block_content").val('5000252').change();
    }
});

$("#clearSe").click(function() {
    $("tr.added-se-block").remove();
    $("#sePanel input").val("");
    $("#sePanel textarea").val("");
    $("input").keyup();
});

$("#hideSaveSe").click(function() {
    hide_all_panels();
    $('.btn-primary:first-child').first().click();
});

//Собираем разметку
$("#sePanel").keyup(function( event ){

    var seText = "<div class=\"full-desc full-left\">"; 				//Стартовая строка
    if($(this).find("#seTitle").val() !== "")  			//Если есть заголовок, то херачим его в кучу
    {
        seText += "<div class=\"desc\"><h2>" + $( "input[id='seTitle']" ).val() + "</h2></div><ul class=\"detail-list\">";
    }
    else{																						//Если загловка нет
        seText += "<ul class=\"detail-list\">"; 				//Тлен
    }

    $("tr.se_tr").each(function( index ) 						//Перебираем все поля (блоки), проверям их
                       {																								//и добавляем соответствующую разметку

        var seSubtitle = $(this).find("#seSubtitle").val(); 							//Заголовок блока
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

    seText += "</ul></div>"; //Финальная строка

    // if (lang == "ru"){
    $("textarea#product_block_translations_ru_contents").val(seText);
    $("textarea#product_price_block_translations_ru_contents").val(seText);
    // }
    // if (lang == "ua"){
    // 	$("textarea#product_block_translations_ua_contents").val(seText);
    // 	$("textarea#product_price_block_translations_ua_contents").val(seText);
    // }

    addBlockSe(); //Добавялем на всякий еще один текстовый блок
});

//Добавляет еще один, если последний был заполнен
function addBlockSe(){
    if($( "textarea[id='seDescText']" ).last().val() !== "")
    {
        $("#seTable").append(se_block);
        $("#sePanel").scrollTop($("#seTable").height());
    }
}

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

//ПРЕИМУЩЕСТВА/ВОЗМОЖНОСТИ (буллиты)

$( "body" ).prepend( "<div id=\"pvPanel\"><table style=\"padding-bottom:20px;\"><tr><td colspan=\"4\" align=\"center\"><input type=\"text\" id=\"pvTitle\" placeholder=\"Заголовок\" style=\"width:240px; text-align:center;\"></td></tr><tr><td><input type=\"text\" id=\"pvSubtitle1\" placeholder=\"Подзаголовок\"><Br><textarea id=\"pvText1\" cols=\"20\" rows=\"5\" placeholder=\"Описание\"></textarea></td><td><input type=\"text\" id=\"pvSubtitle2\" placeholder=\"Подзаголовок\"><Br><textarea id=\"pvText2\" cols=\"20\" rows=\"5\" placeholder=\"Описание\"></textarea></td><td><input type=\"text\" id=\"pvSubtitle3\" placeholder=\"Подзаголовок\"><Br><textarea id=\"pvText3\" cols=\"20\" rows=\"5\" placeholder=\"Описание\"></textarea></td><td><input type=\"text\" id=\"pvSubtitle4\" placeholder=\"Подзаголовок\"><Br><textarea id=\"pvText4\" cols=\"20\" rows=\"5\" placeholder=\"Описание\"></textarea></td></tr></table><div id=\"hideSavePv\" class=\"btn btn-primary\">Сохранить и закрыть</div><div id=\"clearPv\" class=\"btn btn-primary\">Очистить</div><div id=\"closekb\" class=\"btn btn-primary\">Закрыть</div></div>" );
$( "#pvPanel" ).draggable();
//Отображаем и прячем форму

$("#pv-sh").click(function() {

    hide_all_panels();
    show_textarea();
    $("#pvPanel").show();

    var string = window.location.href,
        substring = "ua";
    if(string.indexOf(substring) !== -1)
    {
        $("select#product_block_content").val('270').change();
        $("select#price_block_content").val('270').change();
        $("select#supplier_block_content").val('270').change();
    }
    else
    {
        $("select#product_block_content").val('5000248').change();
        $("select#price_block_content").val('5000248').change();
        $("select#supplier_block_content").val('5000248').change();
    }
});

$("#clearPv").click(function() {
    $("#pvPanel input").val("");
    $("#pvPanel textarea").val("");
    $("input").keyup();
});

$("#hideSavePv").click(function() {
    hide_all_panels();
    $('.btn-primary:first-child').first().click();
});

//Собираем разметку
$('#pvPanel').keyup(function( event ){

    var strings = [
        "<div class=\"detail-desc-features clear\"><h2>" + $( "input[id='pvTitle']" ).val() + "</h2><ul>",
        //1
        "<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg\"><br></figure><h3>" + $( "input[id='pvSubtitle1']" ).val() + "<br></h3>" + $( "textarea[id='pvText1']" ).val() + "</li>",
        //2
        "<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg\"><br></figure><h3>" + $( "input[id='pvSubtitle2']" ).val() + "<br></h3>" + $( "textarea[id='pvText2']" ).val() + "</li>",
        //3
        "<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg\"><br></figure><h3>" + $( "input[id='pvSubtitle3']" ).val() + "<br></h3>" + $( "textarea[id='pvText3']" ).val() + "</li>",
        //4
        "<li><figure><img src=\"http://images.daroo.gift/daroo.by/gallery/editor/2016/02/03/56b1e66d2ece6.jpg\"><br></figure><h3>" + $( "input[id='pvSubtitle4']" ).val() + "<br></h3>" + $( "textarea[id='pvText4']" ).val() + "</li>",
        //5
        "</ul></div>"
        //6
    ];

    var pvText = "";

    pvText += strings[0] + strings[1] + strings[2] + strings[3];
    if ($( "input[id='pvSubtitle4']" ).val() !== "" || $( "textarea[id='pvText4']" ).val() !== "") //Если в 4 колонке есть что-нибудь, то
    {
        pvText += strings[4]; //Добавляем строку с содержимым полей 4 колонки
    }
    pvText += strings[5]; //Добавляем финальную строку

    /* Вставка текста в textarea */

    //if (lang == "ru"){
    $("textarea#product_block_translations_ru_contents").val(pvText);
    $("textarea#product_price_block_translations_ru_contents").val(pvText);
    //}
    //if (lang == "ua"){
    //$("textarea#product_block_translations_ua_contents").val(pvText);
    //$("textarea#product_price_block_translations_ua_contents").val(pvText);
    //}
});

//▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

//СЕРВИСНЫЕ ВОЗМОЖНОСТИ

$( "body" ).prepend( "<div id=\"svPanel\"><input type=\"text\" tabindex=\"1\" id=\"check1\" placeholder=\"Что взять с собой?\"><Br><input type=\"text\" tabindex=\"2\" id=\"check2\" placeholder=\"C кем пойти?\"><Br><input type=\"text\" tabindex=\"3\" id=\"check3\" placeholder=\"Сезон\"><Br><input type=\"text\" tabindex=\"4\" id=\"check4\" placeholder=\"Сколько дарить\"><Br><input type=\"text\" tabindex=\"5\" id=\"check5\" placeholder=\"Расписание и время\"><Br><input type=\"text\" tabindex=\"6\" id=\"check6\" placeholder=\"Безопасность\"><Br><input type=\"text\" tabindex=\"7\" id=\"check7\" placeholder=\"Программа\"><Br><input type=\"text\" tabindex=\"8\" id=\"check8\" placeholder=\"Дополнительные возможности\"><Br><input type=\"text\" tabindex=\"9\" id=\"check9\" placeholder=\"Возраст\"><br><br><div id=\"hideSaveSv\" class=\"btn btn-primary\">Сохранить и закрыть</div> <div id=\"clearSv\" class=\"btn btn-primary\">Очистить</div> <div id=\"closekb\" class=\"btn btn-primary\">Закрыть</div></div>" );
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

var langLabels = [];

/*По умолчанию переводим лейблы на RU*/

for (i = 1; i <= 9; i++)
{
    langLabels[i] = ruLabels[i];
}

var lang = "ru";

//Отображаем и прячем форму

$("#sv-sh").click(function() {

    hide_all_panels();
    show_textarea();
    $("#svPanel").show();

    var string = window.location.href,
        substring = "ua";
    if(string.indexOf(substring) !== -1)
    {
        $("select#product_block_content").val('275').change();
        $("select#price_block_content").val('275').change();
        $("select#supplier_block_content").val('275').change();
    }
    else
    {
        $("select#product_block_content").val('5000253').change();
        $("select#price_block_content").val('5000253').change();
        $("select#supplier_block_content").val('5000253').change();
    }

});

$("#clearSv").click(function() {
    $("#svPanel input").val("");
    $("input").keyup();
});

$("#hideSaveSv").click(function() {
    hide_all_panels();
    $('.btn-primary:first-child').first().click();
});

/* Переводим лейблы для строк результата на UA */
$("button#ualang").click(function() {
    $(".ua-tab-button").click();
    $("button#ualang").addClass("selectedbutton");
    $("button#rulang").removeClass("selectedbutton");
    for (i = 0; i <= 9; i++)
    {
        langLabels[i] = uaLabels[i];
    }
    $("#svPanel input").each(function(){
        $(this).attr("placeholder", uaLabels[(($(this).attr('tabindex'))*1)]);
    });
    lang = "ua";
    $("input").keyup();
});

/* Переводим лейблы для строк результата на RU */
$("button#rulang").click(function() {
    $(".ru-tab-button").click();
    $("button#ualang").removeClass("selectedbutton");
    $("button#rulang").addClass("selectedbutton");
    for (i = 1; i <= 9; i++)
    {
        langLabels[i] = ruLabels[i];
    }
    $("#svPanel input").each(function(){
        $(this).attr("placeholder", ruLabels[(($(this).attr('tabindex'))*1)]);
    });
    lang = "ru";
    $("input").keyup();
});

//Собираем разметку
$("input").keyup(function( event ){

    var strings = [
        "<br><div class=\"detail-faq-block infoscroll-content\"><div class=\"row\">",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-01.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[1] + "</h3><p>" + $( "input[tabindex='1']" ).val() + "</p></div></dd></dl></div>",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-06.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[2] + "</h3><p>" + $( "input[tabindex='2']" ).val() + "</p></div></dd></dl></div>",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-02.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[3] + "</h3><p>" + $( "input[tabindex='3']" ).val() + "</p></div></dd></dl></div>",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-07.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[4] + "</h3><p>" + $( "input[tabindex='4']" ).val() + "</p></div></dd></dl></div>",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-03.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[5] + "</h3><p>" + $( "input[tabindex='5']" ).val() + "</p></div></dd></dl></div>",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-08.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[6] + "</h3><p>" + $( "input[tabindex='6']" ).val() + "</p></div></dd></dl></div>",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-04.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[7] + "</h3><p>" + $( "input[tabindex='7']" ).val() + "</p></div></dd></dl></div>",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-09.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[8] + "</h3><p>" + $( "input[tabindex='8']" ).val() + "</p></div></dd></dl></div>",
        "<div class=\"col\"><dl><dt><figure><img src=\"/img/design/desktop/faq-img-05.png\" alt=\"\"></figure></dt><dd><div class=\"desc\"><h3>" + langLabels[9] + "</h3><p>" + $( "input[tabindex='9']" ).val() + "</p></div></dd></dl></div>",
        "</div></div>",
        "</div><div class=\"row\">"
    ];

    var counter = 0;
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

    /* Вставка текста в textarea */

    if (lang == "ru"){
        $("textarea#product_block_translations_ru_contents").val(svText);
        $("textarea#product_price_block_translations_ru_contents").val(svText);
    }
    if (lang == "ua"){
        $("textarea#product_block_translations_ua_contents").val(svText);
        $("textarea#product_price_block_translations_ua_contents").val(svText);
    }

});

hide_all_panels(); //Скрываем все добавленные к body панели

//ВЫЗЫВАЕМ ФУНКЦИЮ СОКРЫТИЯ ПАНЕЛЕЙ ПО КНОПКЕ "ЗАКРЫТЬ"
$("div#closekb").click(function(){
    hide_all_panels();
});
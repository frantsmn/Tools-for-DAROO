//Предварительный объект для шаблона
const mail = {
    background : '',

    beforeDescription: {
        text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore aut nulla quod minus cupiditate temporibus consequatur omnis accusamus odio sapiente!',
    },

    banner: {
        image: 'https://daroo.by/img/lazy.svg',
        link: 'https://daroo.by/catalog',
    },

    afterDescription: {
        text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore aut nulla quod minus cupiditate temporibus consequatur omnis accusamus odio sapiente!',
    },

    promo: {
        code: '',
        text: 'Промокод действителен до ДД.ММ.ГГГГ включительно.<br>Скидка распространяется на все сертификаты.'
    },

    postDescription: {
        text: '',
    },

    items: [{
        title: '',
        image: '',
        link: '',
        isNew: '',
        discount: '',
        price: '',
        partner: '',
        rating: '',
        //Если позиция вторая в списке, то добавим переносы в табличке </tr><tr>
        isSecond: '',
    }],

    //Пример товара, заглушка для отображения в письме незаполненного поля
    itemTemplate: {
        title: 'Наименование товара',
        image: 'https://daroo.by/img/lazy.svg',
        link: 'https://daroo.by',
        isNew: true,
        discount: '25%',
        price: '10 руб. – 200 руб.',
        partner: 'Наименование партнера',
        rating: 'Рейтинг 4/5',
        //Если позиция вторая в списке, то добавим переносы в табличке </tr><tr>
        isSecond: '',
    },

    button: {
        title: 'Посмотреть еще',
        link: 'http://daroo.by/minsk/catalog',
    },

    year: new Date().getFullYear()

}

//Сбор данных с шаблона по готовности документа + функции для кнопок "Добавить/Удалить позицию"
$(document).ready(() => {

    //Клонирование формы товара в конструкторе по кнопке "Добавить позицию"
    $('#add-item').click(() => {
        let clone = $("#items-table .form-group:last").clone();
        let itempos = clone.data('itempos');
        ++itempos;

        clone.attr('data-itempos', itempos);
        clone.find('h5').text(`Позиция ${itempos}`);
        clone.find('input').val('');
        clone.appendTo('#items-table');
    });

    //Удаление формы товара в конструкторе по кнопке "Удалить позицию"
    $('#remove-item').click(() => {
        if ($("#items-table").children().length > 1) {
            $("#items-table .form-group:last").remove();
        } else {
            $("#items-table .form-group input").val('');
        }
    });

    collectData();
});

//Сбор данных с шаблона по нажатию кнопки
$('#constructor')
    .on('keyup', 'input, textarea:not([id*=result-])', collectData)
    .on('click', 'button', collectData);

//Функция собирает данные с заполненных форм и вставляет готовый шаблон во #view
function collectData() {
    let _ = mail;

    //Фон (картинка) для рассылки
    _.background = $('#background').val();

    //Текст перед баннером
    _.beforeDescription.text = $('#beforeDescription-text').val();

    //Баннер
    _.banner.image = $('#banner-image').val() ? $('#banner-image').val() : mail.banner.image;
    _.banner.link = $('#banner-link').val() ? $('#banner-link').val() : mail.banner.link;

    //Текст после баннера
    _.afterDescription.text = $('#afterDescription-text').val();

    //Промокод
    _.promo.code = $('#promo-code').val() ? $('#promo-code').val() : '';
    _.promo.text = $('#promo-text').val() ? $('#promo-text').val() : _.promo.text;

    //Товары
    _.items = [];
    $('.item-form').each(function (i = 0) {
        const input = $(this).find('input');
        if (input.val().length) {
            _.items[i] = JSON.parse($(this).find('input').val());
            //Если позиция вторая в списке, то в .isSecond = true
            if (i % 2) {
                _.items[i].isSecond = 'true';
            }
            
        } else {
            _.items[i] = Object.assign({}, _.itemTemplate);
            //Если позиция вторая в списке, то в .isSecond = true
            if (i % 2) {
                _.items[i].isSecond = 'true';
            }
        }
        i++;
    });

    //Кнопка
    _.button.link = $('#button-link').val() ? $('#button-link').val() : _.button.link;
    _.button.title = $('#button-title').val() ? $('#button-title').val() : 'Посмотреть еще';

    // Получаем шаблон
    let templateScript = $('#mail').html();
    // Функция Handlebars.compile принимает шаблон и возвращает новую функцию
    let template = Handlebars.compile(templateScript);
    // Формируем HTML и вставляем в документ
    $('#view').html(template(mail));
    //И вставляем в textarea
    $('#result-html').text(template(mail));
}

//###################################################################################

//Helper IF_OR для шаблонизатора
Handlebars.registerHelper('if_or', function (elem1, elem2, options) {
    if (Handlebars.Utils.isEmpty(elem1) && Handlebars.Utils.isEmpty(elem2)) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

//###################################################################################

//Предупреждение о закрытии/перезагрузке вкладки 
window.onbeforeunload = function (evt) {
	if (typeof evt == "undefined") {
		evt = window.event;
	}
	if (evt) {
		evt.returnValue = true;
	}
	return;
}
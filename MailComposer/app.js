Vue.component('item-component', {
    props: ['item'],
    template: '#item-component'
});


Vue.component('section-component', {
    props: ['section'],
    template: '#section-component'
});


var v = new Vue({
    el: '#app',
    data: {
        showBackground: true,
        background: 'http://lists.daroo.gift/mails/images/background.png',
        showHeader: true,
        showMenu: true,
        showTextBeforeBanner: false,
        textBeforeBanner: '',
        showBanner: true,
        bannerImage: 'http://lists.daroo.gift/mails/images/lazy.svg',
        bannerLink: 'https://daroo.by',
        showTextAfterBanner: false,
        textAfterBanner: '',
        showArticle: true,
        articleTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing quisquam animi dolor',
        articleText: 'Sint nulla recusandae quod laborum quisquam animi dolor. Illo, sapiente nulla doloribus enim, totam labore earum voluptas ipsa optio dignissimos cum omnis eum ut.Praesentium distinctio laborum, dolor beatae doloribus, quas dolore quia modi totam accusamus aut fuga similique corporis molestias vel esse harum blanditiis? Alias praesentium excepturi hic sint.',
        articleImage: 'http://lists.daroo.gift/mails/images/img.png',
        showPromoCode: true,
        promoCode: 'PROMOCODE',
        promoCodeText: 'Промокод действителен до <b>ДД.ММ.ГГГГ</b> включительно.<br>Скидка распространяется на все сертификаты.',
        showButton: true,
        buttonText: 'Посмотреть еще',
        buttonLink: 'https://daroo.by',
        sections: [{
            id: 0,
            title: '',
            items: [{
                id: 0,
                json: '',
                title: 'Наименование товара',
                image: 'https://daroo.by/img/lazy.svg',
                link: 'https://daroo.by',
                isNew: true,
                isSet: true,
                discount: '20%',
                price: '10 руб. – 200 руб.',
                partner: 'Наименование компании',
                rating: 'Рейтинг 4/5',
                even: false,
            }]
        }]

    },

    methods: {
        addSection: function (id) {
            this.sections.push({
                id: ++id,
                title: '',
                items: [{
                    id: 0,
                    json: '',
                    title: 'Наименование товара',
                    image: 'https://daroo.by/img/lazy.svg',
                    link: 'https://daroo.by',
                    isNew: true,
                    isSet: true,
                    discount: '20%',
                    price: '10 руб. – 200 руб.',
                    partner: 'Наименование компании',
                    rating: 'Рейтинг 4/5',
                    even: false
                }]
            });
        },
        removeSection: function (id) {
            this.sections = this.sections.filter(el => {
                return el.id !== id
            });
        },
        addItem: function (section, id) {
            section.items.push({
                id: ++id,
                json: '',
                title: 'Наименование товара',
                image: 'https://daroo.by/img/lazy.svg',
                link: 'https://daroo.by',
                isNew: true,
                isSet: true,
                discount: '20%',
                price: '10 руб. – 200 руб.',
                partner: 'Наименование компании',
                rating: 'Рейтинг 4/5',
                even: false
            });

            //Выставление метки нечетного/четного элемента
            let even = false;
            section.items.forEach(item => {
                item.even = even;
                even = !even;
            });
        },
        removeItem: function (section, id) {
            section.items = section.items.filter(el => {
                return el.id !== id
            });
            //Выставление метки нечетного/четного элемента
            let even = false;
            section.items.forEach(item => {
                item.even = even;
                even = !even;
            });
        },
        parseItemJSON: function (item) {
            let parsed = JSON.parse(item.json);
            item = Object.assign(item, parsed);
        }
    },

    updated: function () {
        this.$nextTick(function () {

            // console.log(v.$data);
            $('#result-html').text($('#view').html());

        });
    }
});




//###################################################################################

// //Предупреждение о закрытии/перезагрузке вкладки 
window.onbeforeunload = function (evt) {
    if (typeof evt == "undefined") {
        evt = window.event;
    }
    if (evt) {
        evt.returnValue = true;
    }
    return;
}
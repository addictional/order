import {Base64} from "./base64";
import * as Components from "./components";
import {User,Delivery} from "./user";
import IMask from "imask";
import css from "./css/style.scss";
import {DPD,IML} from "./parcel";
import {YandexMap} from "./ymap";
import {recalculateHeights} from "./functions"
const Mustache = require('mustache');
const Immutable = require('immutable');





class Order {
    constructor()
    {
        this.loader = new Components.LoaderLayout();
        this.data = null;
        this.__delivery = 0;
        this.__usedBonuses = 0;
        this.settings();
    }

    settings()
    {
        this.map = new YandexMap();
        this.user = new User();
        this.delivery = new Delivery();
        this.orderInfo = new Components.OrderInfo();
        this.bonusCardBlock = new Components.BonusCardArea();
        this.firstStep = new Components.FirstStep();
        this.deliveryBlock = new Components.DeliveryTypes();
        this.toDoorBlock = new Components.DeliveryToDoor();
        this.pvzButton = new Components.PvzButton();
    }

    init()
    {
        this.loader.show();
        this.setData()
            .then((data)=>{
                console.log(this.data);
                this.user.set(this.data);
                this.setComponents();
            });
    }

    setComponents(){
        new Promise((resolve,reject)=>{
            this.setEvents();
            this.firstStep.update({
                name : this.user.name,
                email: this.user.email,
                phone: this.user.phone,
                city: (this.delivery.city==null ? false : this.delivery.city),
                attribute: (this.user.isAuthorized() ? 'disabled': ''),
            });
            if(this.delivery.city  != null)
                this.delivery.getAvailableTypes()
                    .then((data)=>{
                        console.log(data);
                        let methods = {
                            TODOOR: false,
                            PICKUP: false,
                            tCheck : (this.delivery.method == 'TODOOR' ? 'checked' : ''),
                            pCheck : (this.delivery.method == 'PICKUP' ? 'checked' : '')
                        };
                        for(let key in data)
                            methods[key] = true;
                        this.deliveryBlock.update(methods);
                        resolve('next');
                    });
            else
                resolve('last');

        }).then((step)=>{
            if(step == 'next')
            {
                let selected =  this.showSelectedDeliverymethod();
                if(selected)
                {

                }
            }
            this.orderInfo.update({
                TotalPrice : this.data.get('TotalPrice'),
                Delivery: this.__delivery,
                Bonuses: this.user.getBonusCardInfo(),
                Discount: this.data.get('Discount'),
                FinalPrice: this.finalPrice
            });
            if(this.user.isAuthorized() && this.user.bonusCardExist())
            {
                this.bonusCardBlock.update(this.user.getBonusCardInfo());
                this.rangeSlider();
            }
            this.loader.hide();
        });
    }

    setData()
    {
        let _this = this;
        return new Promise((resolve,reject)=>{
            this.data = Immutable.Map(startOrderData);
            _this.getBonusInfo()
                .then((data)=>{
                    data.number = _this.data.get("bonusCard");
                    _this.data = _this.data.set('BonusCardInfo',data);
                    _this.data = _this.data.delete('bonusCard');
                    resolve('success');
                    });
        });
    }

    getDeliveryPrice(){
        return this.__delivery ;
    }

    getBonusInfo(){
        return $.ajax({
            url: "/local/components/weblooter/new_order/ajax.php",
            data: {
                method : 'bonusCardStatus',
                items: this.data.get('items'),
                bonusCard: this.data.get('bonusCard')
            },
            method: "GET",
            dataType: 'json'
        });
    }

    get finalPrice() {
        return this.data.get('TotalPrice')-this.data.get('Discount')-this.__usedBonuses+this.__delivery;
    }

    rangeSlider()
    {
        let _this = this;
        $("#wbl-range").ionRangeSlider({
            min: 0,
            max: this.data.get("BonusCardInfo").maxChequePoints,
            from: 0,
            onChange: function (data) {
                _this.__usedBonuses = data.from;
                _this.orderInfo.update({BonusPoints: data.from,FinalPrice: _this.finalPrice});
                document.querySelector('.wbl-range-input').value = _this.__usedBonuses;
            },
        });
        let rangeSlider = $("#wbl-range").data("ionRangeSlider");
        document.querySelector(".wbl-range-input").addEventListener("keypress",(e)=>{
            if(e.charCode >= 48 && e.charCode <= 57)
            {
                let val = parseInt(e.target.value.toString()+e.key.toString());
                if(val>parseInt(this.data.get("BonusCardInfo").maxChequePoints))
                    e.preventDefault();
            }
            else
                e.preventDefault()
        });
        document.querySelector(".wbl-range-input").addEventListener("keyup",(e)=>{
            _this.__usedBonuses = e.target.value;
            _this.orderInfo.update({BonusPoints:  _this.__usedBonuses,FinalPrice: _this.finalPrice});
            rangeSlider.update({from: _this.__usedBonuses});
        });
    }

    setEvents(){
        let _this = this;
        this.firstStep.addCallback(()=>{
            document.querySelector('[name="order-name-input"]').addEventListener('input',(e)=>{
                this.user.name = e.target.value;
            });
            document.querySelector('[name="order-email-input"]').addEventListener('input',(e)=>{
                this.user.email = e.target.value;
            });
            let phone = document.querySelector('[name="order-tel-input"]');
            phone.value = this.user.phone;
            let mask = IMask(phone,{
                mask: '+{7}(000)000-00-00'
            });
            mask.on('complete',()=>{
                this.user.phone = mask.value;
            });
            this.createInputAutocomplete();
        });
        this.deliveryBlock.addCallback(()=>{
            let inputArr  = document.querySelectorAll('input[name="delivery-method"]');
            for(let i = 0;i<inputArr.length;i++)
            {
                inputArr[i].addEventListener('click',(e)=>{
                    this.refreshDelivery();
                    this.delivery.method = e.target.value;
                    this.showSelectedDeliverymethod();
                })
            }
        })
        this.pvzButton.addCallback((element,mapLayer)=>{
            element.addEventListener('click',()=>{
                this.delivery.getAvailableTypes()
                    .then((data)=>{
                        _this.loader.show();
                        _this.map.destroyMap();
                        let arr = [];
                        for(let i = 0;i < data.PICKUP.length;i++)
                            arr[arr.length] = new IML(data.PICKUP[i],i+1);
                        _this.map.init(arr[0].getGeoCoordinates()[0],arr[0].getGeoCoordinates()[1]);
                        for(let i = 0;i < arr.length;i++)
                            _this.map.addPlacemark(arr[i]);
                        this.loader.hide();
                        mapLayer.classList.remove('hide');
                        recalculateHeights();
                    });
            });
            mapLayer.querySelector('#pvzmap').addEventListener('click',(e)=>{
            })
            mapLayer.querySelector('[data-modal-close]').addEventListener('click',()=>{
                    mapLayer.classList.add('hide');
            });
        });
        this.toDoorBlock.addCallback(()=>{
            $('#street-input').select2(
                {
                    'minimumInputLength': 3,
                    tags: true,
                    'language': {
                        'errorLoading': function () {
                            return 'Подготавливаем список...'
                        },
                        'searching': function () {
                            return 'Подготавливаем список...'
                        },
                        'inputTooShort': function () {
                            return 'Варианты появятся после ввода 3х первых букв улицы'
                        },
                        'noResults': function () {
                            return 'Такой улицы в базе не найдено'
                        },
                    },
                    'ajax': {
                        'url': '/ajax/wbl_get_streets_by_city.php',
                        'dataType': 'json',
                        'data': function (params) {
                            if (_this.delivery.city != '') {
                                return {
                                    q: _this.delivery.city + ', ' +
                                        params.term
                                }
                            }
                            else {
                                return false
                            }
                        },
                    },
                    'escapeMarkup': function (markup1) {
                        return markup1
                    },
                    'templateResult': function (street) {
                        //console.log(street);
                        return street.text
                    },
                    'templateSelection': function (street) {
                        return street.text;

                    },
                    'width': '100%',
                    'placeholder': 'Улица',
                }
            );
            $('#street-input').on("select2:select",(e)=>{
                _this.loader.show();
               let ob = _this.delivery.ob;
                ob.street = e.params.data.text;

                _this.delivery.getZip().then((data)=>{
                    console.log(data);
                    _this.loader.hide();
                })
            });
            document.querySelector('#house-input').addEventListener('input',(e)=>{
                this.loader.show();
                let ob = _this.delivery.ob
                ob.build = e.target.value;
                this.delivery.getZip().then((data)=>{
                    console.log(_this.delivery.ob);

                    this.loader.hide();
                })
            })
        });
    }


    refreshDelivery(){
        this.toDoorBlock.clear();
    }

    createInputAutocomplete(){
        let cityInput = $('#city-selector');
        let _this = this;
        cityInput.select2(
            {
                minimumInputLength: 3,
                language: {
                    errorLoading: function () {
                        return 'Подготавливаем список...'
                    },
                    searching: function () {
                        return 'Подготавливаем список...'
                    },
                    inputTooShort: function () {
                        return 'Варианты появятся после ввода 3х первых букв населенного пункта'
                    },
                    noResults: function () {
                        return 'Такого населенного пункта в базе не найдено'
                    },
                },
                ajax: {
                    url: '/ajax/wbl_get_locations_list.php',
                    dataType: 'json',
                    data: function (params) {
                        return {q: params.term}
                    },
                    processResult: function (data) {
                        return {
                            result: data
                        };
                    }

                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                templateResult: function (city) {
                    return city.text;
                },
                templateSelection: function (city) {
                    return city.text;
                },
                width: '100%',
                placeholder: '--Выберите населенный пункт--',
            }
        );
        cityInput.on('select2:select', function(e) {
            _this.refreshDelivery();
            _this.delivery.city = e.currentTarget.value;
            _this.delivery.getAvailableTypes()
                .then((data)=>{
                    console.log(data);
                    let methods = {
                        TODOOR: false,
                        PICKUP: false
                    };
                    for(let key in data)
                        methods[key] = true;
                    _this.deliveryBlock.update(methods);
                });
        });
    }

    showSelectedDeliverymethod(){
        if(this.delivery.method == 'TODOOR')
        {
            let de =this.delivery.ob;
            // console.log(this.delivery)
            // console.log(this.delivery.ob);
            this.toDoorBlock.update({
                street : de.street,
                build : de.build,
                block: de.block,
                flat: de.flat,
                index: this.delivery.index

            });
        }
        if(this.delivery.method == 'PICKUP')
            this.pvzButton.show();
        return this.delivery.method != null;
    }
}

let order = new Order();
order.init();
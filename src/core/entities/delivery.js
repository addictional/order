import Storage from "./storage";
import {App} from "../main";
import Utils from '../utils';
const isEmpty = Utils.empty;

import Boxberry from "../map/parcel_shop/boxberry";
import IML from "../map/parcel_shop/iml";

class DeliveryMethod {

    constructor(type = null){
        this.type = type;
        this._price = 0;
        this._threshold = 0;
        this.data = { ...this.structure, ...Storage.deliveryMethod };
        this._inited = false;
    }

    get structure(){
        return {};
    }

    pushData(){
        Storage.deliveryMethod = this.data;
    }

    clear(){
        Storage.deliveryMethod = {};
        this.data = this.structure;
    }

    get price(){
        return  this._price;
    }

    get threshold(){
        return this._threshold;
    }

    get ready() {
        return false;
    }

    get info() {
        return {};
    }

}

class CourierMethod extends DeliveryMethod{


    constructor(){
        super('TODOOR');
        this.company = 'IML'
    }


    get info() {
        return {
            street: this.street,
            build: this.build,
            block: this.block,
            flat: this.flat,
            remoteness: 10,
            index: Delivery.index,
            interval: "10:00-18:00",
            locationCode: this.__data.LocationCode,
            name:	this.__data.Name
        };
    }

    init(data){
        this.__data = data;
        console.log(this.__data);
        this.zone = data.ZONE;
        this.setPriceAndThreshold(this.zone);
        this.shippingDate = data.DATE_SHIPMENT;
        this.estimatedDeliveryDate = data.DAYS_FORMAT;
        this.date = data.DAYS_FORMAT;
    }

    setPriceAndThreshold(zone) {
        switch (zone) {
            case 'B':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'C':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'D':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'E':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'F':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'G':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'H':
                this._price = 700;
                this._threshold = 7000;
                break;
            case 'V1':
                this._price = 1000;
                this._threshold = 10000;
                break;
            case 'V2':
                this._price = 1000;
                this._threshold = 10000;
                break;
            case 'V3':
                this._price = 2500;
                this._threshold = 25000;
                break;
            case 'A':
                this._price = 200;
                this._threshold = 5000;
                break;
        }
    }

    get structure(){
        return {
            street: '',
            build: '',
            block: '',
            flat: '',
            deliveryCompany : ''
        };
    }

    set street(val){
        this.data = this.structure;
        this.data.street = val;
        this.pushData();
    }

    get street(){
        return this.data.street;
    }

    set build(val){
        this.data.build = val;
        this.pushData();
    }

    get build(){
        return this.data.build;
    }

    set block(val){
        this.data.block = val;
        this.pushData();
    }
    get block(){
        return this.data.block;
    }

    set flat(val){
        this.data.flat = val;
        this.pushData();
    }
    get flat(){
        return this.data.flat;
    }

    get Intervals(){
        //todo
    }

    get ready(){
        return this.data.build != '';
    }

    get availablePaymentMethods()
    {
        if(this.zone == "A")
        {
            return [
                {value: '11',text: 'курьеру на лапу'},
                {value: '13',text: 'онлайн'},
                {value: '12',text: 'курьеру картой на лапу'}
            ];
        }else
            return [
                {value: '13',text: 'онлайн'}
            ];
    }


}

class ParcelShopMethod extends DeliveryMethod{
    constructor(){
        super('PICKUP');
    }

    get structure(){
        return {
            number: '',
            address: '',
            geo: '',
            price: '',
            deliveryCompany : ''
        };
    }

    set number(val){
        this.data.number = val;
        this.pushData();
    }

    get number(){
        return this.data.number;
    }

}






const  Delivery  = {

    init(){
        this.__tempMethToDoor = {};
        this.methodInited = false;
        this.__availableTypes = {};
        this.__zip = {};
        this.__city = null;
        this.data = this.setData();
        this.data.ob = this.setOb();
        return true;
    },

    setData() {
        let data = {...this.structure,...Storage.delivery};
        return data;
    },

    setOb(){
        if (this.data.method == 'TODOOR' )
            return new CourierMethod();
        else if(this.data.method == 'PICKUP')
            return new ParcelShopMethod();
        else
            return new DeliveryMethod();
    },

    get method(){
        return this.data.ob;
    },


    get structure()
    {
        return {
            city: null,
            method: null,
            index: null,
            ob: {}
        };
    },

    get estimatedDate(){
        return this.method.date;
    },

    async setParcelShop(index){
        let types = await this.getAvailableTypes();
        this.method = types.PICKUP[index];
        return true;
    },

    pushData()
    {
        let temp = {...this.data};
        delete(temp.ob);
        Storage.delivery = this.data;
    },

    get price(){
        return this.method.price;
    },

    get threshold(){
            return this.method.threshold;
    },

    set city(val)
    {
        this.data = this.structure;
        this.data.ob = this.setOb();
        this.data.city = val;
        this.pushData();
    },

    get city()
    {
        return this.data.city;
    },

    get index(){
        return this.data.index;
    },

    set index(val){
        this.data.index = val;
        this.pushData();
    },

    set method(val){
        if(typeof val === 'string'){
            this.data.ob.clear();
            this.data.method = val;
            this.data.ob = this.setOb();
            this.pushData();
            if(val == 'TODOOR')
            {
                let temp = {};
                if(typeof this.__tempMethToDoor[this.city] != 'undefined')
                    temp = this.__tempMethToDoor[this.city];
                else
                {
                    let _this = this;
                    $.ajax({
                        url: App.params.ajaxUrl,
                        data: {
                            method: 'getDeliveryMethods',
                            address: this.city
                        },
                        dataType: 'json',
                        async: false,
                        success : function(data) {
                            temp = _this.setParcels(data);
                        }
                    });
                    this.__tempMethToDoor[this.city] = temp;
                }
                this.method.init(temp.TODOOR.iml);
            }
        }else {
            this.data.method = 'PICKUP';
            this.data.ob = val;
        }
    },



    get courierFullAddress(){
        return (!isEmpty(this.method.street) ? ', '+this.method.street : '')
            +(!isEmpty(this.method.build) ? ', дом '+this.method.build : '')
            +(!isEmpty(this.method.block) && !isEmpty(this.method.build) ?'/'+this.method.block : '')
            +(!isEmpty(this.method.flat) && !isEmpty(this.method.block)
            && !isEmpty(this.method.build) ?', '+this.method.flat : '');
    },


    async getAvailableTypes(){
        if(this.city == null)
            return (new Error('city empty'));
        let address = this.city;
        if(this.method.type == 'TODOOR')
        {
            address += this.courierFullAddress;
        }
        let index = await this._getZip(address);
        if(typeof this.__availableTypes[index] != 'undefined')
            return this.__availableTypes[index];
        let data  = await $.ajax({
            url: App.params.ajaxUrl,
            data: {
                method: 'getDeliveryMethods',
                address: this.city
            },
            dataType: 'json'
        });
        console.log(data);
        data = this.setParcels(data);
        if(this.method.type == 'TODOOR')
        {
                this.__tempMethToDoor[this.city] = data;
                this.method.init(data);
        }
        this.__availableTypes[index] = data;
        return data;
    },

    setParcels(data){
        let counter = 0;
        let newArr = {
            geo: [],
            TODOOR: {},
            PICKUP: []
        };
        for(let company in data )
        {
            if(company == 'geo')
                newArr.geo = data[company];
            if(typeof data[company].TODOOR != 'undefined'){
                let toDoor = data[company].TODOOR[0];
                newArr.TODOOR[company] =  toDoor;
            }
            if(typeof data[company].PICKUP != "undefined")
                for(let parcel in data[company].PICKUP)
                {
                    switch (company) {
                        case 'iml':
                            newArr.PICKUP.push(new IML(data[company].PICKUP[parcel],counter++));
                            break;
                        case 'boxberry':
                            newArr.PICKUP.push(new Boxberry(data[company].PICKUP[parcel],counter++));
                            break;
                    }
                }
        }
        for(let index in newArr) {
            if (index == "TODOOR" && typeof newArr[index].iml == 'undefined')
                delete (newArr[index]);
            if (index == "PICKUP" && newArr[index].length <= 0)
                delete (newArr[index]);
        }
        console.log('set parcel:',newArr);
        return newArr;
    },

    async _getZip(address){
        let data = null;
        if(typeof this.__zip[address.trim()] != 'undefined')
        {
            data =  this.__zip[address.trim()];
        }else{
            data  = await $.ajax({
                url: App.params.ajaxUrl,
                data: {method: 'getInfoByAddress',address:address},
                dataType: "json"
            });
            this.__zip[address.trim()] = data.postal_code;
        }
        this.index = this.__zip[address.trim()];
        return this.__zip[address.trim()];
    },

    async getZip(){
        let address = (this.city != null ? this.city : '');
        if(this.method.type == 'TODOOR'){
            address += this.courierFullAddress;
        }
        return await this._getZip(address);
    },
};



export {Delivery};
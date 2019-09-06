import {ParcelShop} from "./base";

class Boxberry extends ParcelShop
{

    get availablePaymentMethods(){
        let paymentMethods = [{value: 'cash',text:'Наличными'},]
        let data = this.placeMark;
        if(data.only_prepaid_orders == 1)
            return [{value: '13',text:'Онлайн'}];
        if(data.acquiring == 1)
            paymentMethods.push({value: '13',text:'онлайн'});
        return paymentMethods;
    }

    get estimatedDeliveryDate() {
        let date = new Date(this.placeMark.estimatedDelivery);
        return date.toISOString()
    }

    get date(){
        let date = new Date(this.placeMark.estimatedDelivery);
        let format = (num)=>{
            if(num<=9)
                return `0${num}`;
            else
                return num;
        };
        return `${format(date.getDate())}.${format(date.getMonth()+1)}.${date.getFullYear()}`;
    }



    toStandartFormat() {
        let result = {
            latitude :this.placeMark.latitude,
            longitude: this.placeMark.longitude,
            parcelType: 'boxberry',
            schedule: this.placeMark.work_shedule,
            address: this.placeMark.address_abbr,
            number: this.placeMark.code,
            logo: '/local/templates/ladyandgentleman/img/boxberry_logo.png',
            index: this.index,
            color: '#FF339F',
            cashlessPayment: this.placeMark.acquiring == 1,
            cashOnDelivery: this.placeMark.only_prepaid_orders == 0,
            fitting: this.placeMark.fitting,
            shippingDate: this.placeMark.shippingDate,
            estimatedDeliveryDate: this.placeMark.estimatedDelivery,
            price : this.placeMark.price,
            threshold: this.placeMark.threshold,
            paymentMethods: [
                {value: 'online',text:'онлайн'},
                {value: 'cash',text:'кэш'}
            ],
            dateDelivery: this.date,
            parcelShopCode: this.placeMark.code,
            howToGet: this.placeMark.how_to_get_to,
            addressAbbr: this.placeMark.address_abbr,
            zone: this.placeMark.tariff_zone,
            imgPointer: "/local/templates/ladyandgentleman/img/boxberry_placemark.png",
            imgPointerOffset: [0, 0],
            imgPointerSize: [25, 33],
            imgActivePointer: '/local/templates/ladyandgentleman/img/boxberry_placemark_opened.png',
            imgActivePointerSize: [42, 56],
            imgActivePointerOffset: [-9, -25]
        };
        return result;
    }
}

export default Boxberry;
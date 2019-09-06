import {ParcelShop} from "./base";

class IML extends ParcelShop{
    /**
     *
     * @returns {string}
     */

    get date(){
         return this.placeMark.DAYS_FORMAT;
    }

    get availablePaymentMethods(){
        let payments = [];
        if(this.placeMark.PaymentCard != 0)
            payments.push({value: '13',text :"Картой онлайн"});
        if(this.placeMark.ZONE != "A")
        {
            return [{value: '13',text :"Картой онлайн"}];
        }
        return payments;

    }

    get threshold(){
        let zone = this.placeMark.ZONE;
        let result = 0;
        switch ( zone ){
            case 'B':
                result = 5000;
                break;
            case 'C':
                $('#wbl-limit-delivery').val(5000);
                result = 5000;
                break;
            case 'D':
                result = 5000;
                break;
            case 'E':
                result = 5000;
                break;
            case 'F':
                result = 5000;
                break;
            case 'G':
                result = 5000;
                break;
            case 'H':
                result = 7000;
                break;
            case 'V1':
                result = 10000;
                break;
            case 'V2':
                result = 10000;
                break;
            case 'V3':
                result = 25000;
                break;
        }
        return result;
    }

    fullAdressStr(){
        return this.placeMark.FormCity+', '+this.placeMark.Address;
    }

    checkDate() {
        if(typeof this.placeMark.CALENDARWORKC_BLOCK == 'undefined')
            return this.placeMark.DAYS_FORMAT;
        for (let i in this.placeMark.CALENDARWORKC_BLOCK) {
            if(this.placeMark.CALENDARWORKC_BLOCK[i] == this.placeMark.DAYS_FORMAT){
                let parsDate = this.placeMark.DAYS_FORMAT.split('.');
                this.placeMark.DAYS_FORMAT = moment(parsDate[2]+'-'+parsDate[1]+'-'+parsDate[0]).add('days', 1).format('DD.MM.YYYY');
                this.checkDate(this.placeMark.DAYS_FORMAT);
            }
        }
        return this.placeMark.DAYS_FORMAT;
    }

    toStandartFormat(){
        let result;
        let dateDelivery = this.checkDate();
        result = {
            latitude :this.placeMark.Latitude,
            longitude: this.placeMark.Longitude,
            parcelType: 'IML',
            schedule: this.placeMark.WorkMode,
            address: this.fullAdressStr(),
            number: this.index,
            logo: '/local/templates/ladyandgentleman/img/IML_logo.svg',
            index: this.index,
            dateDelivery: dateDelivery,
            logoSize: [34, 22],
            color: '#FFB833',
            price: this.placeMark.PRICE,
            imgPointer: '/local/templates/ladyandgentleman/img/IML_logo.svg',
            imgPointerOffset: [-17, 0],
            imgPointerSize: [34, 22],
            imgActivePointer: '/local/templates/ladyandgentleman/img/IML_logo.svg',
            imgActivePointerSize: [-17, 0],
            imgActivePointerOffset: [34, 22]
        };
        if(this.placeMark.PaymentCard != 0)
        {
            if(this.placeMark.PaymentCard > 0)
                result.cashlessPayment = true;
            result.cashOnDelivery = true;
        }
        if(this.placeMark.FittingRoom > 0)
            result.fitting = true;
        return result;
    }

    hasFitting() {
        return this.placeMark.FittingRoom > 0;
    }

    cashlessPayment() {
        return this.placeMark.PaymentCard > 0;
    }
}

export default IML;
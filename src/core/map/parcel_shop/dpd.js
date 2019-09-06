import {ParcelShop} from "./base";

class DPD extends ParcelShop
{
    getDeliveryPrice() {
        let price = 200;
        //todo
        return price;
    }

    toStandartFormat(){
        let result;
        result = {
            latitude :this.placeMark.address.geo.latitude,
            longitude: this.placeMark.address.geo.longitude,
            parcelType: 'DPD',
            schedule: this.placeMark.schedule,
            address: this.placeMark.address.fullAddress,
            number: 1,
            logo: '/local/templates/ladyandgentleman/img/dpd_logo.png',
            index: this.index,

        };
        if(this.placeMark.cashOnDelivery)
            result.cashOnDelivery = true;
        if(this.placeMark.fitting)
            result.fitting = true;
        return result;
    }
}
export default
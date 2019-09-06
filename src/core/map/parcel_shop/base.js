import template from './template.html';
import {OrderForm} from "../submitform";

const Mustache = require('mustache');
class ParcelShop {

       constructor(data, index) {
              this.index = index;
              this.placeMark = data;
              this.template = template;
              this.data = this.toStandartFormat();
              console.log(this.data);
       }

       get shippingDate() {
              return this.data.shippingDate;
       }


       clear(){}
       /**
        *
        * @param data
        * @param index
        */

       get imgPointer(){
              return this.data.imgPointer;
       }

       get company(){
              return this.data.parcelType;
       }

       get availablePaymentMethods(){
              return this.data.paymentMethods;
       }

       get info() {
              return {
                     code: this.data.parcelShopCode,
                     addressAbbr :  this.data.addressAbbr,
                     howToGet: this.data.howToGet ,
              };
       }


       /**
        *
        * @returns {{schedule: *, number: number, parcelType: string, address: string, latitude: *, logo: string, index: *, longitude: *,
        * cashOnDelivery: boolean, fitting: boolean}}
        *
        */

       toStandartFormat() {
              return {};
              /* have to be implemented*/
       }

       /**
        *
        * @returns {*[]}
        */

       getGeoCoordinates() {
              let data = this.data;
              return [data.latitude, data.longitude];
       }

       /**
        *
        * @returns {HTMLElement}
        */

       getDescription() {
              // let div = document.createElement('div');
              // div.className = 'pvz-list-item';
              console.log(this.template,this.data);
              return Mustache.render(this.template, this.data);
       }

       get estimatedDeliveryDate(){
              return new Date(this.data.estimatedDeliveryDate);
       }

       /**
        *
        * @returns {string}
        */

       get zone(){
              return this.data.zone;
       }

       get logo() {
              return this.data.logo;
       }

       get type() {
              return 'PICKUP';
       }

       get price(){
              return this.data.price;
       }

       get threshold(){
              return this.data.threshold;
       }


       getDeliveryPrice() {
              /* should be implemented */
              return false;
       }

       get color(){
              return this.data.color;
       }
       getIndex(){
              return this.data.index;
       }


       addTypeToSubmitForm() {
              OrderForm.SetValue('parcel-shop-type', this.type);
       }

       /**
        *
        * @returns {boolean}
        */

       hasFitting() {

              /*have to be implemented*/
              return this.data.fitting;
       }

       /**
        *
        * @returns {boolean}
        */


       cashlessPayment()
       {
              /*have to be implemented*/
              return this.data.cashlessPayment
       }


       get code(){
              return this.data.parcelShopCode;
       }

       get howToGet(){
              return this.data.howToGet;
       }
       get addressAbbr(){
              return this.data.addressAbbr;
       }

       get ready(){
              return true;
       }

       get imgPointer() {
              return {
                     passive:{
                            href: this.data.imgPointer,
                            size: this.data.imgPointerSize,
                            offset: this.data.imgPointerOffset
                     },
                     active:{
                            href: this.data.imgActivePointer,
                            size: this.data.imgActivePointerSize,
                            offset: this.data.imgActivePointerOffset
                     }
              };
       }
}




export {ParcelShop};

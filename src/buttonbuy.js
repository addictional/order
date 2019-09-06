if(typeof WBLcheckOrder == 'undefined')
    let WBLcheckOrder = (function(){
        let check = {
            error : {state:false,step:''},
            callback: {type:{}},
            elemEmptVal : function(params){
                let result;
                let elem = document.querySelector('[name='+params.name+']')
                if(elem == null)
                    return false;
                let val = elem.value;
                if(params.mask == undefined)
                    result = (val == '' || val == null) ? false : val;

                else if(typeof params.mask != 'object')
                    result = (val == '' || val == null || val == mask) ? false : val;
                if(!result){
                    this.dispatchHandler(params.name,{name: params.name,target: elem})
                    this.error = {state : true,name: params.name}
                }

                return result;
            },
            addEventListener: function(name,func){
                if(typeof this.callback.type[name] == 'undefined')
                    this.callback.type[name] = {length:0 ,handlers:{}}
                var index = this.callback.type[name].length++;
                this.callback.type[name].handlers[index] = func
            },
            dispatchHandler: function(name,event){
                if(typeof this.callback.type[name] != 'undefined'){
                    for (var i = this.callback.type[name].length - 1; i >= 0; i--) {
                        this.callback.type[name].handlers[i](event);
                    }}
            },
            addError: function(name){
                this.error = {state : true,name: name}
            },
            reformPrice: function(price){
                return parseInt(price.replace(' ',''))
            }
        }
        var BeforeClickButton = {
            ajax_uri : '/local/components/lg/sale.basket.basket/ajax_actions.php',
            hideButton: function(){
                document.querySelector('.wbl-finish-make-order-block').classList.add('hide');
            },
            showError: function(name,text){
                if(document.querySelector('label[for='+name+']') == null){
                    var label = document.createElement('label');
                    label.setAttribute('id',name+'-error')
                    label.setAttribute('for',name)
                    label.classList.add('wbl-input-error')
                    label.innerText = text
                    if(name == 'city-input'){
                        var parent = document.querySelector('[name='+name+']').parentElement
                        parent.insertBefore(label,parent.firstElementChild)
                    }
                    else
                        document.querySelector('[name='+name+']').parentElement.append(label);
                }else{
                    document.querySelector('label[for='+name+']').innerText = text
                    document.querySelector('label[for='+name+']').style=''
                }
                var elem = document.querySelector('[name='+name+']')
                elem.classList.remove('valid')
                elem.classList.add('wbl-input-error')

            },
            initEvents: function(){
                var _this = this
                check.addEventListener('order-name-input',function(e){
                    _this.showError(e.name,'Не заполнено поле');
                })
                check.addEventListener('order-tel-input',function(e){
                    _this.showError(e.name,'Не заполнено поле');
                })
                check.addEventListener('city-input',function(e){
                    _this.showError(e.name,'Не заполнено поле');
                })
                check.addEventListener('house-input',function(e){
                    _this.showError(e.name,'Не заполнено поле');
                })
                check.addEventListener('delievery-date-input',function(e){
                    _this.showError(e.name,'Не заполнено поле');
                })
                document.querySelector('span.select2-selection.select2-selection--single')
                    .addEventListener('click',function(){
                        if(document.querySelector('label[for=city-input]')!= null)
                        {
                            document.querySelector('label[for=city-input]').style = 'display: none'
                        }
                    })
            },
            checkNEPC : function(){
                check.elemEmptVal({name: 'order-name-input'})
                check.elemEmptVal({name: 'order-tel-input'})
                check.elemEmptVal({name: 'city-input'})
            },
            checkDelivery: function(){
                var list = document.querySelectorAll('[name=delivery-method]')
                for (var i = list.length - 1; i >= 0; i--) {
                    if(list[i].checked){
                        var checked = list[i].value;
                        break;
                    }
                }
                switch(checked){
                    case 'TODOOR':
                        check.elemEmptVal({name: 'house-input'})
                        check.elemEmptVal({name: 'delievery-date-input'})
                        break;
                    case 'PICKUP':
                        if(!check.elemEmptVal({name: 'selected-pvz-data'})){
                            this.hideButton()
                        }
                        break;
                }
            },
            setPrice:function(response){
                setTimeout(function(){
                    WBLOrder.priceBasket =  parseInt(response.price.BasePrice.replace(' ',''))
                    WBLOrder.priceDiscount = parseInt(response.price.Discount.replace(' ',''))
                    document.querySelector('[data-amount-base-sum] font').innerText = response.price.BasePrice
                    console.log(document.querySelector('[data-amount-base-sum] font').innerText)
                    document.querySelector('[data-amount-discount-sum] font').innerText =  response.price.Discount
                    console.log(document.querySelector('[data-amount-discount-sum] font').innerText )
                    var deliveryPrice = document.querySelector('[data-amount-delivery] font').innerText
                    console.log( document.querySelector('#finalResultPrice').innerText)
                    var sum = parseInt(response.price.BasePrice.replace(' ','')) - parseInt(response.price.Discount.replace(' ',''))
                        + parseInt(deliveryPrice.replace(' ',''))
                    WBLOrder.priceAmount = sum;
                    sum = sum.toString();
                    var modifiedSum  = ""
                    for (var i = sum.length - 1,count = 0; i >= 0; i--,count++) {
                        modifiedSum += sum[i]
                        if(count==2){
                            modifiedSum += " "
                            count = 0
                        }
                    }
                    sum = ""
                    for (var i = modifiedSum.length - 1; i >= 0; i--) {
                        sum += modifiedSum[i]
                    }
                    console.log(sum)
                    document.querySelector('#finalResultPrice').innerText = sum
                },2000)
            },
            checkForErrs: function(){
                return check.error.state
            },
            checkForChanges:function(){
                let _this = this
                let currentprice =  Order.WBLOrder.getValues().price
                let discount = currentprice.priceDiscount
                let basePrice = currentprice.priceBasket
                let price = basePrice - discount
                $.ajax({
                    url:_this.ajax_uri,
                    data:{ActionType: 'CheckPrice'},
                    dataType: 'JSON',
                    async: false
                }).then(function(response){
                    if(
                        price != check.reformPrice(response.price.TotalPrice) ||
                        basePrice != check.reformPrice(response.price.BasePrice) ||
                        discount != check.reformPrice(response.price.Discount)){
                        console.log(price+":"+response.price.TotalPrice)
                        console.log(basePrice+":"+response.price.BasePrice)
                        console.log(discount+":"+response.price.Discount)
                        $.ajax({url:_this.ajax_uri,data:{}})
                        location.href = '/order/'
                    }
                })
            }
        }
        return BeforeClickButton;
    })(window,WBLOrder,$);
document.addEventListener('DOMContentLoaded',function(){
    $.ajax({
        url:WBLcheckOrder.ajax_uri,
        data:{ActionType: 'CheckPrice'},
        dataType: 'JSON',
        async: true
    }).then(function(response){
        WBLcheckOrder.setPrice(response)
    })
    WBLcheckOrder.initEvents();
    document.querySelector('.wbl-finish-make-order-block .btn').addEventListener('click',function(e){
        e.preventDefault();
        WBLcheckOrder.checkForChanges()
        WBLcheckOrder.checkNEPC()
        WBLcheckOrder.checkDelivery()
        if(!WBLcheckOrder.checkForErrs())
            $('#wbl-order-form').submit();
    })
});
export {WBLcheckOrder};
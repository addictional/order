class OrderForm {
    static SetValue(name,value)
    {
        document.querySelector('form#wbl-order-form input[name='+name+']').value =  value;
    }

    static clearValue(name)

    {
        document.querySelector('form#wbl-order-form input[name='+name+']').value = '';
    }
}
export {OrderForm};
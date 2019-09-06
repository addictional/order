const Storage =   {
    get name(){
        return window.localStorage.getItem('name');
    },

    get email(){
        return window.localStorage.getItem('email');
    },

    get phone(){
        return window.localStorage.getItem('phone');
    },

    get delivery(){
        let val = window.localStorage.getItem('delivery');
        return JSON.parse(val);
    },

    get deliveryMethod()
    {
        let val = window.localStorage.getItem('deliveryMethod');
        return JSON.parse(val);
    },

    set name(val){
        window.localStorage.setItem('name',val);
    },

    set email(val){
        window.localStorage.setItem('email',val);
    },

    set phone(val){
        window.localStorage.setItem('phone',val);
    },

    set delivery(val)
    {
        val = JSON.stringify(val);
        window.localStorage.setItem('delivery',val);
    },

    set deliveryMethod(val)
    {
        val = JSON.stringify(val);
        window.localStorage.setItem('deliveryMethod',val);
    }
};

export default Storage;
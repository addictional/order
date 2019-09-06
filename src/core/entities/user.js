import Storage from './storage';

const User  = {
    params: {},

    init(params)
    {
        this.params = {...this.params,...params};
    },

    isAuthorized(){
        return Object.keys(this.params.user).length != 0 && this.params.user.constructor === Object ;
    },

    bonusCardExist(){
        return (this.params.bonusCard.number != null ? true : false);
    },

    getBonusCardInfo(){
        if(!this.bonusCardExist())
            return false;
        return this.params.bonusCard;
    },

    get name()
    {
        if(Storage.name != null)
            return Storage.name;
        if(this.isAuthorized())
            return this.params.user.NAME;
        return "";
    },

    get phone()
    {
        if(Storage.phone != null)
            return Storage.phone;
        if(this.isAuthorized())
            return this.params.user.PERSONAL_PHONE;
        return "";
    },

    get email()
    {
        if(this.isAuthorized())
            return this.params.user.EMAIL;
        if(Storage.email != null)
            return Storage.email;
        return "";
    },

    set name(val){
        Storage.name = val;
    },

    set email(val){
        Storage.email = val;
    },

    set phone(val){
        Storage.phone = val;
    }
};

export default User;
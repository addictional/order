import {handleActions} from "redux-actions";
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.showDeliveryInfo,
            (state,action)=>{
                console.log('DELIVERY_INFO_SHOW');
                // let toFormat = (d)=>{
                //     console.log(d);
                //     if(d>9)
                //         return d;
                //     if(d<=9)
                //         return "0"+d.toString();
                // };
                // if(typeof action.payload.date != 'undefined'){
                //     let date = action.payload.date;
                //     date = toFormat(date.getDate())+'.'+toFormat(parseInt(date.getMonth())+1)+'.'+date.getFullYear();
                //     action.payload.date = date;
                // }
                state.data = action.payload;
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removeDeliveryInfo,
            (state)=>{
                console.log('DELIVERY_INFO_REMOVE');
                state.data = {};
                state.visibility = false;
                return state;
            }
        ],
    ]),
    {
        visibility: false,
        data: {

        }
    }
);

export {reducer};
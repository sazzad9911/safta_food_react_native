const meal_rate =(state=null,action)=>{
    if(action.type=='CHANGE_RATE'){
        return action.playload
    }
    return state
}
export default meal_rate;
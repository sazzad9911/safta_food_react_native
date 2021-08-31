const allactivities=(state=[null],action)=>{
    if(action.type=='CHANGE_ACTIVITIES'){
        return [...state, action.playload]
    }
    return state;
}
export default allactivities;
const allmeals=(state=null,action)=>{
    if(action.type=='CHANGE_MEALS'){
        return action.playload
    }
    return state;
}
export default allmeals;
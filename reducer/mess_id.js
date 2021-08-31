const mess_id=(state=null,action)=>{
    if(action.type=='CHANGE_ID'){
        return action.playload
    }
    return state
}
export default mess_id;
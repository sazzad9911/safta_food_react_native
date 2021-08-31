const tokens =(state=null,action)=>{
    if(action.type=='CHANGE_TOKENS'){
        return action.playload
    }
    return state
}
export default tokens;
const allusers =(state=null,action)=>{
    if(action.type=='SET_USERS'){
        return action.playload
    }
    return state;
}
export default allusers;
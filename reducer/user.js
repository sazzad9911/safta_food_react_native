
const user=(state=null,action)=>{
    if(action.type==='CHANGE_USER'){
        return action.playload
    }
    return state;
}
export default user;
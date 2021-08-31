
const mess_info=(state=null,action)=>{
    if(action.type=='CHANGE_MESS'){

        return action.playload
    }
    return state;
}
export default mess_info;
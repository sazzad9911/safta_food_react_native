
const user_info=(state=null,action)=>{
    if(action.type=='CHANGE_INFO'){
        return action.playload
    }
    return state
}
export default user_info;
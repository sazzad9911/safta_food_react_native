import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList,TextInput } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import AnimatedLoder from 'react-native-animated-loader';
import { Header, Avatar } from 'react-native-elements';
import database from '@react-native-firebase/database';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
const Chats = (props) => {
    const style = props.route.params;
    const [boolean, setBoolean] = useState(false);
    const [text,setText]=useState(null);
    const [tokens, setTokens] = useState([]);
    const reference=database().ref('/' + props.user_info.messcode);
    const LeftContent = () => {
        return (
            <TouchableOpacity onPress={()=>props.navigation.toggleDrawer()}>
                <Icon name='menu-fold' size={28} color='white'></Icon>
            </TouchableOpacity>
        )
    }
    const Display = ({ item }) => {
        //console.log(item.img)
        if(props.user_info.email==item.email){
            return(
                <View style={{width:'58%',marginLeft:'40%',margin: 5}}>
                    <Text style={{fontSize:15,color:'white',backgroundColor:style.background,padding: 5,borderRadius:10}}>{item.message}</Text>
                    <Text style={{marginLeft:2}}>{item.date}</Text>
                </View>
            )
        }
        return (
            <View style={{flexDirection: 'row',width: '60%',marginTop:20,marginBottom:5}}>
            <View style={{margin:10}}>
                <Avatar source={{ uri:item.img}} rounded title={item.name[0]}/>
            </View>
                <View>
                <Text style={{color:'black',fontSize: 12 } }>{item.name}</Text>
                <Text style={{fontWeight:'bold',fontSize:16}}>{item.message}</Text>
                <Text >{item.date}</Text>
                </View>
            </View>
        )
    }
    const [allActivities, setActivities] = useState(null);
    useEffect(() => {
        reference.on('value', snapshot => {
            let x=[];
            snapshot.forEach(data =>{
                x.push(data.val());
            })
            setActivities(x);
        });
    })
    const SendMessage=()=>{
        if(!text){
            return;
        }
        let date=new Date();
        let day=date.getDay();
        let month=date.getMonth()+1;
        let year=date.getFullYear();
        let hour=date.getHours();
        let minute=date.getMinutes();
        let data=[{message:text,
            date:day+'-'+month+'-'+year+' at '+hour+':'+minute,
            name:props.user_info.name,
            img:props.user_info.image,
            email:props.user_info.email}]
        setActivities([...data]);
        reference.push({
            message:text,
            date:day+'-'+month+'-'+year+' at '+hour+':'+minute,
            name:props.user_info.name,
            img:props.user_info.image,
            email:props.user_info.email
        })
        SendNotification('New Message',text);
        setText('');
        return;
    }
    const SendNotification=(title,body)=>{
                //console.log(props.tokens)
                fetch('https://safta-server.herokuapp.com/send_notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title,
                        body: body,
                        tokens: tokens,
                    })
                }).then(()=>{
                    console.log('Successfully send notification');
                }).catch(err=>{
                    console.error(err);
                })
    }
    return (
        <View style={{ backgroundColor: style.color, height: '100%', width: '100%' }}>
            <Header leftComponent={<LeftContent></LeftContent>}
                centerComponent={{ text: "Group Chats", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
                statusBarProps={{ barStyle: style.barStyle, backgroundColor: style.background }}
                containerStyle={{
                    backgroundColor: style.background
                }}>
            </Header>
            {allActivities != null ? (
                <FlatList inverted={true}  style={{transform:[{scaleY:-1}]}} data={allActivities.reverse()} keyExtractor={item => item.date} renderItem={({ item }) => (
                    <Display item={item} />
                )}></FlatList>
            ) : (
                <Text style={{ fontSize: 17, textAlign: 'center' }}>No chats available.</Text>
            )}
            <View style={{ width: '100%', padding: 5 ,flexDirection: 'row',alignItems: 'center'}}>
            <View style={{backgroundColor:style.background,borderRadius:50,marginLeft:5}}>
            <TextInput value={text} onChangeText={(value) =>setText(value)} 
            placeholder='Write message....' placeholderTextColor='white' 
            style={{width:270,marginLeft:10,color:'white',fontSize:15}}></TextInput>
            </View>
            <TouchableOpacity style={{marginLeft:10}} onPress={SendMessage}>
            <Feather name="send" size={25} color={style.background}/>
            </TouchableOpacity>
            </View>
            <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
        </View>
    );
};
const mapStateToProps = (state) => {
    return {
        user_info: state.user_info,
        allusers: state.allusers,
        tokens: state.tokens,
    }
}
export default connect(mapStateToProps)(Chats);

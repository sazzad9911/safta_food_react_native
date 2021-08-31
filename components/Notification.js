import React,{useState,useEffect} from 'react';
import {View,TouchableOpacity,FlatList,Text} from 'react-native';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AnimatedLoder from 'react-native-animated-loader';
import moment from 'moment';
import {connect} from 'react-redux';
const Notification = (props) => {
    const [allActivities,setActivities]=useState(null);
    const [boolean,setBoolean]=useState(true);
    const user=props.user_info;
    const LeftContent=()=>{
        return (
            <TouchableOpacity>
            <Icon name='menu-fold' size={28} color='white' onPress={()=>props.navigation.toggleDrawer()}></Icon>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        let a=[],i=0;
        const datas=firestore().collection(props.mess_info.code).doc(user.email)
        .collection('activities').orderBy('date','desc').get().then(activities=>{
            activities.forEach(act=>{
                a[i]=act.data();
                i++;
            });
            setActivities(a);
            //console.log(a);
        }).then(()=>{
            setBoolean(false);
        });

        return()=>datas();
    },[])
      return (
        <View style={{backgroundColor:props.route.params.color,height:'100%',width:'100%'}}>
        <Header leftComponent={<LeftContent></LeftContent>}
              centerComponent={{text:"My Activities" , style:{color:'white',fontWeight:"bold",fontSize:15}}}
              statusBarProps={{barStyle:props.route.params.barStyle, backgroundColor:props.route.params.background}}
              containerStyle={{
                  backgroundColor:props.route.params.background
              }}>
              </Header>
              <FlatList data={allActivities} keyExtractor={item=>item.date} renderItem={({item}) =>(
                  <Display item={item}/>
              )}></FlatList>
              <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>      
        </View>
      );
};
const mapStateToProps = (state) => {
    return{
        user_info: state.user_info,
        user: state.user,
        mess_info: state.mess_info
    }
}
export default connect(mapStateToProps)(Notification);

const Display =({item})=>{
    return(
        <View style={{widths:'90%',backgroundColor:'#D6DBDF',padding:5,margin:4,borderRadius:5}}>
            <Text style={{color:'#C0392B',fontWeight:'bold',margin:4}}>{item.message}</Text>
            <Text style={{marginLeft:5}}>{moment(item.date.toDate()).format('DD MMM YY')}</Text>
        </View>
    )
}
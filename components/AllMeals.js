import React,{useState,useEffect} from 'react';
import {View,TouchableOpacity,FlatList,Text} from 'react-native';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AnimatedLoder from 'react-native-animated-loader';
import moment from 'moment';
import { Alert } from 'react-native';
import {connect } from 'react-redux';

const AllMeals = (props) => {
    const [allActivities,setActivities]=useState(null);
    const [boolean,setBoolean]=useState(true);
    const id=props.mess_id;
    const LeftContent=()=>{
        return (
            <TouchableOpacity>
            <Icon name='menu-fold' size={28} color='white' onPress={()=>props.navigation.toggleDrawer()}></Icon>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        //console.log(route.params.messId);
        const start =firestore().collection('mess').doc(id).collection('meal').orderBy('date','desc').onSnapshot(document=>{
            //
            var x=[],i=0;
            document.forEach(doc=>{
                x[i]=doc.data();
                i++;
                console.log(doc.data())
            });
            setActivities(x);
            setBoolean(false);

        },err=>{
            Alert.alert('Error', err.message);
            setBoolean(false);
        });

        return()=>start();
    },[])
      return (
        <View style={{backgroundColor:props.route.params.color,height:'100%',width:'100%'}}>
        <Header leftComponent={<LeftContent></LeftContent>}
              centerComponent={{text:"All Meals" , style:{color:'white',fontWeight:"bold",fontSize:15}}}
              statusBarProps={{barStyle:props.route.params.barStyle, backgroundColor:props.route.params.background}}
              containerStyle={{
                  backgroundColor:props.route.params.background
              }}>
              </Header>
              {allActivities!=null?(
                <FlatList data={allActivities} keyExtractor={item=>item.date} renderItem={({item}) =>(
                  <Display item={item}/>
              )}></FlatList>
              ):(
                  <Text style={{fontSize:17,textAlign:'center'}}>No data available</Text>
              )}
              <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>      
        </View>
      );
};
const mapStateToProps = (state) => {
    return{
        mess_id: state.mess_id
    }
}
export default connect(mapStateToProps)(AllMeals);

const Display =({item})=>{
    return(
        <View style={{widths:'90%',backgroundColor:'#D6DBDF',padding:5,margin:4,borderRadius:5,flexDirection:'row'}}>
            <Text style={{color:'#C0392B',fontWeight:'bold',margin:4,marginLeft:20}}>{moment(item.date.toDate()).format('DD MMM YY')}</Text>
            <Text style={{color:'#C0392B',fontWeight:'bold',margin:4,marginLeft:50}}>{item.cost} Taka</Text>
            <Text style={{color:'#C0392B',fontWeight:'bold',margin:4,marginLeft:50}}>{item.totalmeal} Member</Text>
        </View>
    )
}
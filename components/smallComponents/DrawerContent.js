import React,{useState,useEffect} from 'react';
import {View,Text,Button,SafeAreaView,StyleSheet,Image} from 'react-native';
import { DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import firestore from '@react-native-firebase/firestore';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
const DrawerContent = (props) => {
    const [boolean,setBoolean]=useState(false);
    const [messData,setMessData]=useState(null);
    
const styles = StyleSheet.create({
    view1:{
        width:'100%',
        height:'100%',
        backgroundColor:props.background,
    },
    view2:{
        width:'100%',
        height:160,
        top:50,
        padding:15,
        flexDirection:'row',
    },
    headline: {
        fontWeight:'bold',
        fontSize:15,
        color:'white',
        marginBottom:2,
        marginLeft:10
    },
    text: {
        fontSize:13,
        color:'white',
        marginLeft:10
    },
    view3: {
        width:'100%',
        height:'30%'
    }
})

    if(props.data!=null && props.messData!=null){
        return (
            <SafeAreaView style={styles.view1}>
                <View style={styles.view2}>
                <Avatar rounded source={{uri:props.data.image}} size={70} activeOpacity={0.6} title='SF'/>
                <View style={{height:70,justifyContent: 'center'}}>
                <Text style={styles.headline}>{props.data.name}</Text>
                <Text style={styles.text}>{props.messData.name}</Text>
                </View>
                </View>
                <View style={{flexDirection:'row'}}>
                <Text style={styles.headline}>Phone: </Text>
                <Text style={styles.text}>{props.data.phone}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                <Text style={styles.headline}>Email: </Text>
                <Text style={styles.text}>{props.data.email}</Text>
                </View>
                <DrawerContentScrollView style={styles.view3}>
                <DrawerItem label="My Account" labelStyle={{color:'white',fontWeight:'bold'}} icon={()=>(
                    <Icon name='account-box-outline' size={30} color='white'></Icon>
                )} onPress={()=>props.navigation.navigate('My Account')}>
                </DrawerItem>
                {
                    props.data.email===props.messData.manager || props.data.email==='sazzad15-2521@diu.edu.bd'?(
                <DrawerItem label="My Admin" labelStyle={{color:'white',fontWeight:'bold'}} icon={()=>(
                    <Icon name='shield-account-outline' size={30} color='white'></Icon>
                )} onPress={()=>props.navigation.navigate('My Admin')}>
                </DrawerItem>
                    ):(
                        <View></View>
                    )
                }
                <DrawerItem label="All Meals" labelStyle={{color:'white',fontWeight:'bold'}} icon={()=>(
                    <Icons name='list-alt' size={30} color='white'></Icons>
                )} onPress={()=>props.navigation.navigate('All Meals')}>
                </DrawerItem>
                <DrawerItem label="My Activities" labelStyle={{color:'white',fontWeight:'bold'}} icon={()=>(
                    <Feather name='activity' size={30} color='white'></Feather>
                )} onPress={()=>props.navigation.navigate('Notifications')}>
                </DrawerItem>
                <DrawerItem label="Group Message" labelStyle={{color:'white',fontWeight:'bold'}} icon={()=>(
                    <Icon name='android-messages' size={30} color='white'></Icon>
                )} onPress={()=>props.navigation.navigate('Group Messages')}>
                </DrawerItem>
                <DrawerItem label="Log Out" labelStyle={{color:'white',fontWeight:'bold'}} icon={()=>(
                    <Icon name='logout-variant' size={30} color='white'></Icon>
                )} onPress={()=>props.navigation.navigate('Log Out')}>
                </DrawerItem>
                </DrawerContentScrollView>
            </SafeAreaView>
        );
    }else{
        return(
            <View style={styles.view1}>
                <Text>Loading...</Text>
            </View>
        )
    }
};

export default DrawerContent;
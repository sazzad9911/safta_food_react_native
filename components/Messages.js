import React, { useState, useEffect }from 'react';
import {View} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Chats from './Chats';
import People from './People';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
const Messages = (props) => {
    const Tab = createBottomTabNavigator(); 
  //console.warn(props.mess.rate);
  const background=props.route.params.background;
  const color=props.route.params.color;
  const barStyle=props.route.params.barStyle;
  useEffect(() => {
    //setBoolean(true);
      firestore().collection(props.user_info.messcode).onSnapshot(document=>{
        let x=[];
        document.forEach(doc=>{
          x.push(doc.data())
        });
        props.changeAllUsers(x);
      })
  })
    return (
        <Tab.Navigator initialRouteName='Dashboard'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            if (route.name === 'Chats') {
              iconName = focused
                ? 'chatbubbles'
                : 'chatbubbles-outline';
            } else if (route.name === 'Peoples') {
              iconName = focused ? 'people-sharp' : 'people-outline';
            }
  
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'yellow',
          inactiveTintColor: 'white',
          style: {
            backgroundColor: background,
            paddingBottom: 3
          }
        }}
      >
        <Tab.Screen name='Chats' component={Chats} initialParams={{background:background,color:color,barStyle:barStyle}}/>
        <Tab.Screen name='Peoples' component={People} initialParams={{background:background,color:color,barStyle:barStyle}}/>
      </Tab.Navigator> 
    );
};
const mapStateToProps =(state)=>{
    return {
        user_info: state.user_info,
    }
}
const mapDispatchToProps =(dispatch) =>{
  return {
    changeAllUsers: (data)=>{dispatch({type: 'SET_USERS',playload:data})},
    changeActivities: (data) => { dispatch({ type: 'CHANGE_ACTIVITIES', playload: data })},
    changeMeals: (data) => { dispatch({ type: 'CHANGE_MEALS', playload: data })}
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Messages);
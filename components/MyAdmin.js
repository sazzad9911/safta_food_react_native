import React, { useState, useEffect } from 'react';
import { View, Text, Appearance, Button, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdminDashboard from './Admin/AdminDashboard';
import AddMeal from './Admin/AddMeal';
import AddBill from './Admin/AddBill';
import Settings from './Admin/Settings';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
const MyAdmin = (props) => {
  const Tab = createBottomTabNavigator(); 
  //console.warn(props.mess.rate);
  const background=props.route.params.background;
  const color=props.route.params.color;
  const barStyle=props.route.params.barStyle;
  useEffect(() => {
    firestore().collection(props.mess_info.code).onSnapshot(document=>{
      let x=[],i=0,z=[];
      document.forEach(doc => {
        x[i]= doc.data();
        i++;
        firestore().collection(props.mess_info.code).doc(doc.get('email')).collection('activities').onSnapshot(document=>{
          let y=[];
          document.forEach(docc => {
            y.push(docc.data());
          });
        let data={'email':doc.get('email'),'activities':y}
         props.changeActivities(data);
         //console.log(data);
        })
      });
      props.changeAllUsers(x);
     // props.changeActivities(z);
    // props.changeActivities(z);
    // console.log(z);
      
    });
  });
    return (
      <Tab.Navigator initialRouteName='Dashboard'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            if (route.name === 'Dashboard') {
              iconName = focused
                ? 'easel-sharp'
                : 'easel-sharp';
            } else if (route.name === 'Add Meal') {
              iconName = focused ? 'md-add-circle-sharp' : 'md-add-circle-sharp';
            } else if (route.name === 'Add Bill') {
              iconName = focused ? 'card' : 'card';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings';
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
        <Tab.Screen name='Dashboard' component={AdminDashboard} initialParams={{background:background,color:color,barStyle:barStyle}}/>
        <Tab.Screen name='Add Meal' component={AddMeal} initialParams={{background:background,color:color,barStyle:barStyle}}/>
        <Tab.Screen name='Add Bill' component={AddBill} initialParams={{background:background,color:color,barStyle:barStyle}}/>
        <Tab.Screen name='Settings' component={Settings} initialParams={{background:background,color:color,barStyle:barStyle}}/>
      </Tab.Navigator> 
    );
};

const mapStateToProps = (state) =>{
  return {
    mess_id: state.mess_id,
    mess_info: state.mess_info,
    meal_rate: state.meal_rate,
  }
}
const mapDispatchToProps =(dispatch) =>{
  return {
    changeAllUsers: (data)=>{dispatch({type: 'SET_USERS',playload:data})},
    changeActivities: (data) => { dispatch({ type: 'CHANGE_ACTIVITIES', playload: data })},
    changeMeals: (data) => { dispatch({ type: 'CHANGE_MEALS', playload: data })}
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(MyAdmin);

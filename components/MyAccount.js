import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Events from './Events';
import Items from './Items';
import AntDesign from 'react-native-vector-icons/AntDesign';
const MyAccount = ({navigation,route}) => {
  const Tab = createBottomTabNavigator();
  const props =route.params;
  return (
        <Tab.Navigator initialRouteName='Dashboard' 
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Dashboard') {
                iconName = focused
                  ? 'dashboard'
                  : 'dashboard';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'user' : 'user';
              } else if (route.name === 'Events') {
                iconName = focused ? 'calendar' : 'calendar';
              } else if (route.name === 'Items') {
                iconName = focused ? 'shoppingcart' : 'shoppingcart';
              }

              // You can return any component that you like here!
              return <AntDesign name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'yellow',
            inactiveTintColor: 'white',
            style: {
              backgroundColor: props.background,
              paddingBottom: 3
            }
          }}
        >
          <Tab.Screen name='Dashboard' component={Dashboard} initialParams={{background:props.background,color:props.color,barStyle:props.barStyle}}/>
          <Tab.Screen name='Profile' component={Profile} initialParams={{background:props.background,color:props.color,barStyle:props.barStyle}} />
          <Tab.Screen name='Events' component={Events} initialParams={{background:props.background,color:props.color,barStyle:props.barStyle}}/>
          <Tab.Screen name='Items' component={Items} initialParams={{background:props.background,color:props.color,barStyle:props.barStyle}}/>
        </Tab.Navigator>
  );
};

export default MyAccount;

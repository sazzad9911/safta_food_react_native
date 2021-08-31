import React, { useState, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Text, View, StatusBar, Appearance, Button, Alert, SafeAreaView } from 'react-native';
import Home from './components/Home';
import Forget from './components/Forget';
import { Router, Scene } from 'react-native-router-flux';
import Login from './components/Login';
import Create from './components/Create';
import NewMess from './components/NewMess';
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MyAccount from './components/MyAccount';
import MyAdmin from './components/MyAdmin';
import Notification from './components/Notification';
import Messages from './components/Messages';
import DrawerContent from './components/smallComponents/DrawerContent';
import firestore from '@react-native-firebase/firestore';
import AnimatedLoder from 'react-native-animated-loader';
import AllMeals from './components/AllMeals';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import user from './reducer/user';
import user_info from './reducer/user_info';
import mess_info from './reducer/mess_info';
import mess_id from './reducer/mess_id';
import allusers from './reducer/allusers';
import allactivities from './reducer/allactivities';
import allmeals from './reducer/allmeals';
import meal_rate from './reducer/meal_rate';
import Main from './Main';
import tokens from './reducer/tokens';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
const App = () => {
  const combined = combineReducers({
    user: user,
    user_info: user_info,
    mess_info: mess_info,
    mess_id: mess_id,
    allusers: allusers,
    allactivities: allactivities,
    allmeals: allmeals,
    meal_rate: meal_rate,
    tokens: tokens,
  });
  const store = createStore(combined);
  const [background, setBackgroundColor] = useState('#2980B9');
  const [color, setColor] = useState('#F8F9F9');
  const [barStyle, setBarStyle] = useState('light-content');
  const [box1,setBox1] = useState('#E1F5FE');
  const [box2,setBox2] = useState('#FFF8E1')
  SplashScreen.hide();
  useEffect(() => {
    const theme = Appearance.getColorScheme();
    if (theme === 'dark') {
      setBackgroundColor('#212F3D');
      setBox1('rgba(0, 233, 163, 0.342)');
      setBox2('rgba(0, 74, 233, 0.342)');
      setColor('black');
      changeNavigationBarColor('#212F3D');
    }
    
    //notification service forground--------------------------------
    const unsubscribe = messaging().onMessage(async remoteMessage => {
     // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
     console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
     let data =JSON.stringify(remoteMessage);
     PushNotification.localNotification({
      title:data.title,
      message:data.body,
      channelId: "fcm_fallback_notification_channel",
      smallIcon: "logo",
      largeIcon: ""
    });
    });

    //return unsubscribe;
    //<Main  background={background} color={color} barStyle={barStyle} box1={box1} box2={box2}/>
  }, [])
  return (
    <Provider store={store}>
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center',
       width: '100%', height: '100%',backgroundColor:background }}>
        <Main  background={background} color={color} barStyle={barStyle} box1={box1} box2={box2}/>
      </SafeAreaView>
    </Provider>
  )
}
export default App;

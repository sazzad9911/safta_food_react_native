import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MyAccount from './components/MyAccount';
import MyAdmin from './components/MyAdmin';
import Notification from './components/Notification';
import Messages from './components/Messages';
import DrawerContent from './components/smallComponents/DrawerContent';
import Allmeals from './components/AllMeals';
import Login from './components/Login';
import Create from './components/Create';
import NewMess from './components/NewMess';
import Home from './components/Home';
import Forget from './components/Forget';
import AnimatedLoder from 'react-native-animated-loader';
import messaging from '@react-native-firebase/messaging';
const Main = (props) => {
    const Drawer = createDrawerNavigator();
    const Stack = createStackNavigator();
    const [user, setUser] = useState(null);
    useEffect(() => {
        auth().onAuthStateChanged(user => {
            props.changeUser(user);
            setUser(user);
            if (user != null) {
                firestore().collection('user').where('email', '==', user.email).onSnapshot(querySnapshot => {
                    querySnapshot.forEach(documentSnapshot => {
                        if (!documentSnapshot.get('token')) {
                            messaging().getToken().then((token) => {
                                firestore().collection('user').doc(documentSnapshot.id).update({
                                    token: token
                                });
                            })
                        }
                        firestore().collection(documentSnapshot.get('code')).doc(user.email).onSnapshot(doc => {
                            //user data-----------------------------------
                            props.changeUserInfo(doc.data());
                        });
                        firestore().collection('mess').where('code', '==', documentSnapshot.get('code'))
                            .onSnapshot(snps => {
                                snps.forEach(snps => {
                                    //mess data-------------------------------------------
                                    props.changeMessInfo(snps.data());
                                    props.changeMessId(snps.id);
                                    //console.warn(snps.id);
                                })
                            });
                        let token = [];
                        firestore().collection('user').get().then(document => {
                            document.forEach(doc => {
                                if (documentSnapshot.get('code') == doc.get('code') && doc.get('token')) {
                                    token.push(doc.get('token'));
                                }
                            })
                            props.changeTokens(token);
                        })
                    });
                }, error => {
                    Alert.alert('Error', 'Opps! faild to load data');
                });
            }

        });
        //return () => start();
    }, []);
    const LogOut = () => {
        auth().signOut().then(() => {
            //this.forceUpdateHandler();

        });

        return (<Text>No</Text>);
    }
    if (props.user) {
        return (
            <View style={{ width: '100%', height: '100%' }}>
                {
                    props.user_info != null && props.mess_id != null && props.mess_info != null ? (
                        <NavigationContainer>
                            <Drawer.Navigator initialRouteName="My Account" drawerContentOptions={{
                                activeTintColor: 'red',
                                activeBackgroundColor: 'green'
                            }} drawerContent={d => <DrawerContent {...d} background={props.background} data={props.user_info} messData={props.mess_info} id={props.mess_id} />}>
                                <Drawer.Screen name='My Account' component={MyAccount} initialParams={{ background: props.background, color: props.color, barStyle: props.barStyle }} />
                                <Drawer.Screen name='My Admin' component={MyAdmin} initialParams={{ background: props.background, color: props.color, barStyle: props.barStyle }} />
                                <Drawer.Screen name='All Meals' component={Allmeals} initialParams={{ background: props.background, color: props.color, barStyle: props.barStyle }} />
                                <Drawer.Screen name='Notifications' component={Notification} initialParams={{ background: props.background, color: props.color, barStyle: props.barStyle }} />
                                <Drawer.Screen name='Group Messages' component={Messages} initialParams={{ background: props.background, color: props.color, barStyle: props.barStyle }} />
                                <Drawer.Screen name='Log Out' component={LogOut} />
                            </Drawer.Navigator>
                        </NavigationContainer>
                    ) : (
                        <AnimatedLoder visible={true} source={require('./components/6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
                    )
                }
            </View>
        )
    }
    return (

        <View style={{ width: '100%', height: '100%', backgroundColor: props.background }}>
            <StatusBar backgroundColor={props.background} barStyle={props.barStyle}></StatusBar>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Home'>
                    <Drawer.Screen name="Home" component={Home} options={{ headerShown: false }}></Drawer.Screen>
                    <Drawer.Screen name="Login" component={Login} options={{ headerShown: false }} initialParams={{ backgroundColor: props.color, color: props.background, box1: props.box1, box2: props.box2 }}></Drawer.Screen>
                    <Drawer.Screen name="SignUp" component={Create} options={{ headerShown: false }} initialParams={{ backgroundColor: props.color, color: props.background, box1: props.box1, box2: props.box2 }}></Drawer.Screen>
                    <Drawer.Screen name="Forget" component={Forget} options={{ headerShown: false }} initialParams={{ backgroundColor: props.color, color: props.background, box1: props.box1, box2: props.box2 }} />
                    <Drawer.Screen name="NewMess" component={NewMess} options={{ headerShown: false }} initialParams={{ backgroundColor: props.color, color: props.background, box1: props.box1, box2: props.box2 }} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
};
const mapStateToProps = (state) => {
    return {
        user: state.user,
        user_info: state.user_info,
        mess_info: state.mess_info,
        mess_id: state.mess_id
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeUser: (user) => { dispatch({ type: 'CHANGE_USER', playload: user }) },
        changeUserInfo: (data) => { dispatch({ type: 'CHANGE_INFO', playload: data }) },
        changeMessInfo: (data) => { dispatch({ type: 'CHANGE_MESS', playload: data }) },
        changeMessId: (data) => { dispatch({ type: 'CHANGE_ID', playload: data }) },
        changeActivities: (data) => { dispatch({ type: 'CHANGE_ACTIVITIES', playload: data }) },
        changeTokens: (data) => { dispatch({ type: 'CHANGE_TOKENS', playload: data }) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);

import React,{useState,useEffect} from 'react';
import { View ,Text,StyleSheet,Image,TextInput,Button,TouchableOpacity,Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import auth from '@react-native-firebase/auth';
import AnimatedLoder from 'react-native-animated-loader';

const Login = ({navigation,route}) => {
    const [email,setEmail] =useState(null);
    const [password,setPassword] =useState(null);
    const [boolean,setBoolean] =useState(false);
    const Press=()=>{
        //Actions.forget({color:props.color,backgroundColor:props.backgroundColor,box1:box1,box2:box2});
        navigation.navigate('Forget');
    }
    const Press2=()=>{
       // Actions.createe({color:props.color,backgroundColor:props.backgroundColor,box1:box1,box2:box2});
       navigation.navigate('SignUp');
    }

    const Login=()=>{
        if(email===null || password===null){
            Alert.alert('Alert!','Please fill all the inputs');
            return;
        }
        setBoolean(true);
        auth().signInWithEmailAndPassword(email, password)
        .then(() => {
             //console.log('User account created & signed in!');
             setBoolean(false);
        })
       .catch(error => {
           setBoolean(false);
           if (error.code === 'auth/email-already-in-use') {
           Alert.alert('Email already in use');
           }

        if (error.code === 'auth/invalid-email') {
           Alert.alert('Invalid email!');
         }

        Alert.alert(error.code,error.message)
        });
    }

    //style----------------------------------------------
    const styles = StyleSheet.create({
        text:{
            fontWeight:'bold',
            fontSize:15,
            color:route.params.color,
            marginVertical:5,
        },
        button: {
           backgroundColor:'#2471A3',
           width:'70%',
           height:37,
           borderRadius:10,
           alignItems: 'center',
           justifyContent: 'center',
           marginVertical:5,
           marginBottom:15,
        },
        password: {
            width: '70%',
            height: 37,
            borderWidth:1,
            marginVertical:5,
            borderRadius:10,
            color:route.params.color,
            fontSize:15,
            borderColor:route.params.color,
        },
        email: {
            width: '70%',
            height: 37,
            borderWidth:1,
            marginVertical:5,
            borderRadius:10,
            color:route.params.color,
            fontSize:15,
            borderColor:route.params.color,
        },
        logo:{
            width:100,
            height:100,
            borderRadius:10,
        },
        view3: {
            width:'100%',
            height:500,
            justifyContent: 'center',
            alignItems:'center',
        },
        view1: {
            backgroundColor:route.params.box1,
            width:400,
            height:400,
            borderRadius:400/2,
            position:'absolute',
            top:-100,
            left:-100,
        },
        view2:{
            backgroundColor:route.params.box2,
            height:400,
            width:400,
            position:'absolute',
            borderRadius:400/2,
            bottom:-100,
            right:-100,
        }
    })
    return (
        <View style={{backgroundColor:route.params.backgroundColor,width:'100%',height:'100%',justifyContent: 'center'}}>
            <View style={styles.view1}></View>
            <View style={styles.view2}></View>
            <View style={styles.view3}>
            <Image style={styles.logo} source={require('./../icons/logo.png')}></Image>
            <TextInput style={styles.email} onChangeText={t=>setEmail(t)} placeholder='Email...' placeholderTextColor={route.params.color} keyboardType='email-address' autoCapitalize='none'></TextInput>
            <TextInput style={styles.password} onChangeText={p=>setPassword(p)} placeholder='Password...' type='password' placeholderTextColor={route.params.color} secureTextEntry={true}></TextInput>
            <TouchableOpacity style={styles.button} onPress={Login}>
                <Text style={{fontSize:15,fontWeight:'bold',color:'white'}}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.text} onPress={Press}>
                <Text style={{fontSize:15,fontWeight:'bold',color:route.params.color}}>Forget Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.text} onPress={Press2}>
                <Text style={{fontSize:15,fontWeight:'bold',color:route.params.color}}>Create an Account</Text>
            </TouchableOpacity>
            </View>
            <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
        </View>
    );
};

export default Login;


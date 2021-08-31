import React,{ useState, useEffect} from 'react';
import { View ,Text,StyleSheet,Image,TextInput,Button,TouchableOpacity,DatePicker,Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AnimatedLoder from 'react-native-animated-loader';
const Create = ({navigation,route}) => {

    const Press=()=>{
        //Actions.newmess({color:props.color,backgroundColor:props.backgroundColor,box1:props.box1,box2:props.box2});
        navigation.navigate('NewMess');
    }

    const styles = StyleSheet.create({
        text:{
            fontWeight:'bold',
            fontSize:15,
            color:'black',
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
        email: {
            width: '70%',
            height: 37,
            borderWidth:1,
            marginVertical:5,
            borderRadius:10,
            color:route.params.color,
            fontSize:15,
            borderColor:route.params.color
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
    const [name,setName]=useState(null);
    const [email,setEmail]=useState(null);
    const [phone,setPhone]=useState(null);
    const [code,setCode]=useState(null);
    const [password,setPassword]=useState(null);
    const [password2,setPassword2]=useState(null);
    const [check,setCheck]=useState(null);
    const [boolean, setBoolean]=useState(false);
    const CreateAccount=()=>{
        if(!name || !email || !password || !phone || !code || !password2){
            Alert.alert('!Wrong','Please fill all inputs.');
            return;
        }
        if(password!=password2){
            Alert.alert('!Wrong','Password are not same.');
            return;
        }
        setBoolean(true);
        firestore().collection('mess').where('code','==',code).get().then(document=>{
            setCheck(true);
            document.forEach(doc=>{
                Finish();
            })
        }).then(()=>{
            if(!check){
                Alert.alert('Opps!','The messcode is not correct.');
                setBoolean(false);
                setCheck(false)
            }
        })
    }
    const Finish=() =>{
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                    firestore().collection(code).doc(email).set({
                        boolean: true,
                        cook: 0,
                        date: new Date(),
                        elec: 0,
                        email: email,
                        extra: 0,
                        fine: 0,
                        gass: 0,
                        hc: 0,
                        home: 0,
                        image: 'https://firebasestorage.googleapis.com/v0/b/my-meal-279205.appspot.com/o/profile%2Favt.jpg?alt=media&token=f85331ce-4b50-4681-9c24-c9b9b68e02c9',
                        mc: 0,
                        messcode: code,
                        name: name,
                        phone: phone,
                        phome: 0,
                        pmeal: 0,
                        totalmeal: 0,
                        wifi: 0,
                    }).then(() => {
                        firestore().collection('user').add({
                            code: code,
                            email: email,
                        }).then(() => {
                            Alert.alert('Success!', 'Successfully created your account.');
                            setBoolean(false);
                        }).catch(err => {
                            Alert.alert('Error', err.message);
                            setBoolean(false);
                        })
                    })
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('Error!','That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    Alert.alert('Error!','That email address is invalid!');
                }
             console.error(error);
            });
    }
    return (
        <View style={{backgroundColor:route.params.backgroundColor,width:'100%',height:'100%',justifyContent: 'center'}}>
            <View style={styles.view1}></View>
            <View style={styles.view2}></View>
            <View style={styles.view3}>
            <Image style={styles.logo} source={require('./../icons/logo.png')}></Image>
            <TextInput style={styles.email} placeholder='Name.....' placeholderTextColor={route.params.color} onChangeText={(value) =>setName(value)}></TextInput>
            <TextInput style={styles.email} placeholder='Email.....' placeholderTextColor={route.params.color} keyboardType='email-address' autoCapitalize='none' autoCompleteType='email' onChangeText={value =>setEmail(value)}></TextInput>
            <TextInput style={styles.email} placeholder='Phone.....' placeholderTextColor={route.params.color} keyboardType='numeric' onChangeText={value => setPhone(value)}></TextInput>
            <TextInput style={styles.email} placeholder='Group Code...' placeholderTextColor={route.params.color} keyboardType='numeric' onChangeText={value =>setCode(value)}></TextInput>
            <TextInput style={styles.email} placeholder='New Password...' placeholderTextColor={route.params.color} secureTextEntry={true} onChangeText={value => setPassword(value)}></TextInput>
            <TextInput style={styles.email} placeholder='Confirm Password...' placeholderTextColor={route.params.color} secureTextEntry={true} onChangeText={value =>setPassword2(value)}></TextInput>
            <TouchableOpacity style={styles.button} onPress={() =>CreateAccount()}>
                <Text style={{fontSize:15,fontWeight:'bold',color:'white'}}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={Press}>
                <Text style={{fontSize:15,fontWeight:'bold',color:'white'}}>Create Mess</Text>
            </TouchableOpacity>
            </View>
            <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
        </View>
    );
};

export default Create;



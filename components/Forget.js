import React,{ useState} from 'react';
import { View ,Text,StyleSheet,Image,TextInput,Button,TouchableOpacity,Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import AnimatedLoder from 'react-native-animated-loader';
const Forget = ({navigation,route}) => {



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
            backgroundColor:route.params.box2,
            width:400,
            height:400,
            borderRadius:400/2,
            position:'absolute',
            top:-100,
            left:-100,
        },
        view2:{
            backgroundColor:route.params.box1,
            height:400,
            width:400,
            position:'absolute',
            borderRadius:400/2,
            bottom:-100,
            right:-100,
        }
    })
    const [email,setEmail]=useState(null);
    const [boolean, setBoolean]=useState(false);
    const Forget=()=>{
        if(!email){
            Alert.alert('Wrong','Invalid Email');
            return;
        }
        setBoolean(true);
        auth().sendPasswordResetEmail(email).then(()=>{
            Alert.alert('Success!','Please check your email.');
            setBoolean(false);
        }).catch(err=>{
            Alert.alert('Error!',err.message);
            setBoolean(false);
        })
    }
    return (
        <View style={{backgroundColor:route.params.backgroundColor,width:'100%',height:'100%',justifyContent: 'center'}}>
            <View style={styles.view1}></View>
            <View style={styles.view2}></View>
            <View style={styles.view3}>
            <Image style={styles.logo} source={require('./../icons/logo.png')}></Image>
            <TextInput style={styles.email} placeholder='Email...' placeholderTextColor={route.params.color} autoCapitalize='none' keyboardType='email-address' onChangeText={value => setEmail(value)}></TextInput>
            <TouchableOpacity style={styles.button} onPress={() =>Forget()}>
                <Text style={{fontSize:15,fontWeight:'bold',color:'white'}}>Send</Text>
            </TouchableOpacity>
            </View>
            <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
        </View>
    );
};

export default Forget;



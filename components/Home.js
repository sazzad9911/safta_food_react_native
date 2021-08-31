import React,{useState,useEffect} from 'react';
import {Text,SafeAreaView,StyleSheet,FlatList,
  TouchableOpacity,Image,View,TextInput,Appearance} from 'react-native';
import Cart from './Cart';
import Icon from 'react-native-vector-icons/AntDesign';
import app from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import AnimatedLoder from 'react-native-animated-loader';
const Home = ({navigation,route}) => {
  const [data,setData]=useState(null);
  const [search,setSearch]=useState(null);
  const [color,setColor]=useState('white');
  const [backgroundColor,setBackgroundColor]=useState('#2471A3');
  const [boolean,setBoolean]=useState(false);
  
  useEffect(() => {
    setBoolean(true);
    const theme=Appearance.getColorScheme();
    if(theme==='dark'){
      setColor('black');
      setBackgroundColor('white');
    }
    const subs=firestore().collection('items').onSnapshot(document=>{
      const all=[];
      document.forEach(doc=>{
        all.push(doc.data());
      })
      setData(all);
      setSearch(all);
      setBoolean(false);
    },error=>{
      console.warn(error.message);
      setBoolean(false);
    });

    //return()=>subs();
  }, [])

  //functions----------------------------------------------------------------
  const Search=(d)=>{
    //console.warn(d);f
    let value=[];
    value=data.filter((doc)=>{
      return doc.head.toLocaleLowerCase().startsWith(d.toLocaleLowerCase());
    });
    setSearch(value);
  }

  const Press=()=>{
    //console.warn('hello');
    navigation.navigate('Login');
  }

  //styles------------------------------------------------
  const styles = StyleSheet.create({
    holder: {
      color:backgroundColor,
      height:'100%',
      width:'80%',
      letterSpacing:2,
      fontSize:15,
    },
    viewBox:{
      borderColor:backgroundColor,
      borderWidth:1,
      width:'94%',
      height:40,
      backgroundColor:'#fdfdfd85',
      top:1,
      zIndex:100,
      borderRadius:10,
      flexDirection:'row',
      alignItems: 'center',
      shadowColor: "#000000",
          shadowOffset: {
         width: 4,
         height: 3,
          },
          shadowOpacity:1.0,
          borderRadius:5
    },
    views: {
      width:'100%',
      height:'100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flat:{
      
    },
    button:{
      position:'absolute',
      bottom:10,
      right:10,
      backgroundColor:backgroundColor,
      width:150,
      height:50,
      borderRadius:10,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      shadowColor:'black',
    },
    text:{
      fontSize:20,
      color:color,
      fontWeight:'bold',
      marginStart:10,
    }
  })
  
  return (
    <SafeAreaView style={{backgroundColor:color,justifyContent:'center',alignItems:'center',width:'100%',height:'100%'}}>
    <View style={styles.viewBox}>
        <Icon name='search1' size={26} style={{marginHorizontal:10}} color={backgroundColor}></Icon>
        <TextInput onChangeText={e=>Search(e)} placeholder='Search....' style={styles.holder} placeholderTextColor={backgroundColor}></TextInput>
      </View>
      <FlatList style={styles.flat} data={search} keyExtractor={item=>item.id} renderItem={({ item, index, separators }) =>(
        <Cart data={item} color={color}></Cart>
      )}>
      </FlatList>
      <TouchableOpacity style={styles.button} onPress={Press}>
      <Icon name="login" size={25} color={color}></Icon>
      <Text style={styles.text}>LogIn</Text>
      </TouchableOpacity>
      <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
    </SafeAreaView>
  );

};

export default Home;

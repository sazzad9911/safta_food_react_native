import React,{useState,useEffect} from 'react';
import {View,Image,Text,StyleSheet,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
const Cart = (props) => {
    const [number,setNumber]=useState(0);
    const [textColor,setTextColor]=useState('#2471A3');
    const [backgroundColor,setBackgroundColor]=useState('#E1F5FE');
    const [PrymaryText,setPrymaryText]=useState('#283747');
    function animateValue(start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setNumber(Math.floor(progress * (end - start) + start))
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }
      //animateValue(0,parseInt(props.data.like),3000);
      useEffect(()=>{
          if(props.color==='black'){
              setBackgroundColor('rgba(0, 233, 163, 0.342)');
              setTextColor('white');
              setPrymaryText('#D4E6F1');
          }
      },[])
      //style sheet--------------------------------
      const style=StyleSheet.create({
        bottomText:{
            fontSize:15,
            color:textColor,
            fontWeight:'bold',
            marginStart:5,
            marginEnd:5,
            marginTop:10,
        },
        img: {
            height:'50%',
            width:'100%',
            borderRadius:10,
        },
        view: {
            width:'94%',
            height:300,
            backgroundColor:backgroundColor,
            marginVertical:6,
            marginHorizontal:'3%',
            borderRadius:10,
            position:'relative',
            shadowColor: "#000000",
            shadowOffset: {
             width: 0,
             height: 3,
            },
            shadowOpacity:1.0,
            borderRadius:5
        },
        head:{
            fontSize:17,
            fontWeight:'bold',
            color:PrymaryText,
            marginVertical:3,
            marginHorizontal:5,
    
        },
        text: {
            fontSize:15,
            fontWeight:'500',
            color:PrymaryText,
            marginVertical:3,
            marginHorizontal:5,
        },
        views:{
            width:'100%',
            flexDirection:'row',
            alignItems: 'center',
        }
    })
    return (
        <View style={style.view}>
            <Image style={style.img} source={{uri:props.data.img}}/>
            <Text style={style.head}>{props.data.head}</Text>
            <Text style={style.text}>{props.data.text}</Text>
            <View style={style.views}>
                <TouchableOpacity>
                <Icon name="like1" size={30} color={textColor} style={{marginHorizontal:10,marginTop:6}}></Icon>
                </TouchableOpacity>
                <Text style={style.bottomText}>Favor--{props.data.like} times</Text>
            </View>
        </View>
    );
};

export default Cart;

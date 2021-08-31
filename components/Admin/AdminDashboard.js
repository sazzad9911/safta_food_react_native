import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { Header, Button, Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedLoder from 'react-native-animated-loader';
import { PieChart } from "react-native-chart-kit";
import Overlayer from './Overlayer';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
const AdminDashboard = (props) => {
  const style = props.route.params;
  const [selectedValue, setSelectedValue] = useState('');
  const [previousMonth, setPreviousMonth] = useState(null);
  const [overlay, setOverlay] = useState(false);
  const [action, setAction] = useState(null);
  const [error,setError] =useState(null);
  const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [user, setUser] = useState({ 'name': '...', 'email': '...', 'phone': '...', 'date': '...', 'image': 'https://firebasestorage.googleapis.com/v0/b/my-meal-279205.appspot.com/o/profile%2Favt.jpg?alt=media&token=f85331ce-4b50-4681-9c24-c9b9b68e02c9' });

  const LeftContent = () => {
    return (
      <TouchableOpacity>
        <Icon name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icon>
      </TouchableOpacity>
    )
  }
  const datas = [
    {
      name: "Meal Due",
      population: data[0],
      color: "#0DE1E1",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Home Due",
      population: data[1],
      color: "#0DAFE1",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Total Meal",
      population: data[2],
      color: "#0DE122",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "House Rent",
      population: data[3],
      color: "#E1800D",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Electricity Bill",
      population: data[4],
      color: "#950DE1",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Wifi Bill",
      population: data[5],
      color: "#E10D9D",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Cooking Cost",
      population: data[6],
      color: "#5B0DE1",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Extra Cost",
      population: data[7],
      color: "#DADA58",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Previous Due",
      population: data[8],
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ]
  const toggleOverlay = () => {
    setOverlay(!overlay);
  }
  const AddMeal = () => {
    setAction('ADD_MEAL');
    setOverlay(true);
  }
  const AddBill = () => {
    setAction('ADD_BILL');
    setOverlay(true);
  }
  const SelectUser = (email) => {
    if (email == '') {
      return;
    }
    props.allusers.map(user => {
      if (user.email === email) {
        if (props.mess_info.rate == 0) {
          setUser({'name':user.name, 'email':user.email,'phone':user.phone,'date':user.date.toString(),'image':user.image});
          let mealdue = (user.pmeal - user.mc);
          mealdue=parseFloat(mealdue.toFixed(2));
          let homedue = (user.home + user.gass + user.wifi + user.elec + user.cook + user.extra + user.phome + user.fine) - user.hc;
          setData([parseFloat(mealdue.toFixed(2)), parseFloat(homedue.toFixed(2)), user.totalmeal, user.home, user.elec, user.wifi, user.cook, user.extra, user.phome]);
          //console.log(data);
        } else {
          setUser({'name':user.name, 'email':user.email,'phone':user.phone,'date':user.date.toString(),'image':user.image});
          if (!props.meal_rate) {
            //console.log(props.meal_rate)
            let mealdue = (user.totalmeal * 0) - user.mc;
            let homedue = (user.home + user.gass + user.wifi + user.elec + user.cook + user.extra + user.phome + user.fine) - user.hc;
            setData([parseFloat(mealdue.toFixed(2)), parseFloat(homedue.toFixed(2)), user.totalmeal, user.home, user.elec, user.wifi, user.cook, user.extra, user.phome]);
          } else {
            //console.log(props.meal_rate)
            let mealdue = (user.totalmeal * props.meal_rate)+user.pmeal - user.mc;
            let homedue = (user.home + user.gass + user.wifi + user.elec + user.cook + user.extra + user.phome + user.fine) - user.hc;
            setData([parseFloat(mealdue.toFixed(2)), parseFloat(homedue.toFixed(2)), user.totalmeal, user.home, user.elec, user.wifi, user.cook, user.extra, user.phome]);
          }
        }
      }
    });
  }
  const MonthlyRate = (previous) => {
    let date=new Date();
    let month=date.getMonth()-previous;
    let year=date.getFullYear();
    let MealRate =0;
    let cost=0,meal=0;
    props.allmeals.map((meals,i)=>{
      let months=meals.date.toDate().getMonth();
      let years=meals.date.toDate().getFullYear();
      if(months==month && years==year){
        cost=cost+meals.cost;
        meal=meal+meals.totalmeal;
      }
    });
    MealRate=cost/meal;
    return MealRate;
  }
  const ResetMeal =()=>{
    setError('success')
    if(props.mess_info.prev==true){
      props.allusers.forEach(user=>{
        if(user.boolean==true){
          let prev=user.mc-((user.totalmeal*MonthlyRate(1))+user.pmeal);
          if(prev && prev>0){
            firestore().collection(props.mess_info.code).doc(user.email).update({
              mc:prev,
              totalmeal:0,
              pmeal:0,
            }).then(() => {
             // setError('success')
            });
          }else if(prev && prev<0){
            firestore().collection(props.mess_info.code).doc(user.email).update({
              mc:0,
              totalmeal:0,
              pmeal:(-prev),
            }).then(() => {
              //setError('success')
            });
          }else{
            firestore().collection(props.mess_info.code).doc(user.email).update({
              mc:0,
              totalmeal:0,
              pmeal:0,
            }).then(() => {
              //setError('success')
            });
          }
        }
      })
      ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
    }else{
      props.allusers.map((user,i)=>{
        if(user.boolean==true){
          firestore().collection(props.mess_info.code).doc(user.email).update({
            mc:0,
            totalmeal:0,
            pmeal:0,
          }).then(() => {
            ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
          })
        }
      })
    }
  }
  const [Expenses, setExpenses] = useState(0);
  const [HomeExpenses, setHomeExpenses] = useState(0);
  const [MealCredit, setMealCredit] = useState(0);
  const [HomeCredit, setHomeCredit] = useState(0);
  useEffect(() => {

  })
  useEffect(() => {
    //console.log(props.allactivities.length);
    //setMealCredit(0);
    if (props.allmeals != null && props.allactivities.length > 1) {
      let z = 0;
      firestore().collection('mess').doc(props.mess_id).collection('home').onSnapshot(document => {
        document.forEach(doc => {
          z = z + doc.get('cost')
        });
        setHomeExpenses(z);
      })
      let x = 0;
      props.allmeals.forEach(doc => {
        x = x + doc.cost;
      });
      setExpenses(x);
      setMealCredit(props.mess_info.mc);
      setHomeCredit(props.mess_info.hc);
      //automatic reste-------------
      //console.log('hello');

    }
  }, [props.allmeals])
  if(!props.meal_rate && props.mess_info.rate==1 && error==null && props.allusers){
    Alert.alert(
    "Monthly Reset?",
    "Your meal calculation system is monthly average. For average calculation monthly reset is require.",
    [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () =>{setError('cancel')}
      },
      { text: "OK", onPress: () => ResetMeal() }
    ]
  );
  }
  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: style.color }}>
      <Header leftComponent={<LeftContent></LeftContent>}
        centerComponent={{ text: "My Admin", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
        statusBarProps={{ barStyle: style.barStyle, backgroundColor: style.background }}
        containerStyle={{
          backgroundColor: style.background
        }}>
      </Header>
      {
        props.allusers !== null ? (
          <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
            <View style={styles.view1}>
              <View style={[styles.view2, { backgroundColor: '#229954' }]}>
                <Text style={styles.text}>Meal HandCash</Text>
                <Text style={styles.head}>{(MealCredit - Expenses).toFixed(2)}</Text>
              </View>
              <View style={[styles.view2, { backgroundColor: '#A93226' }]}>
                <Text style={styles.text}>Meal Expenses</Text>
                <Text style={styles.head}>{Expenses}</Text>
              </View>
            </View>
            <View style={styles.view1}>
              <View style={[styles.view2, { backgroundColor: '#229954' }]}>
                <Text style={styles.text}>Home HandCash</Text>
                <Text style={styles.head}>{HomeCredit - HomeExpenses}</Text>
              </View>
              <View style={[styles.view2, { backgroundColor: '#A93226' }]}>
                <Text style={styles.text}>Home Expenses</Text>
                <Text style={styles.head}>{HomeExpenses}</Text>
              </View>
            </View>
            <View style={styles.view1}>
              <Button buttonStyle={[styles.button, { backgroundColor: '#2E86C1' }]} title='AddMeal Credit' onPress={() => AddMeal()}
                icon={<Ionicons name='md-add-circle-sharp' size={25} color='white' />}
              />
              <Button buttonStyle={[styles.button, { backgroundColor: '#2E86C1' }]} title='AddHome Credit' onPress={() => AddBill()}
                icon={<Ionicons name='md-add-circle-sharp' size={25} color='white' />}
              />
            </View>
            <Picker
              selectedValue={selectedValue}
              style={{ height: 50, width: 160, marginRight: 10 }}
              onValueChange={(itemValue, itemIndex) => SelectUser(itemValue)}
            >
              <Picker.Item label="Select User" value='' />
              {
                props.allusers.map((user) => {
                  if (user.boolean != false) {
                    return (
                      <Picker.Item label={user.name} value={user.email} key={user.email} />
                    )
                  }
                })
              }
            </Picker>
            <Text style={[styles.head, { color: '#F5B041' }]}>USER'S DETAILS</Text>
            <View style={{ margin: 10, borderWidth: 1, borderColor: '#F5B041', width: '88%', borderRadius: 5, alignItems: 'center' }}>
              <Image source={require('./../../files/logo.png')}
                style={{ width: 100, height: 100, borderRadius: 100 / 2, margin: 5 }}
              />
              <Text style={styles.text2}>Name: {user.name}</Text>
              <Text style={styles.text2}>Email: {user.email}</Text>
              <Text style={styles.text2}>Phone: {user.phone}</Text>
            </View>
            <ScrollView horizontal={true} >
              <PieChart
                data={datas}
                width={400}
                height={250}
                chartConfig={{
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#fb8c00",
                  backgroundGradientTo: "#ffa726",
                  decimalPlaces: 1, // optional, defaults to 2dp
                  color: (opacity = .8) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"5"}
                center={[0, 18]}
                absolute
              />
            </ScrollView>
            <View style={{ padding: 10, width: '100%', alignItems: 'center' }}>
            </View>
            <Overlay onBackdropPress={() => toggleOverlay()} isVisible={overlay}>
              <Overlayer actions={action} visible={() => setOverlay(!overlay)} />
            </Overlay>
          </ScrollView>
        ) : (
          <AnimatedLoder visible={true} source={require('./../6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
        )
      }
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
    user_info: state.user_info,
    mess_info: state.mess_info,
    mess_id: state.mess_id,
    allusers: state.allusers,
    allactivities: state.allactivities,
    allmeals: state.allmeals,
    meal_rate: state.meal_rate,
  }
}
export default connect(mapStateToProps)(AdminDashboard);
const styles = StyleSheet.create({
  view1: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  view2: {
    width: '40%',
    height: 85,
    backgroundColor: 'red',
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  head: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    margin: 10,
    borderRadius: 5,
    width: 165
  },
  text2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#039284',
    margin: 3
  }
})
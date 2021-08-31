import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Appearance, TouchableOpacity, StyleSheet, Alert, Dimensions,ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import AnimatedLoder from 'react-native-animated-loader';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { connect } from "react-redux";

const Dashboard = (props) => {
  const style = props.route.params;
  const [boolean, setBoolean] = useState(false);
  const [MealDue, setMealDue] = useState(0);
  const [HomeDue, setHomeDue] = useState(0);
  const [MealRate, setMealRate] = useState(0);
  const user = props.user_info;
  const mess = props.mess_info;
  const id = props.mess_id;
  const LeftContent = () => {
    return (
      <TouchableOpacity>
        <Icon name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icon>
      </TouchableOpacity>
    )
  }
  useEffect(() => {
    setBoolean(true);
    firestore().collection('mess').doc(props.mess_id).collection('meal').orderBy('date','desc').onSnapshot(document=>{
      let x=[];
      document.forEach(doc=>{
        x.push(doc.data());
        //console.log('gg');
      });
      if(x.length>0){
      props.changeMeals(x);
      SetMealRate(x);
      }else{
        Alert.alert('Hey','Lets add meal from your admin panel.');
        setBoolean(false);
      }
    })
    
  }, []);
  ///
const SetMealRate=(meal)=>{
  let totalTaka=0,totalMeal=0;
  let date=new Date();
  let month=date.getMonth();
  let year=date.getFullYear();
  meal.map((meal,i)=>{
    let datee=new Date(meal.date.toDate());
    let Pmonth=datee.getMonth();
    let Pyear=datee.getFullYear();
    if(month===Pmonth && year===Pyear){
      totalTaka=totalTaka+meal.cost;
      totalMeal=totalMeal+meal.totalmeal;
    }
  })
  var dataState = (totalTaka / totalMeal);
  props.changeRate(dataState);
  setBoolean(false);
  if (mess.rate === 0) {
    setMealRate(meal[0].cost/meal[0].totalmeal);
    setHomeDue((user.elec + user.home + user.fine + user.cook + user.gass + user.extra + user.phome + user.wifi) - user.hc);
    setMealDue(user.pmeal - user.mc);

  } else {
    setMealRate(dataState);
    setHomeDue((user.elec + user.home + user.fine + user.cook + user.gass + user.extra + user.phome + user.wifi) - user.hc);
    setMealDue((dataState * user.totalmeal)+user.pmeal - user.mc);
  }
}
  const data = [
    {
      name: "House Rent",
      population: user.home,
      color: '#34495ea1',
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Cooking Cost",
      population: user.cook,
      color: "#b1c02bb9",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Gass Bill",
      population: user.gass,
      color: "#2bc084b6",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Wifi Bill",
      population: user.wifi,
      color: "#1f618dc0",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Extra Cost",
      population: user.extra,
      color: "#48c9afc9",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Fine Fee",
      population: user.fine,
      color: "#d6ca9abe",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Electricity Bill",
      population: user.elec,
      color: "#E67E22",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Previous Due",
      population: user.phome,
      color: "#34495E",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];
  return (
    <View style={{ backgroundColor: style.color, height: '100%', width: '100%' }}>
      <Header leftComponent={<LeftContent></LeftContent>}
        centerComponent={{ text: "My Account", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
        statusBarProps={{ barStyle: style.barStyle, backgroundColor: style.background }}
        containerStyle={{
          backgroundColor: style.background
        }}>
      </Header>
      <ScrollView>
      <View style={{ width: '100%', height: 280}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
          <View style={{ width: '40%', height: 75, backgroundColor: 'rgba(255, 2, 2, 0.644)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text2}>Meal Due</Text>
            <Text style={styles.text1}>{MealDue.toFixed(2)}</Text>
          </View>
          <View style={{ width: '40%', height: 75, backgroundColor: 'rgba(9, 112, 0, 0.644)', borderRadius: 6, marginLeft: '5%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text2}>Meal Credit</Text>
            <Text style={styles.text1}>{user.mc}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
          <View style={{ width: '40%', height: 75, backgroundColor: 'rgba(255, 95, 2, 0.644)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text2}>Home Due</Text>
            <Text style={styles.text1}>{HomeDue.toFixed(2)}</Text>
          </View>
          <View style={{ width: '40%', height: 75, backgroundColor: 'rgba(95, 112, 0, 0.644)', borderRadius: 6, marginLeft: '5%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text2}>Home Credit</Text>
            <Text style={styles.text1}>{user.hc}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
          <View style={{ width: '40%', height: 75, backgroundColor: 'rgba(0, 95, 112, 0.644)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text2}>Meal Rate</Text>
            <Text style={styles.text1}>{MealRate.toFixed(2)}</Text>
          </View>
          <View style={{ width: '40%', height: 75, backgroundColor: 'rgba(2, 137, 255, 0.644)', borderRadius: 6, marginLeft: '5%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text2}>Total Meal</Text>
            <Text style={styles.text1}>{user.totalmeal}</Text>
          </View>
        </View>
      </View>
      <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center', height: 260 }}>
        <PieChart
          data={data}
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
          center={[0, 25]}
          absolute
        />
      </View>
      </ScrollView>
      <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
    user_info: state.user_info,
    mess_info: state.mess_info,
    mess_id: state.mess_id,
    allmeals: state.allmeals,
  }
}
const mapDispatchToProps=(dispatch)=>{
  return {changeRate:(data)=>{ dispatch({ type:'CHANGE_RATE',playload: data})},
  changeMeals: (data) => { dispatch({ type: 'CHANGE_MEALS', playload: data })}}
}
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
const styles = StyleSheet.create({
  text1: {
    fontSize: 20,
    fontWeight: 'bold', color: 'white',
  },
  text2: {
    fontSize: 15, color: 'white',
  }
})
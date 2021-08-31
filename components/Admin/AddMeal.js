import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { Header, ListItem, Avatar, CheckBox, Input, Button, Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import allmeals from './../../reducer/allmeals';
import meal_rate from './../../reducer/meal_rate';

const AddMeal = (props) => {
  const style = props.route.params;
  const [meal, setMeal] = useState([]);
  const [date, setDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(null);
  const [guestHolder, setGuestHolder] = useState(null);
  const [guest, setGuest] = useState(null);
  const [cost, setCost] = useState(null);
  const [loder, setLoder] = useState(false);
  var array = [];
  const LeftContent = () => {
    return (
      <TouchableOpacity>
        <Icon name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icon>
      </TouchableOpacity>
    )
  }
  useEffect(() => {
    if (props.allusers != null) {
      let x = [];
      props.allusers.map((user) => {
        if (user.boolean != false) {
          let data = { 'meal': 0, 'name': user.name, 'phone': user.phone, 'email': user.email, 'image': user.image }
          x.push(data);
        }
      })
      setMeal(x);
    }
  }, [])
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const Press = (email, boolean) => {
    let x = [];
    setCount(0);
    meal.map((user) => {
      if (user.email === email && user.meal == 0 && boolean == false) {
        let data = { 'meal': 1, 'name': user.name, 'phone': user.phone, 'email': user.email, 'image': user.image }
        x.push(data);
      } else if (user.email === email && user.meal == 1 && boolean == false) {
        let data = { 'meal': 0, 'name': user.name, 'phone': user.phone, 'email': user.email, 'image': user.image }
        x.push(data);
      } else if (user.meal == 1 && boolean == false) {
        let data = { 'meal': 1, 'name': user.name, 'phone': user.phone, 'email': user.email, 'image': user.image }
        x.push(data);
      } else if (user.email == email && boolean == true) {
        let data = { 'meal': 1 + guest, 'name': user.name, 'phone': user.phone, 'email': user.email, 'image': user.image }
        x.push(data);
      }
      else {
        let data = { 'meal': 0, 'name': user.name, 'phone': user.phone, 'email': user.email, 'image': user.image }
        x.push(data);
      }
    })
    //setCount(c);
    setMeal(x);
  }
  const guestCount = () => {
    if (guestHolder == null && guest == null) {
      Alert.alert('Wrong!', 'Please Fill all inputs' + guestHolder + guest);
      return;
    }
    let x = []
    meal.map((user, i) => {
      if (user.email == guestHolder) {
        let data = { 'meal': guest + 1, 'name': user.name, 'phone': user.phone, 'email': user.email, 'image': user.image }
        x.push(data);
      } else {
        x.push(user);
      }
    })
    setMeal(x);
    setVisible(false);
  }
  const counter = () => {
    let i = 0;
    meal.map((user) => {
      i = i + user.meal;
    })
    return i;
  }
  const SaveMeal = () => {
    if (cost == null || cost == '' || date == null || counter() == 0) {
      setLoder(false);
      Alert.alert('Wrong!', 'Please fill all the inputs.');
      return;
    }
    for (let i = 0; i < props.allmeals.length; i++) {
      let dates = props.allmeals[i].date.toDate();
      let day = dates.getDate();
      let month = dates.getMonth();
      let year = dates.getFullYear();
      let newDay = date.getDate();
      let newMonth = date.getMonth();
      let newYear = date.getFullYear();
      //console.log(day+'->'+newDay);
      if (day == newDay && month == newMonth && year == newYear) {
        setLoder(false);
        Alert.alert('Wrong!', 'Meal Already Exists.');
        return;
      }
      if (i == (props.allmeals.length - 1)) {
        MealSavings();
      }
    }

  }
  const MealSavings = () => {
    setLoder(true);
    firestore().collection('mess').doc(props.mess_id).collection('meal').add({
      totalmeal: counter(),
      cost: parseInt(cost),
      date: date
    }).then(() => {
      meal.map((user,i) => {
        let bil = firebase.firestore.FieldValue.increment(parseInt(user.meal));
        let pmeal = firebase.firestore.FieldValue.increment(parseInt((cost / counter()) * user.meal));
        firestore().collection(props.mess_info.code).doc(user.email).update({
          totalmeal: bil,
          pmeal: pmeal
        }).then(() => {
          i++;
        })
        //console.log('Cost:'+cost+'Date:'+moment(date).format('DD MMM YY')+'name:'+user.name+'meal:'+user.meal);
        if (i == meal.length-1) {
          setLoder(false);
          ToastAndroid.showWithGravity('Successful',
            ToastAndroid.CENTER,
            ToastAndroid.SHORT)
        }
      })
    })
    return;
  }
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Header leftComponent={<LeftContent></LeftContent>}
        centerComponent={{ text: "Add Meal", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
        statusBarProps={{ barStyle: style.barStyle, backgroundColor: style.background }}
        containerStyle={{
          backgroundColor: style.background
        }}>
      </Header>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 2, padding: 10 }}>
          {
            meal != null ? (
              <View>
                {
                  meal.map((l, i) => {
                    if (l.meal > 0) {
                      return (
                        <ListItem key={l.phone} bottomDivider containerStyle={{ borderRadius: 10 }}>
                          <CheckBox
                            center
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={true}
                            onPress={() => Press(l.email, false)}
                          />
                          <Avatar source={{ uri: l.image }} rounded={true} />
                          <ListItem.Content>
                            <ListItem.Title>{l.name}</ListItem.Title>
                            <ListItem.Subtitle>{l.phone}</ListItem.Subtitle>
                          </ListItem.Content>
                        </ListItem>
                      )
                    } else {
                      return (
                        <ListItem key={l.phone} bottomDivider containerStyle={{ borderRadius: 10 }}>
                          <CheckBox
                            center
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={false}
                            onPress={() => Press(l.email, false)}
                          />
                          <Avatar source={{ uri: l.image }} rounded={true} />
                          <ListItem.Content>
                            <ListItem.Title>{l.name}</ListItem.Title>
                            <ListItem.Subtitle>{l.phone}</ListItem.Subtitle>
                          </ListItem.Content>
                        </ListItem>
                      )
                    }
                  })
                }
              </View>
            ) : (
              <Text>Loading...</Text>
            )
          }
        </View>
        <View style={{ flex: 2, padding: 10 }}>
          <View style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 10, padding: 10 }}>
            <Text style={{ color: '#6D6E6E', textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>{counter()} members</Text>
            <Input label='Bazar Cost:' placeholder='Enter cost....' keyboardType='numeric' onChangeText={val => setCost(val)} />
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10, color: '#6D6E6E' }}>Date:</Text>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <DatePicker style={{ backgroundColor: '#A3E4D7', margin: 5 }}
                textColor={style.background}
                date={date}
                androidVariant="nativeAndroid"
                onDateChange={setDate}
              />
            </View>
            <Button title='Add guest' type='outline' onPress={toggleOverlay} />
            <Button loading={loder} buttonStyle={{ marginTop: 10, marginBottom: 10 }} title='Save Meal' onPress={SaveMeal} />
          </View>
        </View>
      </ScrollView>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Views guestHolder={(value) => setGuestHolder(value)}
          guestCount={(value) => setGuest(value)}
          users={meal}
          count={() => guestCount()}
        ></Views>
      </Overlay>
    </View>
  );
};
const Views = (props) => {
  return (
    <View style={{ padding: 10, width: 320, height: 250 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>ADD GUEST</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#6D6E6E', margin: 5 }}>Guest Holder:</Text>
      <Picker onValueChange={(itemValue, itemIndex) => props.guestHolder(itemValue)}
      >
        <Picker.Item label="Select Member" value="nothing" />
        {
          props.users.map((user, i) => (
            <Picker.Item label={user.name} value={user.email} key={i} />
          ))
        }
      </Picker>
      <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#6D6E6E', margin: 5 }}>Guest Number:</Text>
      <Picker onValueChange={(itemValue, itemIndex) => props.guestCount(itemValue)}
      >
        <Picker.Item label="0" value={0} />
        <Picker.Item label="1" value={1} />
        <Picker.Item label="2" value={2} />
      </Picker>
      <Button title="Add Guest" onPress={() => props.count()} />
    </View>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    user_info: state.user_info,
    mess_info: state.mess_info,
    mess_id: state.mess_id,
    allusers: state.allusers,
    allmeals: state.allmeals,
    meal_rate: state.meal_rate,
  }
}
export default connect(mapStateToProps)(AddMeal);
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, Alert, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Header, Switch, Overlay, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import meal_rate from './../../reducer/meal_rate';
const Settings = (props) => {
  const style = props.route.params;
  const [loading, setLoading] = useState(false);
  const LeftContent = () => {
    return (
      <TouchableOpacity>
        <Icon name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icon>
      </TouchableOpacity>
    )
  }
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  }
  const OpenOverlay = (key) => {
    if (key == 'MEAL') {
      Alert.alert(
        "Warning!",
        "You are going reset meal data?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK", onPress: () => {
              ToastAndroid.showWithGravity('Resetting...please wait..', ToastAndroid.CENTER, ToastAndroid.SHORT);
              ResetMeal();
            }
          }
        ]
      );
    } else if (key === "HOME") {
      Alert.alert(
        "Warning!",
        "You are going reset home data?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK", onPress: () => {
              ToastAndroid.showWithGravity('Resetting...please wait..', ToastAndroid.CENTER, ToastAndroid.SHORT);
              ResetHome();
            }
          }
        ]
      );
    }
  }
  const [settings, setSettings] = useState(null);
  const [selected, setSelectedValue] = useState(null);
  const [deleteSelected, setDeleteSelected] = useState(null);
  const [previous, setPreviousValue] = useState(null);
  const [users, setUsers] = useState(props.allusers);
  const [check, setCheck] = useState(false);
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    if (props.mess_info.rate == 0) {
      setSettings(false);
    } else {
      setSettings(true);
    }
    setPreviousValue(props.mess_info.prev);
    let x = [];

    //console.log(x);
  }, [props.mess_info])
  const DeleteUser = () => {
    if (deleteSelected == null || deleteSelected == 'none') {
      Alert.alert('Wrong!', 'Select user first.')
      return;
    }
    setLoading(true);
    firestore().collection(props.mess_info.code).doc(deleteSelected).update({
      boolean: false
    }).then(() => {
      ToastAndroid.showWithGravity('Success', ToastAndroid.CENTER, ToastAndroid.SHORT);
      setLoading(false);
      setVisible(false);
    })
  }
  const Blank = () => {

  }
  const MealCalculation = () => {
    if (check == false) {
      Alert.alert(
        "!Warning",
        "For change calculation setting you need to reset meal data first.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setCheck(false)
          },
          { text: "OK", onPress: () => ResetMeal() }
        ]
      );
      return;
    }
    setSettings(!settings);
    if (props.mess_info.rate == 0) {
      //console.log(false);
      firestore().collection('mess').doc(props.mess_id).update({
        rate: 1,
      })
    } else {
      //console.log(true);
      firestore().collection('mess').doc(props.mess_id).update({
        rate: 0,
      })
    }
  }
  const AdminAccess = (value) => {
    setAdmin(value);
    if (value == null) {
      Alert.alert('Wrong', 'Please select a member');
      return;
    }
    firestore().collection('mess').doc(props.mess_id).update({
      manager: value
    }).then(() => {
      ToastAndroid.showWithGravity('Success', ToastAndroid.CENTER, ToastAndroid.SHORT);
    });
  }
  const Previous = () => {
    if (previous == true) {
      firestore().collection('mess').doc(props.mess_id).update({
        prev: false,
      });
    } else {
      firestore().collection('mess').doc(props.mess_id).update({
        prev: true,
      })
    }
    setPreviousValue(!previous);
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
  const ResetMeal = () => {//problem-------
    setCheck(true);
    props.allusers.map(user => {
      if (user.boolean == true) {
        if (props.mess_info.prev == true) {
          if (props.mess_info.rate == 0) {
            if ((user.mc - user.pmeal) > 0) {
              firestore().collection('user').doc(user.email).update({
                mc: (user.mc - user.pmeal),
                totalmeal: 0,
                pmeal: 0
              }).then(() => {
                ToastAndroid.showWithGravity('Success...', ToastAndroid.CENTER, ToastAndroid.SHORT);
              })
            } else if (props.mess_info.rate == 1) {
              let prev = user.mc - ((user.totalmeal * MonthlyRate(1)) + user.pmeal);
              if (prev && prev > 0) {
                firestore().collection(props.mess_info.code).doc(user.email).update({
                  mc: prev,
                  totalmeal: 0,
                  pmeal: 0,
                }).then(() => {
                  // setError('success')
                });
              } else if (prev && prev < 0) {
                firestore().collection(props.mess_info.code).doc(user.email).update({
                  mc: 0,
                  totalmeal: 0,
                  pmeal: (-prev),
                }).then(() => {
                  //setError('success')
                });
              } else {
                firestore().collection(props.mess_info.code).doc(user.email).update({
                  mc: 0,
                  totalmeal: 0,
                  pmeal: 0,
                }).then(() => {
                  //setError('success')
                });
              }
              ToastAndroid.showWithGravity('Success...', ToastAndroid.CENTER, ToastAndroid.SHORT);
            }
          } else {
            let cost = user.mc - (props.meal_rate * user.totalmeal);
            firestore().collection('user').doc(user.email).collection('activities').add({
              message: 'Monthly meal rested. Credited money ' + cost + ' on your account.',
              date: new Date(),
              mc: cost,
            }).then(() => {
              ToastAndroid.showWithGravity('Success....', ToastAndroid.CENTER, ToastAndroid.SHORT);
            })
          }
        } else {
          if (props.mess_info.rate == 0) {
            firestore().collection('user').doc(user.email).update({
              mc: 0,
              totalmeal: 0,
              pmeal: 0
            }).then(() => {
              ToastAndroid.showWithGravity('Success...', ToastAndroid.CENTER, ToastAndroid.SHORT);
            })
          }
        }
      }
    })
  }
  const ResetHome = () => {
    if (props.mess_info.prev == true) {
      props.allusers.map(user => {
        if (user.boolean == true) {
          let homedue = (user.home + user.gass + user.wifi + user.elec + user.cook + user.extra + user.phome + user.fine) - user.hc;
          firestore().collection(props.mess_info.code).doc(user.email).update({
            phome: homedue,
            home: 0,
            wifi: 0,
            gass: 0,
            elec: 0,
            cook: 0,
            extra: 0,
            fine: 0,
            hc: 0
          }).then(() => {
            ToastAndroid.showWithGravity('Success', ToastAndroid.CENTER, ToastAndroid.SHORT);
          })
        }
      })
    } else {
      props.allusers.map(user => {
        if (user.boolean == true) {
          //let homedue=(user.home+user.gass+user.wifi+user.elec+ user.cook+user.extra+ user.phome+user.fine)- user.hc;
          firestore().collection(props.mess_info.code).doc(user.email).update({
            phome: 0,
            home: 0,
            wifi: 0,
            gass: 0,
            elec: 0,
            cook: 0,
            extra: 0,
            fine: 0,
          }).then(() => {
            ToastAndroid.showWithGravity('Success', ToastAndroid.CENTER, ToastAndroid.SHORT);
          })
        }
      })
    }
  }
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Header leftComponent={<LeftContent></LeftContent>}
        centerComponent={{ text: "Settings", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
        statusBarProps={{ barStyle: style.barStyle, backgroundColor: style.background }}
        containerStyle={{
          backgroundColor: style.background
        }}>
      </Header>
      <ScrollView>

        <View style={{ margin: 5, backgroundColor: '#E2E2E2', flexDirection: 'row', height: 60, alignItems: 'center', borderRadius: 5 }}>
          <Text style={{ margin: 5, fontSize: 15, fontWeight: 'bold', fontFamily: 'Arial', marginRight: 15 }}>Meal Calculation Setting</Text>
          <Text>Fixed</Text>
          <Switch value={settings} color="orange" onValueChange={MealCalculation} />
          <Text>Monthly Avarage</Text>
        </View>

        <View style={{ margin: 5, backgroundColor: '#E2E2E2', flexDirection: 'row', height: 60, alignItems: 'center', borderRadius: 5 }}>
          <Text style={{ margin: 5, fontSize: 15, fontWeight: 'bold', fontFamily: 'Arial', marginRight: 15 }}>Save Previous Calculation</Text>
          <Text>Off</Text>
          <Switch value={previous} color="orange" onValueChange={Previous} />
          <Text>On</Text>
        </View>

        <View style={{ margin: 5, backgroundColor: '#E2E2E2', flexDirection: 'row', height: 60, alignItems: 'center', borderRadius: 5 }}>
          <Text style={{ margin: 5, fontSize: 15, fontWeight: 'bold', fontFamily: 'Arial', marginRight: 15 }}>Give Admin Access</Text>
          <Picker selectedValue={admin}
            style={{ height: 50, width: 260, marginRight: 10 }}
            pickerStyle={{ backgroundColor: 'red' }}
            onValueChange={(itemValue, itemIndex) => AdminAccess(itemValue)}>
            <Picker.Item label="Select Member" value='none'></Picker.Item>
            {
              users.map((user, i) => {
                if (user.boolean != false) {
                  return <Picker.Item label={user.name} value={user.email} key={i} />
                }
              })
            }
          </Picker>
        </View>

        <TouchableOpacity style={{ margin: 5, backgroundColor: '#E2E2E2', flexDirection: 'row', height: 60, alignItems: 'center', borderRadius: 5 }}
          onPress={() => toggleOverlay()}>
          <Text style={{ margin: 5, fontSize: 15, fontWeight: 'bold', fontFamily: 'Arial', marginRight: 15 }}>Delete an User</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ margin: 5, backgroundColor: '#E2E2E2', flexDirection: 'row', height: 60, alignItems: 'center', borderRadius: 5 }} onPress={() => OpenOverlay('MEAL')}>
          <Text style={{ margin: 5, fontSize: 15, fontWeight: 'bold', fontFamily: 'Arial', marginRight: 15 }}>Reset Meal Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ margin: 5, backgroundColor: '#E2E2E2', flexDirection: 'row', height: 60, alignItems: 'center', borderRadius: 5 }} onPress={() => OpenOverlay('HOME')}>
          <Text style={{ margin: 5, fontSize: 15, fontWeight: 'bold', fontFamily: 'Arial', marginRight: 15 }}>Reset Home</Text>
        </TouchableOpacity>
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <View style={{ width: 320, height: 150, padding: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Delete User</Text>
            <Picker onValueChange={(itemValue, itemIndex) => setDeleteSelected(itemValue)}>
              <Picker.Item label="Select User" value='none'></Picker.Item>
              {
                users.map((user, i) => {
                  if (user.boolean != false) {
                    return <Picker.Item label={user.name} value={user.email} key={i} />
                  }
                })
              }
            </Picker>
            <Button loading={loading} buttonStyle={{ marginVertical: 10 }} title="Delete" onPress={DeleteUser}>Delete</Button>
          </View>
        </Overlay>
      </ScrollView>
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
    meal_rate: state.meal_rate,
    allmeals: state.allmeals,
  }
}
export default connect(mapStateToProps)(Settings);
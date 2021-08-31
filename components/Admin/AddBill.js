import React,{ useState, useEffect} from 'react';
import {View,Text,TouchableOpacity,ScrollView,Alert, ToastAndroid} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/AntDesign';
import {Header,Input,Button} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import {connect} from 'react-redux';
const AddBill = (props) => {
  const style = props.route.params;
  const [selected,setSelectedValue]= useState(null);
  const [bill,setBill] =useState(null);
  const [billCost,setBillCost] = useState(null);
  const [cost,setCost] = useState(null);
  const [expense,setExpense] = useState(null);
  const [button1,setButton1] = useState(false);
  const [button2,setButton2] = useState(false);
  const [button3,setButton3] = useState(false);
  const [Electricity,setElectricity] = useState(null);
  const [Wifi,setWifi] = useState(null);
  const [Cooking,setCooking]= useState(null);
  const [Gass,setGass]= useState(null);
  const [Extra,setExtra]= useState(null);
  const [Fine,setFine]= useState(null);
  const [Home,setHome]= useState(null);
  const LeftContent = () => {
    return (
      <TouchableOpacity>
        <Icon name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icon>
      </TouchableOpacity>
    )
  }
  const SaveExpenses=() =>{
    if(cost==null || expense==null){
      console.log(cost+expense)
      Alert.alert('Wrong!','Please fill all the inputs.');
      return;
    }
    setButton1(true);
    firestore().collection('mess').doc(props.mess_id).collection('home').add({
      cost: parseInt(cost),
      type: expense,
      date: new Date()
    }).then(()=>{
      ToastAndroid.showWithGravity('Success',
      ToastAndroid.CENTER,
      ToastAndroid.SHORT)
      setButton1(false);
      //setExpense(null);
      //setCost(null);
    })
  }
  const SaveAllBill=()=>{
    if(Electricity==null || Wifi == null || Cooking==null || Gass==null || Extra==null || Fine==null || Home==null || selected==null 
      || Electricity=='' || Wifi == '' || Cooking=='' || Gass=='' || Extra=='' || Fine=='' || Home=='' || selected==''){
      Alert.alert('Wrong!','Please fill all the inputs.');
      return;
    }
    setButton2(true);
    let elec= firebase.firestore.FieldValue.increment(parseInt(Electricity));
    let wifi= firebase.firestore.FieldValue.increment(parseInt(Wifi));
    let cook= firebase.firestore.FieldValue.increment(parseInt(Cooking));
    let gass= firebase.firestore.FieldValue.increment(parseInt(Gass));
    let extra= firebase.firestore.FieldValue.increment(parseInt(Extra));
    let fine= firebase.firestore.FieldValue.increment(parseInt(Fine));
    let home= firebase.firestore.FieldValue.increment(parseInt(Home));
    firestore().collection(props.mess_info.code).doc(selected).update({
      elec:elec,
      wifi:wifi,
      cook: cook,
      gass: gass,
      extra:extra,
      fine:fine,
      home:home
    }).then(() => {
      setButton2(false);
      ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
    })
  }
  const SaveSpecific=() => {
    if(bill==null || selected == null || billCost == null || bill=='' || selected == '' || billCost ==''){
      Alert.alert('Wrong!','Please fill all the inputs.');
      return;
    }
    setButton3(true);
    let cost =firebase.firestore.FieldValue.increment(parseInt(billCost));
    if(bill=='elec'){
      firestore().collection(props.mess_info.code).doc(selected).update({
        elec:cost,
      }).then(() => {
        setButton3(false);
        ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
      })
    }else if(bill=='cook'){
      firestore().collection(props.mess_info.code).doc(selected).update({
        cook:cost,
      }).then(() => {
        setButton3(false);
        ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
      })
    }else if(bill=='wifi'){
      firestore().collection(props.mess_info.code).doc(selected).update({
        wifi:cost,
      }).then(() => {
        setButton3(false);
        ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
      })
    }else if(bill=='home'){
      firestore().collection(props.mess_info.code).doc(selected).update({
        home:cost,
      }).then(() => {
        setButton3(false);
        ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
      })
    }else if(bill=='extra'){
      firestore().collection(props.mess_info.code).doc(selected).update({
        extra:cost,
      }).then(() => {
        setButton3(false);
        ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
      })
    }else if(bill=='gass'){
      firestore().collection(props.mess_info.code).doc(selected).update({
        gass:cost,
      }).then(() => {
        setButton3(false);
        ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
      })
    }else if(bill=='fine'){
      firestore().collection(props.mess_info.code).doc(selected).update({
        fine:cost,
      }).then(() => {
        setButton3(false);
        ToastAndroid.showWithGravity('Successful',ToastAndroid.CENTER,ToastAndroid.SHORT);
      })
    }else{
      Alert.alert('Wrong!','Some thing went wrong.');
      setButton3(false);
    }
    
  }
  
  return (
    <View style={{ width:'100%', height:'100%'}}>
      <Header leftComponent={<LeftContent></LeftContent>}
        centerComponent={{ text: "Add Bill", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
        statusBarProps={{ barStyle: style.barStyle, backgroundColor: style.background }}
        containerStyle={{
          backgroundColor: style.background
        }}>
      </Header>
      <ScrollView>
      <View style={{ width: '95%',backgroundColor: '#E2E2E2', marginLeft:'2.5%',marginVertical:5,borderRadius: 10}}>
        <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>Add Expenses</Text>
        <Input label='Cost:' placeholder='Enter Bill...' keyboardType='numeric' onChangeText={val=>setCost(val)}/>
        <Picker selectedValue={expense}
        onValueChange={(itemValue, itemIndex) => setExpense(itemValue)}>
        <Picker.Item label="Select Bill type" value='Electricity Bill' key='1'/>
          <Picker.Item label="Electricity Bill" value='Electricity Bill' key='2'/>
          <Picker.Item label="Cooking Bill" value='Cooking Bill' key='3'/>
          <Picker.Item label="House Rent" value='House Rent' key='4'/>
          <Picker.Item label="Extra Cost" value='Extra Cost' key='5'/>
          <Picker.Item label="Gass Bill" value='Gass Bill' key='6'/>
          <Picker.Item label="Wifi Bill" value='Wifi Bill' key='7'/>
          <Picker.Item label="Fine Fee" value='Fine Fee' key='8'/>
        </Picker>
        <Button loading={button1} buttonStyle={{margin:5}} title='Save Expenses' onPress={SaveExpenses}/>
        </View>
        <View style={{ width: '95%',backgroundColor: '#E2E2E2', marginLeft:'2.5%',marginVertical:5,borderRadius: 10}}>
        <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>Add All Bills</Text>
        <Input label='Electric:' placeholder='Enter Electricity Bill...' keyboardType='numeric' onChangeText={val=>setElectricity(val)}/>
        <Input label='Wifi:' placeholder='Enter Wifi Bill...' keyboardType='numeric' onChangeText={val=>setWifi(val)}/>
        <Input label='Cook:' placeholder='Enter Cooking Cost...' keyboardType='numeric' onChangeText={val=>setCooking(val)}/>
        <Input label='House:' placeholder='Enter House Rent...' keyboardType='numeric' onChangeText={val=>setHome(val)}/>
        <Input label='Extra:' placeholder='Enter Extra Cost...' keyboardType='numeric' onChangeText={val=>setExtra(val)}/>
        <Input label='Fine:' placeholder='Enter Fine Cost...' keyboardType='numeric' onChangeText={val=>setFine(val)}/>
        <Input label='Gass:' placeholder='Enter Gass Cost...' keyboardType='numeric' onChangeText={val=>setGass(val)}/>
        <Picker selectedValue={selected} onValueChange={(itemValue, itemIndex) =>setSelectedValue(itemValue)}>
          <Picker.Item label="Selcet Member" value='none'></Picker.Item>
          {
            props.allusers.map((user,i)=>{
              if(user.boolean!=false){
                return <Picker.Item label={user.name} value={user.email} key={i}/>
              }
            })
          }
        </Picker>
        <Button loading={button2} buttonStyle={{margin:5}} title='Save Bill' onPress={SaveAllBill}/>
        </View>
        <View style={{ width: '95%',backgroundColor: '#E2E2E2', marginLeft:'2.5%',marginVertical:5,borderRadius: 10}}>
        <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>Add Specific Bill</Text>
        <Input label='Cost:' placeholder='Enter Bill...' keyboardType='numeric' onChangeText={val=>setBillCost(val)}/>
        <Picker selectedValue={bill}  onValueChange={(itemValue, itemIndex) =>setBill(itemValue)}>
        <Picker.Item label="Select Bill type" value='none'></Picker.Item>
          <Picker.Item label="Electricity Bill" value='elec'></Picker.Item>
          <Picker.Item label="Cooking Bill" value='cook'></Picker.Item>
          <Picker.Item label="House Rent" value='house'></Picker.Item>
          <Picker.Item label="Extra Cost" value='extra'/>
          <Picker.Item label="Gass Bill" value='gass'/>
          <Picker.Item label="Wifi Bill" value='wifi'/>
          <Picker.Item label="Fine Fee" value='fine'/>
        </Picker>
        <Picker selectedValue={selected} onValueChange={(itemValue, itemIndex) =>setSelectedValue(itemValue)}>
          <Picker.Item label="Select Member" value='none'/>
          {
            props.allusers.map((user,i)=>{
              if(user.boolean!==false){
                return <Picker.Item label={user.name} value={user.email} key={i}/>
              }
            })
          }
        </Picker>
        <Button loading={button3} buttonStyle={{margin:5}} title='Save Bill' onPress={SaveSpecific}/>
        </View>
      </ScrollView>
    </View>
  );
};
const mapStateToProps=(state)=>{
  return{
    user: state.user,
    user_info: state.user_info,
    mess_info: state.mess_info,
    mess_id: state.mess_id,
    allusers: state.allusers,
  }
}
export default connect(mapStateToProps)(AddBill);
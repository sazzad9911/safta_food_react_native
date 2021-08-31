import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ToastAndroid, Image } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import DropDownPicker from 'react-native-dropdown-picker';
const Overlayer = (props) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [selected, setSelected] = useState(null);
    const [amount, setAmount] = useState(null);
    const [boolean, setBoolean] = useState(false);
    //console.log(props.allusers);
    const AddMeal = () => {
        console.log(selectedValue);
        if (selectedValue == null || amount == null || selectedValue == 'none') {
            Alert.alert('Wrong!', 'Fill the all inputs.');
            return;
        }
        //console.log(amount+'->'+selectedValue);
        //return;
        setBoolean(true);
        let mc = firebase.firestore.FieldValue.increment(parseInt(amount));
        firestore().collection('mess').doc(props.mess_id).update({
            mc: mc
        })
        firestore().collection(props.mess_info.code).doc(selectedValue).collection('activities').add({
            message: 'Add meal credit ' + amount + ' tk',
            date: new Date(),
            mc: parseInt(amount)
        })
        let cost = firebase.firestore.FieldValue.increment(parseInt(amount));
        firestore().collection(props.mess_info.code).doc(selectedValue).update({
            mc: cost
        }).then(() => {
            setAmount(null);
            setBoolean(false);
            setSelected(null);
            props.visible();
            ToastAndroid.showWithGravity(
                'Successful update',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            )
        });
    }
    const AddBill = () => {
        if (selected == null || amount == null || selected == 'none') {
            Alert.alert('Wrong!', 'Fill the all inputs.');
            return;
        }
        //console.log(amount+'->'+selected);
        // return;
        setBoolean(true);
        let hc = firebase.firestore.FieldValue.increment(parseInt(amount));
        firestore().collection('mess').doc(props.mess_id).update({
            hc: hc
        })
        firestore().collection(props.mess_info.code).doc(selected).collection('activities').add({
            message: 'Add home credit ' + amount + ' tk',
            date: new Date(),
            hc: parseInt(amount)
        })
        let cost = firebase.firestore.FieldValue.increment(parseInt(amount));
        firestore().collection(props.mess_info.code).doc(selected).update({
            hc: cost
        }).then(() => {
            setAmount(null);
            setBoolean(false);
            setSelected(null);
            props.visible();
            ToastAndroid.showWithGravity(
                'Successful update',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            )
        });
    }
    useEffect(() => {

    })
    if (props.actions == 'ADD_MEAL') {
        //const [selectedValue,setSelectedValue]=useState(null);
        return (
            <View style={{ width: 350, height: 250, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Add Meal Credit</Text>
                    <Input label='Quantity' keyboardType='numeric' placeholder='Enter amount...' onChangeText={(value) => setAmount(value)}></Input>
                    <Picker selectedValue={selectedValue}
                    style={{ height: 50, width: 340 }}
                    pickerStyle={{ backgroundColor: 'red' }}
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="Select Member" value="none" />
                    {
                        props.allusers.map((user,i) => {
                            if (user.boolean !== false) {
                                return (<Picker.Item label={user.name} value={user.email} key={i}/>)
                            }
                        }

                        )
                    }
                </Picker>
                    <Button buttonStyle={{ width: 340 }} loading={boolean} title='Save' onPress={AddMeal} />
            </View>
        )
    } else {
        return (
            <View style={{ width: 350, height: 250, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Add Home Credit</Text>
                <Input label='Quantity' keyboardType='numeric' placeholder='Enter amount...' onChangeText={(value) => setAmount(value)}></Input>
                <Picker
                selectedValue={selected}
                    style={{ height: 50, width: 340 }}
                    pickerStyle={{ backgroundColor: 'red' }}
                    onValueChange={(itemValue, itemIndex) => setSelected(itemValue)}
                >
                    <Picker.Item label="Select Member" value="none" />
                    {
                        props.allusers.map((user,i) => {
                            if (user.boolean !== false) {
                                return (<Picker.Item label={user.name} value={user.email} key={i}/>)
                            }
                        }

                        )
                    }
                </Picker>
                <Button buttonStyle={{ width: 340 }} loading={boolean} title='Save' onPress={AddBill} />
            </View>
        )
    }
};
const mapStateToProps = (state) => {
    return {
        allusers: state.allusers,
        mess_info: state.mess_info,
        mess_id: state.mess_id,
    }
}
export default connect(mapStateToProps)(Overlayer);
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Appearance, TouchableOpacity, 
    StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import { Header, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign'
import { Avatar, Button } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AnimatedLoder from 'react-native-animated-loader';
import {connect} from 'react-redux';
const Profile = (props) => {
    const user = props.user_info;
    const mess=props.mess_info;
    const style = props.route.params;
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [boolean, setBoolean] = useState(false);
    const [image, setImage] = useState(null);
    const [booleans, setBooleans] = useState(false);

    useEffect(() => {
        //
        setPhone(user.phone);
        setName(user.name);
        setImage(user.image);
    },[props.user]);
    const Save = () => {
        setBoolean(true);
        firestore().collection(mess.code).doc(user.email).update({
            name: name,
            phone: phone
        }).then(() => {
            setBoolean(false);
            ToastAndroid.showWithGravity(
                "Saved Successfull.",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        })

    }
    let options = {
        title: 'Select Image',
        customButtons: [
            { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        maxHeight: 800,
        maxWidth: 800
    };
    const SaveImage = () => {
        //console.warn('User');
        setBooleans(true);
        launchImageLibrary(options, response => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
                setBooleans(false);
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                setBooleans(false);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                setBooleans(false);
            } else {
                let fileName = response.assets[0].fileName;
                const reference = storage().ref('profile/' + fileName);
                let Uri = response.assets[0].uri;
                const task = reference.putFile(Uri);
                task.then(() => {
                    storage().ref('profile/' + fileName).getDownloadURL().then((downloadURL) => {
                        setImage(downloadURL);
                        setBooleans(false);
                        ToastAndroid.showWithGravity(
                            "Saved Successfull",
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER
                          );
                        firestore().collection(mess.code).doc(user.email).update({
                            image: downloadURL
                        });
                    });
                });
            }
        });

    }
    const LeftContent = () => {
        return (
            <TouchableOpacity>
                <Icon name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icon>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ backgroundColor: style.color, height: '100%' }}>
            <Header leftComponent={<LeftContent></LeftContent>}
                centerComponent={{ text: "My Profile", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
                statusBarProps={{ barStyle: style.barStyle, backgroundColor: style.background }}
                containerStyle={{
                    backgroundColor: style.background
                }}>
            </Header>
            <ScrollView style={{ width: '100%', padding: 10 }}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Avatar
                        rounded
                        title='SB'
                        loading={true}
                        size={100}
                        source={{
                            uri: image,
                        }}
                        onPress={SaveImage}
                    >

                    </Avatar>
                    <Input style={styles.name} leftIcon={{ type: 'font-awesome', name: 'edit', color: '#3F86ED' }} label='Edit Name'
                        onChangeText={value => setName(value)}>{name}</Input>
                    <Input style={styles.phone} leftIcon={{ type: 'font-awesome', name: 'edit', color: '#3F86ED' }} label='Edit Phone'
                        onChangeText={value => setPhone(value)}>{phone}</Input>
                    <Button
                        title="Save All Changes"
                        loading={boolean}
                        onPress={Save}
                    />

                </View>
                <Text style={styles.button}>Email: {user.email}</Text>
                <View style={{ width: '100%', marginTop: 50, borderWidth: 1, borderColor: '#3F86ED', borderRadius: 10, alignItems: 'center' }}>
                    <Text style={styles.name}>Your Group Information</Text>
                    <Text style={styles.normal}>Group Name: {mess.name}</Text>
                    <Text style={styles.normal}>Group Code: {mess.code}</Text>
                    <Text style={styles.normal}>Group Address: {mess.address}</Text>
                </View>
            </ScrollView>
            <AnimatedLoder visible={booleans} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
        </View>
    );
};
const mapStateToProps = (state) => {
    return {
        user: state.user,
        user_info: state.user_info,
        mess_info: state.mess_info,
        mess_id: state.mess_id
    }
}
export default connect(mapStateToProps)(Profile);
const styles = StyleSheet.create({
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3F86ED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    phone: {
        fontSize: 15,
        color: '#3F86ED',
        fontWeight: 'bold',
    },
    normal: {
        marginTop: 10,
        fontSize: 15,
        marginTop: 0,
        marginBottom: 5,
        color: '#3F86ED',
        fontWeight: 'bold',
    },
    button: {
        marginBottom: 10,
        marginTop: 25,
        fontSize: 15,
        color: '#3F86ED',
        fontWeight: 'bold',
    }
});
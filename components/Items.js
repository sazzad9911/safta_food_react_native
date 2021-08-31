import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, Image, Appearance, TouchableOpacity,
    FlatList, Modal, StyleSheet, Pressable,ToastAndroid
} from 'react-native';
import { Header, SpeedDial, FAB ,Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import AnimatedLoder from 'react-native-animated-loader';
import Icons from 'react-native-vector-icons/AntDesign';
import Cart from './Cart';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {connect} from 'react-redux';
const Items = (props) => {
    const [boolean, setBoolean] = useState(true);
    const [search, setSearch] = useState(null);
    const [Open, setOpen] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const prop=props.route.params;
    const [image,setImage] = useState(null);
    const [headers,setHeaders] = useState(null);
    const [body,setBody] = useState(null);
    useEffect(() => {
        //
        firestore().collection('items').orderBy('like', 'desc').onSnapshot(document => {
            var x = [], i = 0;
            document.forEach(doc => {
                x[i] = doc.data();
                i++;
            });
            setSearch(x);
            setBoolean(false);
        }, err => {
            Alert.alert('Error', 'Opps faild loading.');
            setBoolean(false);
        });

        // return () => fire();
    },[]);
    const LeftContent = () => {
        return (
          <TouchableOpacity>
            <Icons name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icons>
          </TouchableOpacity>
        )
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
      const UploadImage=()=>{
          //
          launchImageLibrary(options, response => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
                //setBooleans(false);
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
               // setBooleans(false);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                //setBooleans(false);
            } else {
                setImage({fileName: response.assets[0].fileName, uri: response.assets[0].uri});
            }
        });
      }
      const Save =()=>{
          setBoolean(true);
          if(headers==null || body==null || image==null){
            setBoolean(false);
              Alert.alert("Wrong!", "Fill all the inputs.");
              return;
          }
          const reference=storage().ref('post/'+image.fileName);
          const task=reference.putFile(image.uri);
          task.then(()=>{
              reference.getDownloadURL().then(url=>{
                  firestore().collection('items').add({
                      head:headers,
                      text:body,
                      img:url,
                      like:0,
                      author:props.user.email,
                      date:new Date()
                  }).then((doc)=>{
                      setBoolean(false);
                      setModalVisible(false);
                      ToastAndroid.showWithGravity(
                        "Saved Successfull",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                      );
                      firestore().collection('items').doc(doc.id).update({
                          id:doc.id
                      });
                  })
              })
          })
      }
      const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 0,
            backgroundColor: props.background
        },
        modalView: {
            margin: 20,
            width: '90%',
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        button: {
            borderRadius: 5,
            padding: 10,
            elevation: 2,
            margin: 10,
            width: 80
        },
        buttonOpen: {
            backgroundColor: "#1E8449",
        },
        buttonClose: {
            backgroundColor: "#CB4335",
        },
        textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center"
        },
        bottomText: {
            fontSize: 15,
            color: '#2980B9',
            fontWeight: 'bold',
            marginStart: 5,
            marginEnd: 5,
            marginTop: 10,
        },
        img: {
            height: '50%',
            width: '100%',
            borderRadius: 10,
        },
        view: {
            width: '94%',
            height: 300,
            backgroundColor: '#AEB6BF',
            marginVertical: 6,
            marginHorizontal: '3%',
            borderRadius: 10,
            position: 'relative',
            shadowColor: "#000000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 1.0,
            borderRadius: 5
        },
        head: {
            fontSize: 17,
            fontWeight: 'bold',
            color: 'black',
            marginVertical: 3,
            marginHorizontal: 5,
    
        },
        text: {
            fontSize: 15,
            fontWeight: '500',
            color: 'black',
            marginVertical: 3,
            marginHorizontal: 5,
        },
        views: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
        }
    });
    return (
        <View style={{ backgroundColor: prop.color, height: '100%', width: '100%', alignItems: 'center' }}>
            <Header leftComponent={<LeftContent></LeftContent>}
                centerComponent={{ text: "My Items", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
                statusBarProps={{ barStyle: prop.barStyle, backgroundColor: prop.background }}
                containerStyle={{
                    backgroundColor: prop.background
                }}>
            </Header>
            <FlatList data={search} keyExtractor={item => item.id} renderItem={({ item, index, separators }) => (
                <Cart key={item.id} data={item} color={prop.color}></Cart>
            )}>
            </FlatList>
            <FAB placement='right'
                icon={
                    <Icon name='add' size={35} color='white' />
                }
                visible={true}
                buttonStyle={{
                    backgroundColor: '#2980B9',
                    padding: 0,
                    margin: 0,
                }}
                onPress={() => setModalVisible(true)}
            />
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={[styles.centeredView,{backgroundColor:'#2980B9'}]}>
                    <View style={styles.modalView}>
                        <View style={{width: '100%'}}>
                        <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center',margin:10}}>ADD Items</Text>
                            <Input label='Dish Name' placeholder='New dish name...'
                            onChangeText={value =>setHeaders(value)}
                            leftIcon={<Icons name="filetext1" size={20}/>}></Input>
                            <Input label='Dish Details' placeholder='Details about dish..'
                            onChangeText={value=>setBody(value)}
                            leftIcon={<Icons name="filetext1" size={20}/>}></Input>
                            <Button title='Uplad dish image'
                            buttonStyle={{borderRadius:8}}
                            onPress={UploadImage}
                            icon={<Icons name="upload" size={20} color='white' style={{marginRight: 10}}/>}></Button>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonOpen]}
                                onPress={Save}
                            >
                                <Text style={styles.textStyle}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
        </View>
    );
};
const mapStateToProps = (state) => {
    return{
        user: state.user,
    }
}
export default connect(mapStateToProps)(Items);



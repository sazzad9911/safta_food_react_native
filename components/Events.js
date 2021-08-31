import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Appearance, TouchableOpacity, Alert, FlatList, StyleSheet, Pressable, Modal, ToastAndroid } from 'react-native';
import { Header, Button, FAB, Input, Overlay, Switch } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import AnimatedLoder from 'react-native-animated-loader';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
//import Notification from './Admin/Notifications';
import {connect} from 'react-redux';
const Events = (props) => {
    const style =props.route.params;
    const [data, setData] = useState([]);
    const [boolean, setBoolean] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [headers, setHeaders] = useState(null);
    const [body, setBody] = useState(null);
    const [cost, setCost] = useState(null);
    const [activities, setActivities] = useState([]);
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        //console.log(props.allactivities[0].email+'->'+props.allactivities[0].activities.message);
        setBoolean(true);
        firestore().collection(props.mess_info.code).doc(props.user_info.email).collection('activities').onSnapshot(document => {
            var x = [], i = 0;
            document.forEach(doc => {
                x[i] = doc.data();
                i++;
            });
            setActivities(x);
        })
        firestore().collection('mess').doc(props.mess_id).collection('event').orderBy('date', 'desc').onSnapshot(document => {
            var x = [], i = 0;
            document.forEach(doc => {
                x[i] = doc.data();
                i++;
            });
            setData(x);
            setBoolean(false);

        }, error => {
            Alert.alert('Opps!', 'Data not found!');
            setBoolean(false);
        });
        if (props.user_info.email === props.mess_info.manager || props.user_info.email==='sazzad15-2521@diu.edu.bd') {
            setAdmin(true);
        }
    }, [])

    const LeftContent = () => {
        return (
            <TouchableOpacity>
                <Icon name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icon>
            </TouchableOpacity>
        )
    }
    const Save = () => {
        if (cost === null || headers === null || body === null) {
            Alert.alert('Wrong!', 'Please fill all the inputs.');
            return;
        }
        setBoolean(true);
        firestore().collection('mess').doc(props.mess_id).collection('event').add({
            cost: parseInt(cost),
            text: body,
            title: headers,
            open: true,
            date: new Date()
        }).then((doc) => {
            firestore().collection('mess').doc(props.mess_id).collection('event').doc(doc.id).update({
                id: doc.id
            });
            setBoolean(false);
            setModalVisible(false);
            ToastAndroid.showWithGravity(
                "Saved Successfull",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );

            //Notification sending----------------------------------
            //<Notification code={props.mess_info.code} title={headers} body={body}></Notification>
        })
    }
    
    const styles = StyleSheet.create({

        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: style.background
        },
        modalView: {
            margin: 20,
            width: '90%',
            height: 450,
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
            elevation: 5
        },
        button: {
            borderRadius: 5,
            width: 80,
            margin: 10,
            padding: 10,
            elevation: 2
        },
        buttonOpen: {
            backgroundColor: "#27AE60",
        },
        buttonClose: {
            backgroundColor: "#B03A2E",
        },
        textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center"
        }
    });
    return (
        <View style={{ backgroundColor: props.route.params.color, height: '100%' }}>
            <Header leftComponent={<LeftContent></LeftContent>}
                centerComponent={{ text: "My Events", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
                statusBarProps={{ barStyle: props.route.params.barStyle, backgroundColor: props.route.params.background }}
                containerStyle={{
                    backgroundColor: props.route.params.background
                }}>
            </Header>
            <FlatList data={data} keyExtractor={item => item.id}
                renderItem={({ item, index, separators }) => (
                    <Cart key={item.id} data={item} color={style.color} activities={activities}
                        admin={admin} user={props.user_info} mess={props.mess_info} messId={props.mess_id}></Cart>
                )}>
            </FlatList>
            <FAB placement='right' iconPosition='center' visible={admin} icon={
                <Icon name='plus' size={25} color='white' ></Icon>
            } onPress={() => setModalVisible(true)} />
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ width: '100%' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', margin: 10 }}>ADD Event</Text>
                            <Input label='Headline' placeholder='Name of your event...'
                                onChangeText={value => setHeaders(value)}
                                leftIcon={<Icon name="filetext1" size={20} />}></Input>
                            <Input label='Details' placeholder='Details about your event..'
                                onChangeText={value => setBody(value)}
                                leftIcon={<Icon name="filetext1" size={20} />}></Input>
                            <Input label='Cost' placeholder='Ticket fare of your event...'
                                onChangeText={value => setCost(value)}
                                keyboardType='decimal-pad'
                                leftIcon={<Icon name="filetext1" size={20} />}></Input>

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
    return {
        user: state.user,
        user_info: state.user_info,
        mess_info: state.mess_info,
        mess_id: state.mess_id,
        allusers: state.allusers,
        allactivities: state.allactivities,
    }
}
export default connect(mapStateToProps)(Events);

const Cart = (props) => {
    const data = props.data;
    const activities = props.activities;
    const admin = props.admin;
    const [color, setColor] = useState('transparent');
    const [boolean, setBoolean] = useState(false);
    const [visible, setVisible] = useState(false);
    const [option, setOption] = useState(null);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        activities.forEach(activ => {
            if (activ.ticket === data.id) {
                setBoolean(true);
            }
        });
        if (admin) {
            setColor('#2471A3');
        }
    });

    const toggleOverlay = () => {
        setVisible(!visible);
        setOption(null);
    };
    const Press = () => {
        setVisible(!visible);
        setOption(true);
    }
    const BuyTicket = (d) => {
        setLoading(true);
        firestore().collection(props.mess.code).doc(props.user.email).collection('activities').add({
            message:'Buy a ticket for '+d.title,
            date: new Date(),
            ticket: d.id
        },error=>{
            setLoading(false);
            ToastAndroid.showWithGravity(
                'Faild!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            )
        }).then(()=>{
            firestore().collection(props.mess.code).doc(props.user.email).update({
                extra: props.user.extra+parseInt(d.cost)
            });
            setLoading(false);
            ToastAndroid.showWithGravity(
                'Successful',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            )
        });
    }
    const Overlayer = (props) => {
        const data = props.data;
        const active = props.activities;
        const user=props.user;
        const mess= props.mess;
        const [date,setDate] =useState('');
        const [open, setOpen] = useState(data.open);
        useEffect(() => {
            //setOpen(data.open);
            if(option!=null){
                active.forEach(doc=>{
                    if(doc.ticket===data.id){
                        setDate(moment(doc.date.toDate()).format('DD MMM YY'));
                    }
                })
            }
        });
        const Delete =()=> {
            setLoading(true);
            setVisible(false);
            firestore().collection('mess').doc(props.messId).collection('event').doc(data.id).delete().then(()=>{
                setLoading(false);
                ToastAndroid.showWithGravity(
                    'Deleted Successful',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
            });
        }
        const Open=()=>{
            setOpen(!open);
            setVisible(false);
            var x=false;
            if(data.open==false){
                x=true;
            }else{
                x=false;
            }
            firestore().collection('mess').doc(props.messId).collection('event').doc(data.id).update({
                open:x
            }).then(()=>{
                ToastAndroid.showWithGravity(
                    'Successful',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
            });
        }
        const Views=()=>{
           // props.allactivities.forEach(doc=>{
           //     if(doc.activities)
          //  })
          Alert.alert('Opps!','We are developing this option. You can still find it on Admin panel');
        }
        return (
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                {
                    option == null ? (
                        <View style={styles.box}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Ticket Options</Text>
                            <Text style={styles.text}>You can open and close ticket or can delete ticket. To show who buy tickets, click on the subscribers button.</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                <Button title='Subscribers' type="outline" loading={loading} onPress={Views} icon={
                                    <Icon name="user" size={19} color="#2471A3" style={{ marginRight: 5 }} />
                                }></Button>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                <Button title='Delete' loading={loading} onPress={Delete} icon={
                                    <Icon name="delete" size={19} color="white" style={{ marginRight: 5 }} />
                                }></Button>
                                <Text style={styles.text}>Close</Text>
                                <Switch value={open} color="#2471A3" onValueChange={() => Open()}></Switch>
                                <Text style={styles.text}>Open</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.box}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Your Ticket</Text>
                        <Text style={styles.text}>Hello {user.name},
                        You can only view your ticket. This is the security key for {mess.name}'s event.</Text>
                        <Text style={styles.text}>EVENT ID: {data.id}, EVENT FARE: {data.cost} tk, 
                        PARSING DATE: {date}</Text>
                        </View>
                    )
                }
            </Overlay>
        )
    }
    return (
        <View style={{ width: '94%', backgroundColor: '#D6EAF8', marginLeft: '3%', marginRight: '3%', marginTop: 5, padding: 5, borderRadius: 5 }}>
            <Text style={{ color: '#2471A3', fontWeight: 'bold', fontSize: 15, margin: 5 }}>{data.title}</Text>
            <Text style={{ color: '#1E8449', fontSize: 15, margin: 5 }}>{data.text}</Text>
            <Text style={{ color: '#1E8449', fontSize: 15, margin: 5 }}>Ticket fare: {data.cost}</Text>
            <Text style={{ color: '#212F3C', fontSize: 10, margin: 5 }}>{moment(data.date.toDate()).format('DD MMM YY')}</Text>
            <View>
                <Button title="Buy Ticket" loading={loading} disabled={!data.open} onPress={() => BuyTicket(data)}
                    buttonStyle={{ margin: 5 }}
                ></Button>
                <Button title="View Ticket" disabled={!boolean} onPress={() => Press()}
                    buttonStyle={{ margin: 5, backgroundColor: '#34495E' }}
                ></Button>
            </View>
            <View style={styles.view} >
                <Button disabled={!admin} onPress={() => setVisible(true)}
                    icon={
                        <SimpleLineIcons name='options-vertical' size={30} color={color} />
                    }
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    disabledStyle={{ backgroundColor: 'transparent' }}
                ></Button>
            </View>
            <Overlayer data={data} activities={activities} user={props.user} mess={props.mess} messId={props.messId}/>
        </View>
    )
}
const styles = StyleSheet.create({
    view: {
        width: 50,
        height: 50,
        position: 'absolute',
        top: 0,
        right: 0,
    },
    text: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    box: {
        width: 330,
        alignItems: 'center',
        padding: 5
    }
});
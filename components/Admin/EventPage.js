import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const EventPage = (props) => {
    const [events, setEvents] = useState(null);
    const [allActivities, setActivities] = useState(null);
    useEffect(() => {
        firestore().collection('mess').doc(props.mess_id).collection('event').orderBy('date', 'desc').onSnapshot(document => {
            let data = [];
            document.forEach(doc => {
                if (doc.get('open')) {
                    data.push(doc.data());
                }
            })
            setEvents(data);
        });
    });
    const setSelectedValue = (value) => {
        let email = [];
        let user = [];

        console.log(props.allactivities[0].email);
        return;
        props.allactivities.map((data, i) => {
            if (data.activities) {
                data.activities.forEach(activity => {
                    if (activity.ticket == value) {
                        email.push(data.email);
                    }
                })
            }
        })
        for (let i = 0; i < email.length; i++) {
            props.allusers.forEach(doc => {
                if (email[i] == doc.email) {
                    user.push(doc);
                }
            })
        }
        setActivities(user);
    }
    if (events) {
        return (
            <View style={{width:350, height:350,borderWidth:1,borderColor:'#F8C471',borderRadius:5,alignItems: 'center',justifyContent: 'center'}}>
                <Picker
                    style={{ height: 50, width: 160, marginRight: -20 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="Select Event" value='' />
                    {
                        events.map((event, i) => {
                            return (
                                <Picker.Item label={event.title} value={event.id} key={i} />
                            )
                        })
                    }
                </Picker>
                <Text>Users Who Buy Ticket</Text>
                {
                    allActivities != null ? (
                        <FlatList data={allActivities} keyExtractor={item => item.date} renderItem={({ item }) => (
                            <Display item={item} />
                        )}></FlatList>
                    ) : (
                        <Text>Select Event First</Text>
                    )
                }
            </View>
        )
    } else {
        return (
            <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text>!No Event Created...</Text>
            </View>
        );
    }
};
const Display = (data) => {
    return (
        <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', fontColor: '#B03A2E' }}>{data.name}</Text>
            <Text style={{ fontSize: 15 }}>{data.phone}</Text>
        </View>
    )
}
const mapStateToProps = (state) => {
    return {
        mess_info: state.mess_info,
        mess_id: state.mess_id,
        allusers: state.allusers,
        allactivities: state.allactivities,
    }
}
export default connect(mapStateToProps)(EventPage);
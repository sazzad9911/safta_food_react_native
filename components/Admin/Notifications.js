import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, Text, } from 'react-native';
const Notifications = (props) => {
    const Send = (title, body) => {
        const [tokens, setTokens] = useState([]);
        useEffect(() => {
            firestore().collection('user').onSnapshot(document => {
                let token = []
                document.forEach(doc => {
                    if (props.code == doc.get('code') && doc.get('token')) {
                        token.push(doc.get('token'));
                    }
                })
                setTokens(token);
            }).then(() => {
                if (!tokens) {
                    console.log('Empty tokens on notification');
                    return;
                }
                fetch('https://safta-server.herokuapp.com/send_notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: props.title,
                        body: props.body,
                        tokens: tokens,
                    })
                })
            })
        })
    }
    return(
        <View><Text>Notification</Text></View>
    )
}
export default Notifications;


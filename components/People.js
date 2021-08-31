import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,FlatList } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import AnimatedLoder from 'react-native-animated-loader';
import { Header, Avatar } from 'react-native-elements';
const People = (props) => {
    const style = props.route.params;
    const [boolean, setBoolean] = useState(false);
    const LeftContent = () => {
        return (
            <TouchableOpacity>
                <Icon name='menu-fold' size={28} color='white' onPress={() => props.navigation.toggleDrawer()}></Icon>
            </TouchableOpacity>
        )
    }
    const [allActivities, setActivities] = useState(null);
    useEffect(() => {
        setActivities(props.allusers);
    })
    return (
        <View style={{ backgroundColor: style.color, height: '100%', width: '100%' }}>
            <Header leftComponent={<LeftContent></LeftContent>}
                centerComponent={{ text: "Peoples", style: { color: 'white', fontWeight: "bold", fontSize: 15 } }}
                statusBarProps={{ barStyle: style.barStyle, backgroundColor: style.background }}
                containerStyle={{
                    backgroundColor: style.background
                }}>
            </Header>
            {allActivities != null ? (
                <FlatList data={allActivities} keyExtractor={item => item.date} renderItem={({ item }) => (
                    <Display item={item} />
                )}></FlatList>
            ) : (
                <Text style={{ fontSize: 17, textAlign: 'center' }}>No one available.</Text>
            )}
            <AnimatedLoder visible={boolean} source={require('./6797-loader.json')} loop={true} speed={1}></AnimatedLoder>
        </View>
    );
};
const mapStateToProps = (state) => {
    return {
        user_info: state.user_info,
        allusers: state.allusers,
    }
}
export default connect(mapStateToProps)(People);
const Display = ({item}) => {
    return (
        <View style={{ backgroundColor: '#85C1E9', flex: 1,padding:10,marginLeft:'2.5%',marginTop:5,width:'95%',borderRadius:5,flexDirection: 'row'}}>
            <View>
                <Avatar
                    rounded
                    size="medium"
                    title={item.name[0]}
                    source={{
                        uri:item.image
                    }}
                />
            </View>
            <View style={{marginLeft:10}}>
            <Text style={{fontSize:18,fontWeight:'bold',color:'black'}}>{item.name}</Text>
            <Text style={{color:'black'}}>{item.email}</Text>
            </View>
        </View>
    )
}
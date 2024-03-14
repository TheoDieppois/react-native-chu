import React from 'react';
import {View, Button, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function NotificationsButton() {
    const navigation = useNavigation();
    return (
        <View>
             <Pressable onPress={() => navigation.navigate('Notifications')}>
              <View style={{ marginRight: 15 }}>
                <MaterialCommunityIcons name="bell" size={30} color="black" style={{ margin: 8 }}/>
              </View>
            </Pressable>
        </View>
    );
}
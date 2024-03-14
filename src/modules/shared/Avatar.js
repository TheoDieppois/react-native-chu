import React, {useEffect, useState} from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAvatarStore from "../../store/avatarStore";


const Avatar = () => {
    const { selectedAvatar, loadSelectedAvatar } = useAvatarStore();
    const defaultAvatarPath = require('../../../assets/images/userIcons/chat.png');

    useEffect(() => {
        loadSelectedAvatar();
    }, [loadSelectedAvatar]);

    return (
      <View style={stylesAvatar.avatarContainer}>
          <Image
              source={selectedAvatar || defaultAvatarPath}
              style={stylesAvatar.avatarIcon}
          />
      </View>
    );
  };

export default Avatar

const stylesAvatar = StyleSheet.create({
    avatarContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        overflow: 'hidden',
    },
    avatarIcon:{
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    
        
});
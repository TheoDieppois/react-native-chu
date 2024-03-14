import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, FlatList, Alert } from 'react-native';
import useAvatarStore from './../../../store/avatarStore';
import SettingsStyles from '../Settings.styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatars = [
    { id: 1, path: require('../../../../assets/images/userIcons/chat.png') },
    { id: 2, path: require('../../../../assets/images/userIcons/souris-blanche.png') },
    { id: 3, path: require('../../../../assets/images/userIcons/renard.png') },
    { id: 4, path: require('../../../../assets/images/userIcons/raton-marron.png') },
    { id: 5, path: require('../../../../assets/images/userIcons/panda3.png') },
    { id: 6, path: require('../../../../assets/images/userIcons/panda2.png') },
];

const AvatarPicker = ({ isVisible, onClose }) => {
    const { selectedAvatar, setSelectedAvatar } = useAvatarStore();
    const [messageDisplayed, setMessageDisplayed] = useState(false);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedAvatar(item.path);
                if (!messageDisplayed) {
                    setMessageDisplayed(true);
                    Alert.alert('Avatar', 'Votre avatar a été modifié.', [{ text: 'OK', onPress: onClose }]);
                }
            }}
        ><View style={{ margin: 12 }}>
            <Image
                source={item.path}
                style={{
                    width: 130,
                    height: 130,
                    resizeMode: 'contain',
                    borderWidth: selectedAvatar === item.path ? 4 : 0,
                    borderColor: selectedAvatar === item.path ? '#87CEFA' : 'transparent',
                    borderRadius: 10,
                }}
            />
        </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        if (!isVisible) {
            setMessageDisplayed(false);
        }
    }, [isVisible]);

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={SettingsStyles.modalContainer}>
                <View style={SettingsStyles.modalContent}>
                    <Text style={SettingsStyles.modalTitle}>Choisissez votre avatar !</Text>
                    <FlatList
                        data={avatars}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        numColumns={2}
                        style={SettingsStyles.iconFlatList}
                    />
                    <TouchableOpacity onPress={onClose} style={SettingsStyles.closeButton}>
                        <Text style={SettingsStyles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const AvatarSettingItem = () => {
    const [isPopupVisible, setPopupVisibility] = useState(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setPopupVisibility(true)}>
                <View style={{ ...SettingsStyles.settingItem }}>
                    <MaterialCommunityIcons name="account" size={24} color="black" style={SettingsStyles.icon} />
                    <Text style={SettingsStyles.text}>Avatar</Text>
                </View>
            </TouchableOpacity>
            <AvatarPicker isVisible={isPopupVisible} onClose={() => setPopupVisibility(false)} />
        </View>
    );
};

export default AvatarSettingItem;

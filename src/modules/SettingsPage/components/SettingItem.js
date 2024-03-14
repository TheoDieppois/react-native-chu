import React from 'react';
import { View, Text, Pressable, Switch, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import SettingsStyles from '../Settings.styles';
import { loginStore } from "../../../store/loginStore";
import { darkTheme, lightTheme } from "../../shared/Theme";
// import { themeStore } from "../../../store/themeStore";

const SettingItem = ({ iconName, text, hasToggle, onToggle, isLogout, isPrivacy }) => {
    const navigation = useNavigation();
    // const { appTheme, setAppTheme, toggle, setToggle } = themeStore();
    const { setIsLogged } = loginStore();

    // const handleToggle = () => {
    //     const newToggleValue = !toggle;
    //     setToggle(newToggleValue);
    //
    //     if (onToggle) {
    //         onToggle(newToggleValue);
    //
    //         setAppTheme((state) => {
    //             const newTheme = newToggleValue ? darkTheme : lightTheme;
    //             // console.log("Theme = " + newTheme.name);
    //             return { ...state, appTheme: newTheme };
    //         });
    //     }
    // };

    const handlePress = () => {
        if (!hasToggle) {
            if (isLogout) {
                Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Se déconnecter',
                        onPress: async () => {
                            setIsLogged(false);
                        },
                    },
                ]);
            } else if (isPrivacy) {
                navigation.navigate('PrivacyPage');
            } else {
                console.log('Non-togglable item clicked');
            }
        }
    };

    return (
        <Pressable onPress={handlePress}>
            <View style={{ ...SettingsStyles.settingItem}}>
            <MaterialCommunityIcons name={iconName} size={24} color="black" style={SettingsStyles.icon} />
                <Text style={SettingsStyles.text}>{text}</Text>
                {hasToggle && (
                    <Switch
                        value={toggle}
                        onValueChange={handleToggle}
                        style={SettingsStyles.toggleButton}
                    />
                )}
            </View>
        </Pressable>
    );
};

export default SettingItem;

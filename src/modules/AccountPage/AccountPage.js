import {View, Button, Text, Image, StyleSheet, Pressable, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import Chart from '../shared/Chart';
import { useState, useEffect } from 'react';
import { StepsService } from '../../services/StepsService/StepsService.js';
import { loginStore } from "../../store/loginStore";
import { useIsFocused } from '@react-navigation/native';
import Loader from '../Loader/Loader';
import Badge from './components/Badge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultAvatarPath from "../../../assets/images/userIcons/chat.png";
import Avatar from "../shared/Avatar";


export default function AccountPage() {
    const [arrayOfStepsDatas, setArrayOfStepsDatas] = useState([]);
    const {chuId, password, isLogged, setChuId, setPassword, setIsLogged, pkId, setPkId, challengeId, setChallengeId } = loginStore();
    const [selectedOption, setSelectedOption] = useState('mois');
    const [displayText, setDisplayText] = useState('Ce mois-ci');
    const [stepsValue, setStepsValue] = useState()
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const [isBadgeVisible, setBadgeVisible] = useState(false);
    const [badgeTitle, setBadgeTitle] = useState("")
    const [stepAchieve, setStepAchieve] = useState("")
  const openBadge = (level) => {
    switch (level) {
        case "turtle":
            setBadgeTitle("Tortue")
            setStepAchieve("100 000")
            setBadgeVisible(true);
            break;

        case "rabbit":
            setBadgeTitle("Lièvre")
            setStepAchieve("250 000")
            setBadgeVisible(true);
            break;

        case "leopard":
            setBadgeTitle("Léopard")
            setStepAchieve("500 000")
            setBadgeVisible(true);

            break;

        case "rocket":
            setBadgeTitle("Fusée")
            setStepAchieve("1 000 000")
            setBadgeVisible(true);

            break;

        default:
            break;
    }

  };

  const closeBage = () => {
    setBadgeVisible(false);
  };

    useEffect(() => {
        if(isFocused){ 
            getStepsData();
        }
    }, [isFocused]);

    const getStepsData = async () => {

        // stepsData est un tableau qui contient 3 tableaux => 1- les 5 derniers mois / 2- les 5 dernières semaines / 3- les 5 derniers jours. 
        const stepsData = await StepsService.getSteps(pkId);

        // Contient le tableau de données necessaire pour remplir le composant graphique de pas. C'est un tableau qui contient trois tableau. 
        //1) les mois 2) les semaines 3) les jours.
        setArrayOfStepsDatas(stepsData);

        setIsLoading(false);

    };
    
    const handleOptionPress = (option) => {
        setSelectedOption(option);        
    };
    useEffect(() => {
        if (arrayOfStepsDatas.length > 0) {
            switch (selectedOption) {
                case 'jours':
                    if (arrayOfStepsDatas[2] && arrayOfStepsDatas[2]?.length > 0) {
                        setStepsValue(arrayOfStepsDatas[2][arrayOfStepsDatas[2].length - 1].count);
                        setDisplayText("pas aujourd'hui");
                    }
                    break;
                case 'semaines':
                    if (arrayOfStepsDatas[1] && arrayOfStepsDatas[1]?.length > 0) {
                        setStepsValue(arrayOfStepsDatas[1][arrayOfStepsDatas[1].length - 1].count);
                        setDisplayText('pas cette semaine');
                    }
                    break;
                case 'mois':
                    if (arrayOfStepsDatas[0] && arrayOfStepsDatas[0]?.length > 0) {
                        setStepsValue(arrayOfStepsDatas[0][arrayOfStepsDatas[0].length - 1].count);
                        setDisplayText('pas ce mois-ci');
                    }
                    break;
                default:
                    if (arrayOfStepsDatas[0] && arrayOfStepsDatas[0]?.length > 0) {
                        setStepsValue(arrayOfStepsDatas[0][arrayOfStepsDatas[0].length - 1].count);
                        setDisplayText('pas ce mois-ci');
                    }
            }
        }
    }, [selectedOption, arrayOfStepsDatas]);

    return (
        <>
            {isLoading ?
            (
                <Loader></Loader>
            )
            :
            (

                <ScrollView style={{flex:1, padding:10,}} contentContainerStyle={{alignItems:'center'}}>

                    <View style={stylesAccount.avatar}>
                        <Avatar
                        />
                    </View>

                    <View style={{width:'100%', alignItems:'center' }}>
                        <Text style={{fontSize: 45, fontWeight:'bold'}}>{stepsValue} </Text>
                        <Text>{displayText}</Text>
                    </View>

                    <View style={stylesAccount.badgeContainer}>
                        <TouchableOpacity style={{height: '98%', width:'25%'}} onPress={() => openBadge("turtle")}>
                            <Image
                                source={require('../../../assets/images/badges/badge-turtle.png')}
                                style={{height: '98%', width:'100%', resizeMode:'contain'}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: '98%', width:'25%'}} onPress={() => openBadge("rabbit")}>
                            <Image
                                source={require('../../../assets/images/badges/badge-rabbit.png')}
                                style={{ height: '98%', width:'100%', resizeMode:'contain', opacity: 0.2}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: '98%', width:'25%'}} onPress={() => openBadge("leopard")}>
                            <Image
                                source={require('../../../assets/images/badges/badge-leopard.png')}
                                style={{height: '98%', width:'100%', resizeMode:'contain', opacity: 0.2}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: '98%', width:'25%'}} onPress={() => openBadge("rocket")}>
                            <Image
                                source={require('../../../assets/images/badges/badge-rocket.png')}
                                style={{height: '98%', width:'100%', resizeMode:'contain', opacity: 0.2}}
                            />
                        </TouchableOpacity>
                        <Badge isVisible={isBadgeVisible} onClose={closeBage} badgeTitle={badgeTitle} stepAchieve={stepAchieve
                        } />
                    </View>

                    <View style={{width:'100%', alignItems:'center', justifyContent:'center', marginTop:20, marginBottom:20 }}>
                        <View style={stylesAccount.testa}>
                            <TouchableOpacity
                                style={[
                                    stylesAccount.option,
                                    selectedOption === 'jours' && stylesAccount.selectedOption,
                                ]}
                                onPress={() => handleOptionPress('jours')}
                            >
                                <Text style={[
                                    stylesAccount.optionText,
                                    selectedOption === 'jours' && stylesAccount.selectedOptionText,
                                ]}>Jours</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    stylesAccount.option,
                                    selectedOption === 'semaines' && stylesAccount.selectedOption,
                                ]}
                                onPress={() => handleOptionPress('semaines')}
                            >
                                <Text style={[
                                    stylesAccount.optionText,
                                    selectedOption === 'semaines' && stylesAccount.selectedOptionText,
                                ]}>Semaines</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    stylesAccount.option,
                                    selectedOption === 'mois' && stylesAccount.selectedOption,
                                ]}
                                onPress={() => handleOptionPress('mois')}
                            >
                                <Text style={[
                                    stylesAccount.optionText,
                                    selectedOption === 'mois' && stylesAccount.selectedOptionText,
                                ]}
                                >
                                Mois
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'100%'}}>
                        { arrayOfStepsDatas.length > 0 ? <Chart delay={selectedOption} stepsData={arrayOfStepsDatas} /> : null}
                        </View>
                    </View>

                </ScrollView>
            )}
        </>
    );
}

const stylesAccount = StyleSheet.create({
    avatar:{
        backgroundColor:'white', 
        borderRadius:200,
        width:'70%',
        height:250,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity:  0.60,
        shadowRadius: 1.51,
        elevation: 10,
    },
    testa:{
        marginBottom:13,
        paddingRight:10,
        paddingLeft:7,
        flexDirection:"row", 
        justifyContent:'space-between', 
        width:'70%',
        shadowColor:'back',
        backgroundColor:'white',
        borderRadius: 30,
        shadowOffset: {
          width: 5,
          height: 1,
        },
        shadowOpacity:  0.20,
        shadowRadius: 1.51,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'grey',
        height: 35,
        alignItems:'center',
        
        
      },
      option: {
        width: '34%',
        alignItems:'center',
        paddingVertical: 5,
        
      },
      selectedOption: {
        backgroundColor: '#00B4EC',
        borderRadius: 15,

        textAlign: 'center',
        
      },
      optionText: {
        textAlign: 'center',
        paddingHorizontal: 12,
        color: 'black', 
      },
      selectedOptionText: {
        color: 'white', // Couleur du texte lorsque l'option est sélectionnée
      },

    badgeContainer:{
        width:'90%',
        height:60, 
        borderRadius:30, 
        flexDirection:'row',
        paddingHorizontal: 10, 
        marginTop:10,
        backgroundColor: 'white',
        shadowColor: "black",    
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity:  0.20,
        shadowRadius: 1.51,
        elevation: 2
    }
});
import { View, Text, StyleSheet } from 'react-native'
import { useState, useEffect, useRef } from 'react';
import React from 'react'
import { PedometerService } from '../../services/PedometerService/PedometerService';
import { loginStore } from "../../store/loginStore";
import Indicator from '../shared/Indicator'
import RingProgress from './components/RingProgresss'
// import useHealthData from '../../hooks/useHealthData';
import { useIsFocused } from '@react-navigation/native';
import OnBoarding from './components/OnBoarding';
import { LoginService } from '../../services/LoginService/LoginService';


/**
 * Page qui affiche les pas de l'utilisateur.
 * Elle lance deux timers : 
 *  - un qui récupèrer les pas dans dans le téléphones toutes les secondes.
 *  - un qui lance l'enregistrement des données en base toutes les minutes.
 */
const ActivityPage = () => {

  const [dailySteps, setDailySteps] = useState(0);
  const isFirstLoading = true;
  const isFirstLoadingRef = useRef(isFirstLoading);
  const launchedTimerForLoading = useRef();
  const launchedTimerForSaving = useRef();
  const getStepsTimerValue = 1000; // en ms
  const saveStepsTimerValue = 60000; // en ms  
  const {chuId, password, isLogged, setChuId, setPassword, setIsLogged, pkId, setPkId, challengeId, setChallengeId, alreadyLoggedOnce, setAlreadyLoggedOnce} = loginStore();
  const [onBoardingVisible, setOnBoardingVisible] = useState(true)
  const isFocused = useIsFocused();

  useEffect(() => {
    
    const getSteps = async () => {

      await setIfUserAlreadyLoggedOnce();
      
      // Si premier chargement de la page
      if (!isFirstLoadingRef.current) {
        await saveData();
      }
      await loadData();

    } 

    if(isFocused){ 

      getSteps();

    }
  }, [isFocused, dailySteps]);
  
  // Méthode qui cherche si l'utilisateur s'est déja connecté.
  const setIfUserAlreadyLoggedOnce = async () => {
    // On regarde si le user s'est déja connecté pour afficher ou non le onboarding.
    const hasAlreadyLoggedOnce = await LoginService.getIfUserAlreadyLoggedOnce(pkId);

    setAlreadyLoggedOnce(hasAlreadyLoggedOnce);
  };

  // Méthode qui appelle getPedometerData toutes les 10 secondes et vérifie si les nombres de pas à évolué. 
  const loadData = async () => {

    // Si c'est le premier chargement de la page
    if(isFirstLoadingRef.current) {

      // On récupère les pas.
      const stepsNumber = await getPedometerData();
      
      setDailySteps(stepsNumber);

    }
    else { // Si la page a déja été chargée.

      // On supprime l'ancien timer si il y en à déja un de lancé.
      if (launchedTimerForLoading.current) {
        await clearTimeout(launchedTimerForLoading.current);
      }
      // On lance le timer qui va vérifier le nombre de pas à intervalles régulières.
      const reloadStepsInterval = setInterval(async () => {

        const stepsNumber = await getPedometerData();
  
        setDailySteps(stepsNumber);
  
      }, getStepsTimerValue);
      
      // On reférence le timer et le met dans le useRef launchedTimerForLoading afin de pouvoir le récup et le supprimer ( après rechargement de la page ).
      launchedTimerForLoading.current=reloadStepsInterval;
      
      return () => clearInterval(reloadStepsInterval);

    }
  };

  // Fonction qui récupère les pas de l'utilisateur en appelant le service PedometerService.
  const getPedometerData = async () => {
    
    const stepsNumber = await PedometerService.getDailySteps();

    // On indique la page a été chargée une premiere fois.
    isFirstLoadingRef.current = false;

    return stepsNumber;
    
  };

  // Méthode qui appelle saveSteps toutes les minutes.
  const saveData = async () => {

    // On supprime l'ancien timer si il y en à déja un de lancé.
    if (launchedTimerForSaving.current) {
      await clearTimeout(launchedTimerForSaving.current);
    }

    const saveStepsInterval = setInterval(async () => {
      await saveSteps(dailySteps);
    }, saveStepsTimerValue);
    
    // On reférence le timer et le met dans le useRef launchedTimerForSaving afin de pouvoir le récup et le supprimer ( après rechargement de la page ).
    launchedTimerForSaving.current=saveStepsInterval;

    return () => clearInterval(saveStepsInterval);
  }
  
  // Fonction qui enregistre les pas du user en appelant PedometerServices.
  const saveSteps = async (dailySteps) => {
    await PedometerService.saveSteps(dailySteps, chuId, pkId, challengeId);
  }
  const openOnBoarding = () => {
    setOnBoardingVisible(true)

  };

  const closeOnBoarding = () => {
    setAlreadyLoggedOnce(true);
  };

  return (
    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <OnBoarding isVisible={!alreadyLoggedOnce} onClose={closeOnBoarding}  />

      <View style={stylesHome.podometerContainer}>
        <RingProgress progress={dailySteps/10000} />
      </View>
      <View style={stylesHome.indicatorsContainer}>
        <Indicator iconIndicator={require('../../../assets/images/home/pas.png')} textIndicator="pas aujourd'hui" 
        valueIndicator={dailySteps} haveIcon={true} />
        <Indicator iconIndicator={require('../../../assets/images/home/path-road_black.png')} textIndicator='Km parcourus' valueIndicator={(((dailySteps/100)*64)/1000).toFixed(2)} />
      </View>
      
    </View>
  );
};

export default ActivityPage;

const stylesHome = StyleSheet.create({
    podometerContainer: {
      width: '95%',
      height:'63%',
      marginBottom: 20,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity:  0.60,
      shadowRadius: 1.51,
      elevation: 1
    },
    indicatorsContainer: {
        gap:10,
        width: '95%',
    }
});

import 
{ 
    View, Button, Text, SafeAreaView, 
    TextInput, TouchableOpacity, Image, 
    ScrollView, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { loginStore } from "../../store/loginStore";
import { Formik } from 'formik';
import styles from './Login.styles'
import { useState, Children, useEffect } from 'react';
//import { LoginService } from '../../services/LoginService/LoginService';
import 'react-native-url-polyfill/auto'
import {supabase} from '../../services/supabase/supabase.js';
import { LoginService } from '../../services/LoginService/LoginService';
import * as yup from 'yup'
import * as Crypto from 'expo-crypto';


export default function LoginPage() {

    const {chuId, password, isLogged, setChuId, setPassword, setIsLogged, pkId, setPkId, challengeId, setChallengeId } = loginStore();
    
    // const qui garde en mémoire si le user à déja essayé de connecter.
    // permet d'afficher message erreur mot de passe ou identifiant.
    const [triedToLogOnce, setTriedToLogOnce] = useState(false);
    const [enteredFalsePassword, setEnteredFalsePassword] = useState(false);
    const [isChallengeOpen, setisChallengeOpen] = useState(false);
    const [noChallengeForUser, setNoChallengeForUser] = useState(false);
    

    useEffect(() => {
        logUser();
      }, [isChallengeOpen]);

    // Méthode qui log le user en changeant la valeur de  isLogged dans le store.
    const logUser = () => {

        if(isChallengeOpen)
        {
            setIsLogged(true);
        }
    }

    // méthode de vérification que les identifiants sont bien rentré. Utilise librarie yup.
    const loginValidationSchema = yup.object().shape({
        id: yup
          .string()
          .required('Identifiant requis'),
        password: yup
          .string()
          //.min(8, ({ min }) => `Password must be at least ${min} characters`)
          .max(10, ({ max }) => `Le mot de passe ne peut dépasser ${max} charactères`)
          .required('Mot de passe requis'),
      });

    // Méthode qui vérifie que les mots de passe correspondent.
      async function checkCryptedPassword(userPassword, challengePassword) {

        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            userPassword
          );

          return digest === challengePassword ? true : false;

      };

      // Méthode qui vérifie que que le user se connecte entre les dates d'ouverture du Challenge.
      const checkIfChallengeOpen = (challengeInfos) => {

        const endDate = Date.parse(challengeInfos.challenge.challenge_end);
        const startDate = Date.parse(challengeInfos.challenge.challenge_start);
        const actualDate = Date.now();
        
        // Date de test
        //const actualDate = Date.parse(new Date('2028-12-10T00:00:00'));

        if( actualDate <= endDate && actualDate >= startDate ) {
            return true;
        }

        return false;
      }
    

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <SafeAreaView style={styles.safeAreaView}>
                <Formik
                    validateOnChange={false}
                    validationSchema={loginValidationSchema}
                    initialValues={{ id: "", password: "" }}
                    onSubmit={ async (values) => {

                        // Récupère tous les challenges auxquels le user est inscrit.
                        const challengeInfosByUserId = await LoginService.getChallengeDataByUserId(values.id, values.password);

                        // Si le user n'existe pas.
                        if(challengeInfosByUserId === false) {
                            setTriedToLogOnce(true);
                            setEnteredFalsePassword(true);
                        }
                        // Si le user existe mais n'a pas de challenge à son nom.
                        else if(challengeInfosByUserId.length === 0) {
                            setNoChallengeForUser(true);
                        }
                        // Si un ou plusieurs challenges pour le user
                        else {
                            // On enregistre les identifiant du User dans le store.
                            setPkId(challengeInfosByUserId[0].user.id)
                            setChuId(values.id);
                            
                            // Vérifie quel challenge est actif parmis ceux auxquels est inscrit le user;
                            const [activeChallengeInfos] = challengeInfosByUserId.filter(objet => objet.challenge.is_active === true );

                            // Enregistre dans le store l'id du Challenge actif.
                            await setChallengeId(activeChallengeInfos.challenge.id);

                            const activeChallengePassword = activeChallengeInfos.challenge.password;

                            // check si le password est correct.
                            const isCorrectPassword = await checkCryptedPassword(values.password, activeChallengePassword);

                            if (!isCorrectPassword){
                                setTriedToLogOnce(true); // indique que le user a essayé de se connecter mais avec les mauvais identifiants.
                                setEnteredFalsePassword(true); // indique que le user a entré un mauvais MDP.
                            }
                            else { // Si tout est bon
                                setEnteredFalsePassword(false);
                                
                                //vérifie si les dates du challenge sont ouvertes pour la connexion.
                                setisChallengeOpen(checkIfChallengeOpen(activeChallengeInfos));
                                
                            }
                        }
                    }}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        isValid,
                    }) => (
                        <View style={styles.loginView}>
                            <View style={styles.logoView}>
                                <Image
                                    style={styles.logo}
                                    source={require('./images/Logo.png')}
                                />
                            </View>
                            <View style={styles.textInputView}>
                                <TextInput
                                    name="id"
                                    style={styles.textInput}
                                    placeholder='Identifiant ...'
                                    placeholderTextColor="#9f9f9f"
                                    onChangeText={handleChange('id')}
                                    value={values.id}
                                />
                                {errors.id &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.id}</Text>
                                }
                                <TextInput
                                    name="password"
                                    style={styles.textInput}
                                    secureTextEntry={true}
                                    placeholder='Mot de passe du challenge...'
                                    placeholderTextColor="#9f9f9f" 
                                    onChangeText={handleChange('password')}
                                    value={values.password}
                                    
                                />
                                {(!isChallengeOpen && triedToLogOnce && !enteredFalsePassword)  && // Si le challenge est fermé
                                    <Text style={{ fontSize: 10, color: 'red' }}>Le challenge n'est pas accessible pour le moment.</Text>
                                }
                                {noChallengeForUser && // Si pas de challenge pour le user.
                                    <Text style={{ fontSize: 10, color: 'red' }}>Vous n'êtes inscrit à aucun Challenge</Text>
                                }
                                {(!isLogged && triedToLogOnce && enteredFalsePassword)  && // si mot de passe incorrect on affiche ce message.
                                    <Text style={{ fontSize: 10, color: 'red' }}>Identifiant ou mot de passe incorrect</Text>
                                }
                                {errors.password &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
                                }
                            </View>
                            <View style={styles.buttonView}>
                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Se connecter</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.bottomIcon}>
                                <Image
                                    style={styles.cesiIcon}
                                    source={require('./images/logoCesi.png')}
                                />
                                <Image
                                    style={styles.chuIcon}
                                    source={require('./images/logo-CHU.png')}
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </SafeAreaView>
        </ScrollView>
    );
}
import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';

const Badge = ({ isVisible, onClose, badgeTitle, stepAchieve }) => {
    const [badgeUrl, setBadgeUrl] = useState("")
  const [success, setSuccess] = useState("")
    useEffect(() => {
        switch (badgeTitle) {
          case "Tortue":
            setBadgeUrl(require('../../../../assets/images/badges/badge-turtle.png'));
            setSuccess(true);
            break;
          
          case "Lièvre":
            setBadgeUrl(require('../../../../assets/images/badges/badge-rabbit.png'));
            setSuccess(false);
            break;
          
          case "Léopard":
            setBadgeUrl(require('../../../../assets/images/badges/badge-leopard.png'));
            setSuccess(false);
            break;
          
          case "Fusée":
            setBadgeUrl(require('../../../../assets/images/badges/badge-rocket.png'));
            setSuccess(false);
            break;
        
          default:
            setBadgeUrl(require('../../../../assets/images/badges/badge-rocket.png'));
            setSuccess(false);

            break;
        }
      }, [badgeTitle]);
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={() => onClose()}
      
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            {/* Ajoutez ici votre icône de croix ou tout autre élément que vous souhaitez utiliser */}
            <Text style={{color:'white', fontSize:15, fontWeight:'bold'}}>X</Text>
          </TouchableOpacity>
          {/* Contenu de votre modal */}
          <View style={{backgroundColor:'white', height:'50%', width:'65%', borderRadius:10, justifyContent:'center', shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity:  0.9,
      shadowRadius: 3,
      elevation: 10}}>
            {(badgeUrl !== "") &&  <Image 
                source={badgeUrl}
                style={{height: '80%', width:'100%', resizeMode:'contain'}}
            /> }
          </View>
          {success ? 
            (
                <View style={{display:'flex',flexDirection:'column', alignItems:'center', width:'100%', height:'35%', gap:10}}>
                    <Text style={{fontWeight:700, fontSize:25}}> Badge "{badgeTitle}" </Text>
                    <Text style={{fontStyle:'italic', fontSize:16, textAlign:'center'}}>Vous avez réalisé un total de {stepAchieve} pas.</Text>
                    <Text style={{fontWeight:700, fontSize:20, color:'#00B4EC'}}>Félicitations !</Text>
                </View> 
            ) 
            :
            (
                <View style={{display:'flex',flexDirection:'column', alignItems:'center', width:'100%', height:'35%', gap:10}}>
                    <Text style={{fontWeight:700, fontSize:25}}> Badge "{badgeTitle}" </Text>
                    <Text style={{fontStyle:'italic', fontSize:16, textAlign:'center'}}>Vous devez réaliser un total de {stepAchieve} pas pour obtenir ce badge.</Text>
                    {/*<Text style={{fontWeight:700, fontSize:20, color:'#00B4EC', textAlign:'center'}}>Il vous reste encore {stepAchieve} à faire.</Text>*/}
                </View>
            )
          }
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent pour l'arrière-plan
    
  },
  closeButton: {
    backgroundColor:'grey',
    borderRadius:10,
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    paddingHorizontal:12,
    zIndex: 1,
  },
  modalContent: {
    shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity:  0.9,
      shadowRadius: 3,
      elevation: 10,
    justifyContent:'center',
    gap:10,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    height:'40%',
    width:'80%',
    alignItems:'center',
  },
});

export default Badge;

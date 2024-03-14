import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useState, useEffect, useRef } from 'react';

const Indicator = ({iconIndicator, textIndicator, valueIndicator, haveIcon}) => {

  const [imgPath, setImgPath] = useState("");
  
  // Méthode qui set le chemin de l'image en fonction du nombre de pas.
  const setUrlPath = async (valueIndicator) => {

    if(valueIndicator >= 2500 && valueIndicator < 5000){
      setImgPath(require("../../../assets/images/flame/turtle-3.png"));
    }
    else if(valueIndicator >=5000 && valueIndicator < 7500){
      setImgPath(require("../../../assets/images/flame/rabbit-3.png"));
    }
    else if(valueIndicator >=7500 && valueIndicator < 10000){
      setImgPath(require("../../../assets/images/flame/leopard-3.png"));
    }
    else if(valueIndicator >= 10000){
      setImgPath(require("../../../assets/images/flame/rocket-2.png"));
    }
  };

  useEffect(() => {
      setUrlPath(valueIndicator);
  }, [valueIndicator]);
  
  return (
    <View style={stylesIndicator.indicatorItem}>
      <View style={{flexDirection: 'row', alignItems:'center'}}>
      {iconIndicator && (<Image source={iconIndicator} style={{height:'80%', width:'20%',  resizeMode: 'contain'}} />)}
        <Text style={{paddingLeft:10}}>
          <Text style={{fontSize: 45, fontWeight: 800, letterSpacing:5}}>{valueIndicator}</Text>
          <Text>{textIndicator}</Text>
        </Text>
        {(haveIcon && imgPath !== "")  && <Image source={imgPath} style={{height:'60%',  resizeMode: 'contain'}} /> }
      </View>
      
    </View>
  )
}

export default Indicator

const stylesIndicator = StyleSheet.create({
    indicatorItem:{
        padding:8,
        width: '100%',
        flexDirection: 'row',
        borderRadius: 20,
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
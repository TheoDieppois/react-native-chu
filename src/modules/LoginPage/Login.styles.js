import { StyleSheet, Text, View } from 'react-native';

export default StyleSheet.create({
    safeAreaView:{
      height:'100%',
    },
    loginView:{
      height: '100%',
      justifyContent:'center',
    },
    logoView:{
      alignItems:'center',
    },
    textInputView:{
      alignItems:'center',
      gap:20,
      
    },
    buttonView:{
      marginTop: 50,
      alignItems:'center',
    },
    textInput:{
      justifyContent:'center',
      borderWidth: 1,
      borderColor:'#00B4EC',
      padding: 10,
      fontSize: 18,
      borderRadius: 50,
      width: '70%',
    },
    button:{
      elevation: 8,
      backgroundColor: '#00B4EC',
      borderRadius: 50,
      paddingVertical: 10,
      paddingHorizontal: 12,
      width: '50%',
    },
    buttonText:{
      color:'white',
      textAlign: 'center',
      fontSize: 18,
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 50,

    },
    bottomIcon: {
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'flex-end',
      height: '20%',
      gap:50,
    },
    cesiIcon:{
      width: 110,
      height: 53,
    },
    chuIcon:{
      width: 110,
      height: 53,
    }
  });
  

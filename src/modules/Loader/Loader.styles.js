import { StyleSheet, Text, View } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // loaderImage:{
  //   width: 200,
  //   height: 200,
  //   borderWidth: 1,
  //   borderColor:'#00B4EC',
  // },
  indicator: {
    transform: [{ scaleX: 3 }, { scaleY: 3 }],
    alignItems: 'center',
    justifyContent: 'center',
  }

});
  
import { StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 25,
      marginRight: 10,
    },
    textContainer: {
        flex: 1,
        paddingRight: 5,
    },
    message: {
        fontSize: 15,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalHeaderMessage: {
        fontSize: 18,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    modalMessage: {
        fontSize: 15,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        fontSize: 16,
        color: '#fff',
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
    },

  });
  

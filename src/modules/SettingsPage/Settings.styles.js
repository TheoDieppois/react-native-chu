import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    paragraph: {
        textAlign: 'justify',
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        alignItems: 'center',
        marginBottom: 8,
        color: '#00B4EC',
    },
    container: {
        flex: 1,
        // backgroundColor: theme.backgroundColor,
        borderBottomColor: '#ccc',
        padding: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
    },
    icon: {
        marginRight: 20,
        paddingLeft: 10,
    },
    text: {
        flex: 1,
        fontSize: 18,
    },
    toggleButton: {
        marginLeft: 'auto',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 10,
        elevation: 15,
        width: '100%',
    },
    avatarItem: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarImage: {
        width: 100,
        height: 100,
        margin: 8,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        alignItems: 'center',
        margin: 8,
    },
    closeButton: {
        marginTop: 8,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    closeButtonText: {
        color: 'black',
    },
});

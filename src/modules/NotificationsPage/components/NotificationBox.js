import React, { useState } from 'react';
import { View, Text, Image, Pressable, Modal } from 'react-native';
import styles from '../../NotificationsPage/Notification.styles';

export default function NotificationsBox({ notification }) {

    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    return (
        <View>
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Image style={styles.image} source={require('../images/doctor.png')} />
                        <Text style={styles.modalHeaderMessage}>Message du CHU</Text>
                        <Text style={styles.modalMessage}>{notification?.content}</Text>
                        <Pressable onPress={closeModal}>
                            <Text style={styles.closeButton}>Fermer</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Pressable onPress={openModal} style={styles.container}>
                <Image style={styles.image} source={require('../images/doctor.png')} />
                <View style={styles.textContainer}>
                    <Text style={styles.message} numberOfLines={3}>
                        {notification?.content}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}

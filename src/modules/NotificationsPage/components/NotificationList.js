import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import NotificationsBox from './NotificationBox';
import { NotificationService } from '../../../services/NotificationService/NotificationService';

export default function NotificationsList() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const passedNotifications = await NotificationService.getPassedNotifications();
                setNotifications(passedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <ScrollView>
            {notifications.map((notification) => (
                <NotificationsBox key={notification.id} notification={notification} />
            ))}
        </ScrollView>
    );
}

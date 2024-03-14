import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import SettingsStyles from '../Settings.styles';

export default function PrivacyPage() {
    return (
        <ScrollView contentContainerStyle={SettingsStyles.container}>
            <Text style={SettingsStyles.title}>Collecte d'Informations</Text>
            <Text style={SettingsStyles.paragraph}>
                L'application collecte des informations sur votre activité physique,
                notamment le nombre de pas dans le cadre du Challenge 10 000 pas du CHU de Rouen.
                L'application permet d'obtenir des statistiques globales et personnelles.
            </Text>

            <Text style={SettingsStyles.title}>Permissions d'Accès</Text>
            <Text style={SettingsStyles.paragraph}>
                Pour fonctionner correctement, l'application peut nécessiter l'accès à certaines fonctionnalités
                de votre appareil, telles que le capteur de mouvement. Ces autorisations sont utilisées
                exclusivement pour vous offrir une expérience optimale.
            </Text>

            <Text style={SettingsStyles.title}>Utilisation des Données</Text>
            <Text style={SettingsStyles.paragraph}>
                Les données collectées ne sont utilisées que dans le cadre de l'application. Aucune information
                personnelle n'est partagée avec des tiers sans votre consentement.
            </Text>

            <Text style={SettingsStyles.title}>Mises à Jour de la Politique de Confidentialité</Text>
            <Text style={SettingsStyles.paragraph}>
                Cette politique de confidentialité peut être mise à jour. Les modifications seront publiées sur
                cette page et prendront effet immédiatement.
            </Text>
        </ScrollView>
    );
}

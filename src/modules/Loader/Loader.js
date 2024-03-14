import {View, ActivityIndicator} from 'react-native';

import styles from './Loader.styles';

export default function Loader() {

    return (
        <View style={[styles.container]}>
            <ActivityIndicator size="large" color="#00B4EC" style={styles.indicator} />
        </View>
    )
}

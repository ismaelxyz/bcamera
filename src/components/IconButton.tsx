import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';


interface IconButtonProps {
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    size?: number;
    color?: string;
}


const IconButton: React.FC<IconButtonProps> = ({
    iconName,
    onPress,
    size = 30,
    color = 'black',
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name={iconName} onPress={onPress} size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: 'white', borderRadius: 5, padding: 2 }

});

export default IconButton;
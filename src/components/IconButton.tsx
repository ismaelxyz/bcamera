import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// react-native-gesture-handler and react-native-reanimated
interface IconButtonProps {
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    size?: number;
    color?: string;
}


export const IconButton: React.FC<IconButtonProps> = ({
    iconName,
    onPress,
    size = 30,
    color = 'black',
}) => {
    return (
        <PressableOpacity style={styles.container}>
            <Ionicons name={iconName} onPress={onPress} size={size} color={color} disabledOpacity={0.4} />
        </PressableOpacity>
    );
};

interface MaterialButtonProps {
    iconName: string;
    onPress: () => void;
    size?: number;
    color?: string;
}

export const MaterialButton: React.FC<MaterialButtonProps> = ({
    iconName,
    onPress,
    size = 30,
    color = 'black',
}) => {
    return (
        <PressableOpacity style={styles.container} disabledOpacity={0.4}>
            <MaterialIcon name={iconName} onPress={onPress} size={size} color={color}  />
        </PressableOpacity>
    );
};




const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 2
    }

});

// export default IconButton;
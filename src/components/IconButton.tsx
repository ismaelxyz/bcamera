import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';


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
        <TouchableOpacity style={styles.container}>
            <Ionicons name={iconName} onPress={onPress} size={size} color={color} disabledOpacity={0.4} />
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.container}>
            <MaterialIcon name={iconName} onPress={onPress} size={size} color={color}  />
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 2
    }

});

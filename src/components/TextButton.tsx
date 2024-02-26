import { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

interface TextButtonProps {
    text: string
}

export default function TextButton({ text }: TextButtonProps): React.ReactElement<TextButtonProps> {
    const [pressed, setPressed] = useState(false);

    const handlePress = () => {
        setPressed(!pressed);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[styles.button, pressed && styles.buttonPressed]}
        >
            <Text style={styles.buttonText}>{text}</Text>
            {pressed && <View style={styles.diagonalLine} />}
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        padding: 0,
        borderRadius: 5,
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonPressed: {
        backgroundColor: 'white',
    },
    buttonText: {
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 0,
    },
    diagonalLine: {
        position: 'absolute',
        width: '100%',
        height: 2,
        backgroundColor: 'black',
        transform: [{ rotate: '45deg' }],
    },
});

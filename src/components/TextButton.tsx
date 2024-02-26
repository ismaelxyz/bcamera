import { TouchableOpacity, StyleSheet, Text } from 'react-native';


interface TextButtonProps {
    text: string;
    onPress: () => void;
}


export default function TextButton({ text, onPress }: TextButtonProps): React.ReactElement<TextButtonProps> {
  
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{text}</Text>
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
    }
});

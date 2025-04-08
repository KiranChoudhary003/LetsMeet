import React, { useState } from 'react'
import { Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ellipse from '../../assets/Ellipse.png'
import ellipseBottom from '../../assets/EllipseBottom.png'
import ellipseTwo from '../../assets/EllipseTwo.png'
import ellipseBottomTwo from '../../assets/EllipseBottomTwo.png'
import logo from '../../assets/logo.png'
import CheckBox from '@react-native-community/checkbox'

const Login = ({ navigation }) => {

    const [agree, setAgree] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!agree) {
            setError('You must agree to continue');
            return;
        }

        setError('');
        Alert.alert('Submitted!', 'Thank you for agreeing.');
    }

    return (
        <View style={styles.container}>
            <Image source={ellipse} style={styles.ellipseTop} />
            <Image source={ellipseTwo} style={styles.ellipseTop} />
            <Image source={logo} style={styles.logo} />
            <Text style={styles.text}>Log-in</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
            />
            <View style={styles.password}>
                <View style={styles.checkContainer}>
                    <CheckBox
                        value={agree}
                        onValueChange={setAgree}
                        tintColors={{ true: '#7680DE', false: 'gray' }}
                    />
                    <Text style={styles.remember}>Remember me</Text>
                </View>

                <Text style={styles.forgotPassword}>Forgot password</Text>
            </View>
            <TouchableOpacity style={styles.button} >
                <Text style={styles.buttonText}>Log-in</Text>
            </TouchableOpacity>
            <View style={styles.signUpSection}>
                <Text style={styles.account}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUp}>sign up</Text>
                </TouchableOpacity>
            </View>
            <Image source={ellipseBottom} style={styles.ellipseBottom} />
            <Image source={ellipseBottomTwo} style={styles.ellipseBottomTwo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        position: 'relative',
    },
    ellipseTop: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    ellipseBottom: {
        position: "absolute",
        bottom: 0,
        right: 0,
    },
    ellipseBottomTwo: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width : "100%"
    },
    logo: {
        width: 210,
        height: 209,
        resizeMode: 'contain',
        borderRadius: 105,
        marginTop: 135,
    },
    text: {
        fontSize: 35,
        fontWeight: "bold",
        color: "#4658F3",
    },
    input: {
        width: 313,
        height: 43,
        backgroundColor: "#7680DE4D",
        margin: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: "#000000",
    },
    password: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '75%',
        alignItems: 'center'
    },
    checkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },

    remember: {
        fontSize: 12,
        color: '#000',
        // space between checkbox and text
    },
    forgotPassword: {
        fontSize: 12,
        color: '#000'
    },
    button: {
        width: 194,
        height: 39,
        backgroundColor: '#7680DE',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    signUpSection: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row"
    },
    signUp: {
        color: '#777',
        fontSize : 12
    },
    account : {
        fontSize : 12,
    }
})

export default Login
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import ellipse from '../../assets/Ellipse.png'
import ellipseTwo from '../../assets/EllipseTwo.png'
import ellipseBottom from '../../assets/EllipseBottom.png'
import ellipseBottomTwo from '../../assets/EllipseBottomTwo.png'
import { VELOCITY_EPS } from 'react-native-reanimated/lib/typescript/animation/decay/utils';
import { accessibilityProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import { ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

const SignUp = ({navigation}) => {
    const [jobRole, setJobRole] = useState('');
    const [visible, setVisible] = useState(false);
    const [secondJobRole, setSecondJobRole] = useState('');
    const [secondVisible, setSecondVisible] = useState(false);

    const roles = [
        'Software Developer',
        'Data Scientist',
        'Database Administrator',
        'Computer Systems Analyst',
        'Web Developer',
        'DevOps Engineer',
        'Network Engineer',
        'IT Project Manager'
    ];


    return (
        <Provider>
            <View style={styles.container}>
                <Image source={ellipse} style={styles.ellipseTopOne} />
                <Image source={ellipseTwo} style={styles.ellipseTopTwo} />
                <Text style={styles.text}>Create Account</Text>
                <TextInput style={styles.input} placeholder='First Name' />
                <TextInput style={styles.input} placeholder='Last Name' />
                <TextInput style={styles.input} placeholder='E-mail' />
                <TextInput style={styles.input} placeholder='LinkedIn URL' />
                contentStyle={styles.menuContent} // Style for the dropdown container

                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentStyle={styles.menuContent} // Style for the dropdown container
                    anchor={
                        <TouchableOpacity
                            onPress={() => setVisible(true)}
                            style={styles.input} // same style as TextInput
                        >
                            <Text style={styles.anchorText}>
                                {jobRole || 'Role'}
                            </Text>
                        </TouchableOpacity>
                    }
                >
                    {roles.map((role) => (
                        <Menu.Item
                            key={role}
                            onPress={() => {
                                setJobRole(role);
                                setVisible(false);
                            }}
                            title={role}
                            titleStyle={styles.menuItemTitle} // customize title style if needed
                        />
                    ))}
                </Menu>

                {/* Second Menu example with similar styles */}
                <Menu
                    visible={secondVisible}
                    onDismiss={() => setSecondVisible(false)}
                    contentStyle={styles.menuContent}
                    anchor={
                        <TouchableOpacity
                            onPress={() => setSecondVisible(true)}
                            style={styles.input}
                        >
                            <Text style={styles.anchorText}>
                                {secondJobRole || 'Preferences'}
                            </Text>
                        </TouchableOpacity>
                    }
                >
                    {roles.map((role) => (
                        <Menu.Item
                            key={role}
                            onPress={() => {
                                setSecondJobRole(role);
                                setSecondVisible(false);
                            }}
                            title={role}
                            titleStyle={styles.menuItemTitle}
                        />
                    ))}
                </Menu>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Sign-in</Text>
                </TouchableOpacity>
                <View style={styles.condition}>
                    <Text style={styles.agree}>By continuing you agree to all </Text>
                    <Text style={styles.terms}>terms, condition </Text>
                </View>
                <View style={styles.privacy}>
                    <Text style={styles.and}>& </Text>
                    <Text style={styles.policy}>privacy policy</Text>
                </View>
                <View style={styles.account}>
                    <Text style={styles.already}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.login}>log-in</Text>
                    </TouchableOpacity>
                </View>
                <Image source={ellipseBottom} style={styles.ellipseBottom} />
                <Image source={ellipseBottomTwo} style={styles.ellipseBottomTwo} />
                <Image />
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 25,
        color: "#465BF3",
        fontWeight: "bold"
    },
    input: {
        width: 313,
        height: 43,
        margin: 15,
        borderRadius: 5,
        backgroundColor: "#7680DE4D",
        paddingHorizontal: 10,
        color: "#000000",
        // alignItems: 'center',
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
        color: 'white',
        fontWeight: 'bold',
    },
    ellipseTopOne: {
        position: "absolute",
        top: -70,
        left: 0
    },
    ellipseTopTwo: {
        position: "absolute",
        top: -100,
        left: 50
    },
    ellipseBottom: {
        position: "absolute",
        bottom: -80,
        right: 0
    },
    ellipseBottomTwo: {
        position: "absolute",
        bottom: -80,
        left: 0
    },
    anchorText: {
        color: '#555',
    },
    menuItemTitle: {
        width: 306,
        height: 34
    },
    condition: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10
    },
    agree: {
        fontSize: 12
    },
    terms: {
        fontSize: 12,
        color: "#7680DE"
    },
    privacy: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5
    },
    and: {
        fontSize: 12
    },
    policy: {
        fontSize: 12,
        color: "#7680DE"
    },
    account: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        bottom: -50,
        left: 0
    },
    already: {
        fontSize: 12
    },
    login: {
        fontSize: 12,
        color: '#777'
    }
});

export default SignUp;
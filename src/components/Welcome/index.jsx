import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import logo from '../../assets/logo.png';
import ellipse from '../../assets/Ellipse.png';
import ellipseBottom from '../../assets/EllipseBottom.png';
import ellipseTwo from '../../assets/EllipseTwo.png';
import { TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const Welcome = ({navigation}) => {
  const colorAnim = useRef(new Animated.Value(0)).current; // For blue rays
  const textFadeAnim = useRef(new Animated.Value(0)).current; // For Welcome text

  useEffect(() => {
    // Start blue rays animation after 3 sec
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 1500,
      delay: 1500, // Start after 3 sec
      useNativeDriver: false,
    }).start(() => {
      // Start Welcome text fade-in animation after rays are fully in
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1500,
        delay: 500, // Short delay after rays
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => navigation.navigate('Login')}>
      {/* Background color animation */}
      <Animated.View
        style={[
          styles.animatedBg,
          {
            backgroundColor: colorAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(255, 255, 255, 1)', '#7680DE4D'], // Semi-transparent blue
            }),
          },
        ]}
      />

      {/* Background Ellipses */}
      <Image source={ellipse} style={styles.ellipseTop} />
      <Image source={ellipseTwo} style={styles.ellipseTop} />
      <Image source={ellipseBottom} style={styles.ellipseBottom} />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* Welcome Text (Appears after color animation) */}
      <Animated.Text style={[styles.text, { opacity: textFadeAnim }]}>
        WELCOME
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', // Initial background
    position: 'relative',
  },
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
  logoContainer: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  logo: {
    width: 210,
    height: 209,
    resizeMode: 'contain',
    borderRadius: 105,
  },
  text: {
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  ellipseTop: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  ellipseBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default Welcome;

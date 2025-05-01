import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
// import { useNavigation } from '@react-navigation/native';
import ellipse from '../../assets/qrcodeFirst.png'
import ellipseTwo from '../../assets/qrcodetwo.png'
import ellipseBottom from '../../assets/qrcodethree.png'
import ellipseBottomTwo from '../../assets/qrcodefour.png'

const QRCodeScreen = ({ route, navigation }) => {

  const {
    firstName,
    lastName,
    email,
    password,
    linkedin,
    jobRole,
    preferences
  } = route.params;

  const userData = {
    firstName,
    lastName,
    email,
    password,
    linkedin,
    jobRole,
    preferences: Array.isArray(preferences) ? preferences.join(', ') : preferences,
  };

  const qrValue = JSON.stringify(userData);

  const handleShare = async () => {
    try {
      await Share.share({
        message: qrValue,
      });
    } catch (error) {
      console.log('Share error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={ellipse} style={styles.ellipseTopOne} />
      <Image source={ellipseTwo} style={styles.ellipseTopTwo} />
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
          <Text style={styles.headerTitle}>Scan</Text>
        </TouchableOpacity>
        <View style={{ width: 24 }} /> {/* Placeholder to center title */}
      </View>

      {/* QR Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Scan QR</Text>
        <View style={styles.qrBox}>
          <QRCode value={qrValue} size={180} />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            {/* Replace icon with text */}
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image source={ellipseBottom} style={styles.ellipseBottomTwo} />
      <Image source={ellipseBottomTwo} style={styles.ellipseBottom} />
    </View>
  );
};

export default QRCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEEFF',
    padding: 20,
    alignItems: 'center'
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBackText: {
    fontSize: 16,
    color: '#000',
  },
  card: {
    marginTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: 295,
    height: 485
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    marginTop: 15
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 110,
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  button: {
    width: 118,
    height: 36,
    backgroundColor: '#E4E4E4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
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

});

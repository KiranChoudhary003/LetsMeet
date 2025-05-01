import haversine from 'haversine';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, ImageBackground, Modal, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, RESULTS, check, openSettings, request } from 'react-native-permissions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

const events = [
    { id: 1, name: 'Tech Conference', location: 'Jaipur, Rajasthan', date: '04-26-2025', latitude: 26.9124, longitude: 75.7873 },
    { id: 2, name: 'Marketing Summit', location: 'Jodhpur, Rajasthan', date: '04-26-2025', latitude: 26.2389, longitude: 73.0243 },
    { id: 3, name: 'AI Expo', location: 'Udaipur, Rajasthan', date: '04-28-2025', latitude: 24.5854, longitude: 73.7125 },
    { id: 4, name: 'Developer Meetup', location: 'Ajmer, Rajasthan', date: '04-25-2025', latitude: 26.4499, longitude: 74.6399 },
    { id: 5, name: 'Startup Pitch', location: 'Bikaner, Rajasthan', date: '04-26-2025', latitude: 28.0229, longitude: 73.3119 },
    { id: 6, name: 'Design Workshop', location: 'Kota, Rajasthan', date: '04-25-2025', latitude: 25.2138, longitude: 75.8648 },
    { id: 7, name: 'Product Launch', location: 'Alwar, Rajasthan', date: '04-25-2025', latitude: 27.552990, longitude: 76.634573 },
    { id: 8, name: 'Cloud Symposium', location: 'Bhilwara, Rajasthan', date: '05-01-2025', latitude: 25.3463, longitude: 74.6353 },
    { id: 9, name: 'Cybersecurity Forum', location: 'Sikar, Rajasthan', date: '05-02-2025', latitude: 27.6094, longitude: 75.1399 },
    { id: 10, name: 'E-commerce Expo', location: 'Barmer, Rajasthan', date: '04-26-2025', latitude: 25.7452, longitude: 71.4167 },
    { id: 11, name: 'Mobile World', location: 'Churu, Rajasthan', date: '05-05-2025', latitude: 28.3006, longitude: 74.9668 },
    { id: 12, name: 'Green Energy Meet', location: 'Jhunjhunu, Rajasthan', date: '04-26-2025', latitude: 28.1284, longitude: 75.3992 },
    { id: 13, name: 'FinTech Fair', location: 'Bharatpur, Rajasthan', date: '04-26-2025', latitude: 27.2173, longitude: 77.4895 },
    { id: 14, name: 'Robotics Con', location: 'Tonk, Rajasthan', date: '05-09-2025', latitude: 26.1667, longitude: 75.7833 },
    { id: 15, name: 'UX/UI Design Day', location: 'Pali, Rajasthan', date: '04-29-2025', latitude: 25.7725, longitude: 73.3234 },
];

const EventAttend = () => {
    const [selectedFilter, setSelectedFilter] = useState('Global');
    const [showFilters, setShowFilters] = useState(false);
    const [showCheckin, setCheckin] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [customDate, setCustomDate] = useState(null);
    const [hasDateBeenPicked, setHasDateBeenPicked] = useState(false);
    const [previousFilter, setPreviousFilter] = useState(selectedFilter);
    const [attendedEvents, setAttendedEvents] = useState({});
    const [toast, setToast] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [userLocation, setUserLocation] = useState(null);
    const [eventProximity, setEventProximity] = useState({});
    const [initialProximityNotified, setInitialProximityNotified] = useState({});
    const [toastQueue, setToastQueue] = useState([]);
    const [currentToast, setCurrentToast] = useState('');
    const eventProximityRef = useRef(eventProximity);
    const lastToastState = useRef({});

    useEffect(() => {
        if (!currentToast && toastQueue.length > 0) {
            const nextToast = toastQueue[0];
            setCurrentToast(nextToast);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    }).start(() => {
                        setCurrentToast('');
                        setToastQueue(prevQueue => prevQueue.slice(1));
                    });
                }, 2500);
            });
        }
    }, [toastQueue, currentToast, fadeAnim]);


    useEffect(() => {
        if (toast) {
            setToastQueue(prevQueue => [...prevQueue, toast]);
            setToast('');
        }
    }, [toast]);

    // loaction tracker of the user
    useEffect(() => {
        const requestLocation = async () => {
            try {
                let permissionStatus;

                if (Platform.OS === 'android') {
                    permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

                    if (permissionStatus === RESULTS.DENIED) {
                        permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                    }

                    if (permissionStatus === RESULTS.BLOCKED) {
                        Alert.alert(
                            'Location Permission Required',
                            'Please enable location access from settings to use this feature.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Open Settings', onPress: () => openSettings() },
                            ]
                        );
                        return;
                    }

                    if (permissionStatus !== RESULTS.GRANTED) {
                        setToast('Location permission not granted.');
                        return;
                    }
                }

                if (Platform.OS === 'ios') {
                    permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

                    if (permissionStatus === RESULTS.DENIED) {
                        permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                    }

                    if (permissionStatus === RESULTS.BLOCKED) {
                        Alert.alert(
                            'Location Permission Required',
                            'Please enable location access from settings to use this feature.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Open Settings', onPress: () => openSettings() },
                            ]
                        );
                        return;
                    }

                    if (permissionStatus !== RESULTS.GRANTED) {
                        setToast('Location permission not granted.');
                        return;
                    }
                }

                // If permission granted, fetch current location
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ latitude, longitude });
                        // setToast(`User location: Latitude: ${latitude}, Longitude: ${longitude}`);
                    },
                    (error) => {
                        setToast('Failed to fetch location. Please try again.');
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                        forceRequestLocation: true,
                        showLocationDialog: true,
                    }
                );
            } catch (error) {
                setToast('Error occurred while requesting location.');
                console.error(error);
            }
        };

        requestLocation();
    }, []);



    useEffect(() => {
        eventProximityRef.current = eventProximity;
    }, [eventProximity]);


    // check in distance calculator
    useEffect(() => {
        if (userLocation) {
            const updatedProximity = { ...eventProximityRef.current };
            const updatedToastState = { ...lastToastState.current };

            events.forEach((event) => {
                const eventId = event.id;
                if (attendedEvents[eventId]) {
                    const isNearby = isWithinRadius(userLocation, {
                        latitude: event.latitude,
                        longitude: event.longitude,
                    });

                    const previousState = updatedToastState[eventId];
                    const [month, day, year] = event.date.split('-');
                    const eventDate = new Date(`${year}-${month}-${day}`);
                    const isEventToday = isSameDate(eventDate, new Date());

                    if (isEventToday) {
                        if (isNearby && previousState === undefined && !initialProximityNotified[eventId]) {
                            setToast(`You're near "${event.name}" Event. You can now check in!`);
                            setInitialProximityNotified(prev => ({ ...prev, [eventId]: true }));
                        } else if (previousState !== isNearby) {
                            if (isNearby) {
                                setToast(`You're near "${event.name}" Event. You can now check in!`);
                            } else {
                                setToast(`Check-in is only available when you are near the "${event.name}" event.`);
                            }
                        }
                    }

                    updatedProximity[eventId] = { isNearby };
                    updatedToastState[eventId] = isNearby;
                }
            });

            setEventProximity(updatedProximity);
            lastToastState.current = updatedToastState;
        }
    }, [userLocation, attendedEvents, initialProximityNotified]);

    const isWithinRadius = (userLoc, eventLoc) => {
        const distance = haversine(userLoc, eventLoc, { unit: 'km' });
        const RADIUS_KM = 115;
        return distance <= RADIUS_KM;
    };

    const isWithinFilterRadius = (userLoc, eventLoc) => {
        const distance = haversine(userLoc, eventLoc, { unit: 'km' });
        const RADIUS_KM = 150;
        return distance <= RADIUS_KM;
    };

    const handleCheckIn = (eventId) => {
        setAttendedEvents((prev) => ({ ...prev, [eventId]: true }));
        setCheckin(true);
    };

    const handleAttend = (id, name) => {
        setAttendedEvents(prev => ({ ...prev, [id]: true }));
        setToast(`Event ${name} Registered Successfully`);
    };

    const formatDate = (date) => {
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}-${dd}-${yyyy}`;
    };

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDate = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const filteredEvents = events.filter(({ date, latitude, longitude }) => {
        const [month, day, year] = date.split('-');
        const eventDate = new Date(`${year}-${month}-${day}`);

        if (selectedFilter === 'Today') { return isSameDate(eventDate, today); }
        if (selectedFilter === 'Tomorrow') { return isSameDate(eventDate, tomorrow); }
        if (selectedFilter === 'Choose from Calendar' && customDate) { return isSameDate(eventDate, customDate); }
        if (selectedFilter === 'Near Me' && userLocation) {
            return isWithinFilterRadius(userLocation, { latitude, longitude });
        }
        return selectedFilter === 'Global';
    });

    const handleFilterChange = (option) => {
        setSelectedFilter(option);
        if (option === 'Choose from Calendar') {
            setCustomDate(null);
            setShowDatePicker(true);
        }
        setShowFilters(false);
    };

    const isToday = (eventDate) => {
        const [month, day, year] = eventDate.split('-');
        const eventDateObj = new Date(`${year}-${month}-${day}`);
        const currentDate = new Date();
        return eventDateObj.toDateString() === currentDate.toDateString();
    };

    const getCheckinButtonStyle = (isNearby, isEventToday) => ({
        opacity: (isNearby === false || !isEventToday) ? 0.3 : 1,
        backgroundColor: (isNearby === false || !isEventToday) ? 'gray' : 'transparent',
        borderColor: (isNearby === false || !isEventToday) ? 'gray' : 'rgba(157, 9, 11, 0.96)',
    });


    return (
        <ImageBackground source={require('../../assets/Event-check-in-page.webp')} style={styles.fullFlex}>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#eae6ff" />

                {/* Header */}
                <View style={styles.headingContainer}>
                    <View>
                        <TouchableOpacity style={styles.arrow}>
                            <Ionicons name="arrow-back-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer}>
                        <View>
                            <Text style={styles.title}>Events</Text>
                        </View>
                        <View style={styles.selectedFilterContainer}>
                            {selectedFilter !== 'Global' ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedFilter('Global');
                                        setCustomDate(undefined);
                                    }}
                                    style={styles.clearFilterButton}
                                >
                                    <Text style={styles.selectedFilter}>
                                        {customDate && selectedFilter === 'Choose from Calendar'
                                            ? `${formatDate(customDate)} ×`
                                            : `${selectedFilter} ×`}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.selectedFilter}>Global</Text>
                            )}
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => {
                            setPreviousFilter(selectedFilter);
                            setShowFilters(!showFilters);
                        }}>
                            <View style={styles.filterContainer}>
                                <Text style={styles.filterButtonText}>Filter</Text>
                                <View style={styles.filterIcon}>
                                    <Ionicons name="filter" size={16} color="black" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Show Filter Option */}
                {showFilters && (
                    <Modal
                        animationType="slide"
                        transparent
                        visible={showFilters}
                        onRequestClose={() => setShowFilters(false)}
                    >
                        <TouchableOpacity
                            style={styles.filterOptionsContainer}
                            activeOpacity={1}
                            onPressOut={() => setShowFilters(false)}
                        >
                            <TouchableWithoutFeedback>
                                <View style={styles.filterOptions}>
                                    {['Global', 'Today', 'Tomorrow', 'Choose from Calendar', 'Near Me'].map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[styles.filterOption, selectedFilter === option && styles.filterActive]}
                                            onPress={() => handleFilterChange(option)}
                                        >
                                            <Text style={styles.filterText}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>
                )}

                {/* Checkin Model */}
                {showCheckin && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={showCheckin}
                        onRequestClose={() => setCheckin(false)}
                    >
                        <View style={styles.checkinModalOverlay}>
                            <View style={styles.checkinmodalContent}>
                                <Text style={styles.checkinmodalText}>Check-in Successful!</Text>
                                <LottieView
                                    style={styles.lottieContainer}
                                    source={require('../../assets/checkBox-tick.json')}
                                    autoPlay
                                    loop={false}
                                    resizeMode="cover"
                                    onAnimationFinish={() => { setCheckin(false); }}
                                />
                            </View>
                        </View>
                    </Modal>
                )}

                {/* Show Date Picker */}
                {showDatePicker && (
                    <Modal
                        animationType="fade"
                        transparent
                        visible={showDatePicker}
                        onRequestClose={() => {
                            setHasDateBeenPicked(false);
                            setShowDatePicker(false);
                        }}
                    >
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPressOut={() => {
                                if (!hasDateBeenPicked) {
                                    setCustomDate(undefined);
                                    setSelectedFilter(previousFilter);
                                }
                                setHasDateBeenPicked(false);
                                setShowDatePicker(false);
                            }}
                        >
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => {
                                            setShowDatePicker(false);
                                            setHasDateBeenPicked(false);
                                            setSelectedFilter(previousFilter);
                                        }}
                                    >
                                        <Text style={styles.closeButtonText}>×</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.modalTitle}>Select a Date</Text>
                                    <Calendar
                                        current={customDate ? customDate.toISOString().split('T')[0] : undefined}
                                        onDayPress={({ dateString }) => {
                                            const [year, month, day] = dateString.split('-');
                                            const pickedDate = new Date(year, month - 1, day);
                                            setCustomDate(pickedDate);
                                            setSelectedFilter('Choose from Calendar');
                                            setHasDateBeenPicked(true);
                                            setShowDatePicker(false);
                                        }}
                                        theme={{
                                            todayTextColor: '#fff',
                                            todayBackgroundColor: 'rgba(118, 128, 222, 1)',
                                        }}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>
                )}

                {/* Show Event List */}
                {filteredEvents.length === 0 ? (
                    <View style={styles.noEventContainer}>
                        <Text style={styles.notFound}>No Event found in this filter</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredEvents}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.list}
                        renderItem={({ item, index }) => (
                            <View style={styles.itemContainer}>
                                <Text style={styles.indexText}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</Text>
                                <View style={styles.card}>
                                    <View style={styles.eventDetails}>
                                        <Text style={styles.eventTitle} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                                        <View style={styles.locationContainer}>
                                            <Ionicons name="location" size={14} color="black" />
                                            <Text style={styles.eventLocation}>{item.location}</Text>
                                        </View>
                                        <View style={styles.dateContainer}>
                                            <MaterialCommunityIcons name="calendar-today" size={14} color="black" />
                                            <Text style={styles.eventDate}>{item.date}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.rightButtons}>
                                        {!attendedEvents[item.id] && (
                                            <TouchableOpacity
                                                style={styles.registerButton}
                                                onPress={() => handleAttend(item.id, item.name)}
                                            >
                                                <Text style={styles.attendText}>Register</Text>
                                            </TouchableOpacity>
                                        )}
                                        {attendedEvents[item.id] && userLocation && (
                                            <Animated.View
                                                style={[styles.checkinButton, getCheckinButtonStyle(
                                                    eventProximity[item.id]?.isNearby,
                                                    isToday(item.date)
                                                )]}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const eventName = item.name;
                                                        if (!isToday(item.date) && eventProximity[item.id]?.isNearby === false) {
                                                            setToast('Check-in will be enabled on the day of the event and when you are near the event location.');
                                                        } else if (!isToday(item.date)) {
                                                            setToast('Check-in will be available on the event date.');
                                                        } else if (eventProximity[item.id]?.isNearby === false) {
                                                            setToast(`Check-in is only available when you are near the "${eventName}" event.`);
                                                        } else {
                                                            handleCheckIn(item.id, eventName);
                                                        }
                                                    }}
                                                >
                                                    <Text style={styles.checkinText}>Check in</Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                )}

                {/* toast  */}
                {currentToast !== '' && (
                    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
                        <Text style={styles.toastText}><Text>{currentToast}</Text>
                        </Text>
                    </Animated.View>
                )}
            </View>
        </ImageBackground>
    );
};

export default EventAttend;

const styles = StyleSheet.create({
    fullFlex: { flex: 1 },
    container: { flex: 1, paddingTop: 40 },
    headingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
    titleContainer: {
        alignItems: 'center',
        paddingLeft: 18,
    },
    title: { fontSize: 22, fontWeight: 'bold' },

    list: {
        paddingHorizontal: 16,
        paddingLeft: 12,
        paddingVertical: 16,
    },

    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,  //space between the list
    },
    indexText: {
        marginRight: 4,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
    },

    card: {
        backgroundColor: 'rgba(118, 128, 222, 0.52)',
        borderRadius: 10,
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    notFound: { textAlign: 'center', marginBottom: 10, color: '#000000', fontSize: 16 },
    noEventContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    eventDetails: { flexDirection: 'column',alignItems: 'flex-start'},
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        maxWidth: 230,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap:1,
    },
    dateContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap:1,
    },
    eventLocation: { fontSize: 14, color: '#333' },
    eventDate: { fontSize: 14, color: '#333'},
    rightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    registerButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(157, 9, 11, 0.96)',
        marginLeft: 4,
    },
    attendText: { color: '#000', fontWeight: '500' },
    checkinButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(157, 9, 11, 0.96)',
        marginLeft: 4,
    },
    checkinText: { color: '#000', fontWeight: '500' },

    filterContainer: {
        flexDirection: 'row',
    },
    filterIcon: {
        marginHorizontal: 4,
    },
    filterImage: { tintColor: '#000' },
    filterButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },

    filterOptionsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        top: 55,
    },
    filterOptions: {
        backgroundColor: 'rgba(194, 200, 252, 1)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        elevation: 50,
    },
    filterOption: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 10,
    },
    filterActive: {
        backgroundColor: 'rgba(255,255,255,.29)',
    },
    filterText: { fontSize: 14, color: '#000' },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    selectedFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedFilter: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    clearFilterButton: {
        padding: 4,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: 'transparent',
        padding: 4,
    },
    closeButtonText: {
        fontSize: 24,
        color: 'red',
        fontWeight: 'bold',
    },
    toastContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        backgroundColor: '#1e293b',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 12,
    },
    toastText: {
        color: '#f8fafc',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: 0.5,
        textTransform: 'capitalize',
    },
    checkinModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background
    },
    checkinmodalContent: {
        backgroundColor: '#000',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    checkinmodalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(157, 9, 11, 0.96)', // Premium-looking color
    },
    lottieContainer: {
        height: 200,
        width: 200,
    },
});

// import React from 'react'
// import { Text, View } from 'react-native'

// const EventAttend = () => {
//   return (
//     <View>
//         <Text>
//             hello
//         </Text>
//     </View>
//   )
// }

// export default EventAttend
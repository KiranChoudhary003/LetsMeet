import React, { useRef } from "react";
import { Easing } from "react-native";

import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Pressable,
} from "react-native";

const backgroundImage = require("../../assets/bgg.png");

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);



const Button = ({ children, onPress, variant }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === "ghost" ? styles.ghostButton : styles.filledButton,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "ghost" ? styles.ghostText : styles.filledText,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const EventCard = ({ name, organizer, date }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={styles.eventName}>{name}</Text>
        <Text style={styles.eventOrganizer}>{organizer}</Text>
        <Text style={styles.eventDate}>{date}</Text>
      </Animated.View>
    </Pressable>
  );
};
const groupEventsByMonth = (events) => {
  const grouped = events.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const year = eventDate.getFullYear();
    const monthNumber = eventDate.getMonth(); // 0 = January
    const monthName = eventDate.toLocaleString("default", { month: "long" });

    const key = `${year}-${monthNumber}`;  // For accurate sorting.
    if (!acc[key]) {
      acc[key] = {
        monthName,
        year,
        events: [],
        monthNumber
      };
    }
    acc[key].events.push(event);
    return acc;
  }, {});

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const [yearA, monthA] = a.split("-").map(Number);
    const [yearB, monthB] = b.split("-").map(Number);
    if (yearA === yearB) return monthA - monthB;
    return yearA - yearB;
  });

  // Build the final object
  const result = {};

  if (grouped[currentMonthKey]) {
    result[currentMonthKey] = grouped[currentMonthKey];
  }

  sortedKeys.forEach((key) => {
    if (key !== currentMonthKey) {
      result[key] = grouped[key];
    }
  });

  return result;
};



const EventsScreen = () => {
  const eventData = [
    { name: "Tech Fest", organizer: "GIT / Jaipur", date: "2024-03-15" },
    { name: "AI Summit", organizer: "Rajasthan Tech Park", date: "2024-03-21" },
    { name: "Design Conf", organizer: "Tech Grounds", date: "2024-03-28" },
    { name: "Hackathon 3.0", organizer: "Codefista", date: "2024-04-05" },
    { name: "Dev Expo", organizer: "GIT / Jaipur", date: "2024-04-12" },
    { name: "Green India Event", organizer: "GreenTeam", date: "2024-04-20" },
    { name: "Startup Meet", organizer: "TechHub Jaipur", date: "2024-04-28" },
    { name: "Hackathon 3.0", organizer: "Codefista", date: "2024-05-05" },
    { name: "Dev Expo", organizer: "GIT / Jaipur", date: "2024-05-12" },
    { name: "Green India Event", organizer: "GreenTeam", date: "2024-01-20" },
    { name: "Startup Meet", organizer: "TechHub Jaipur", date: "2023-10-28" },
  ];

  const events = groupEventsByMonth(eventData);
  const animatedPosition = useRef(new Animated.Value(0)).current;

  const moveToLeft = () => {
    Animated.timing(animatedPosition, {

      toValue: -120, // move farther left
      duration: 500, // longer = smoother
      easing: Easing.out(Easing.exp), // smooth easing
      useNativeDriver: true,
    }).start();
  };

  const moveToRight = () => {
    Animated.timing(animatedPosition, {
      toValue: 120, // move farther right
      duration: 500,
      easing: Easing.out(Easing.exp), // smooth easing
      useNativeDriver: true,
    }).start();

  };


  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => console.log("A pressed")}>
            <Text style={styles.headerItem}>A</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => console.log("B pressed")}>
              <Text style={styles.headerItem}>B</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log("C pressed")}>
              <Text style={styles.headerItem}>C</Text>
            </TouchableOpacity>
          </View>
        </View>


        <StatusBar barStyle="dark-content" />

        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.eventsLabel}>
              <Text style={styles.eventsLabelText}>Events for you</Text>
            </View>

          </View>

          {Object.entries(events).map(([month, data]) => (
            <View key={month} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{`${data.monthName} ${data.year}`}</Text>
              {data.events.map((event, index) => (
                <EventCard
                  key={index}
                  name={event.name}
                  organizer={event.organizer}
                  date={new Date(event.date).toLocaleDateString()}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity onPress={moveToLeft}>
          <Text style={styles.bottomIconleft}>📅</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.centerCircle, { transform: [{ translateX: animatedPosition }] }]}>
          <Text style={styles.bottomIcon}>✅</Text>
        </Animated.View>

        <TouchableOpacity onPress={moveToRight}>
          <Text style={styles.bottomIconright}>👤</Text>
        </TouchableOpacity>
      </View>


    </ImageBackground>
  ) 

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,

  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollView: {
    padding: 16,
  },
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6C7C7C", // match your screenshot color
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  headerRight: {
    flexDirection: "row",
    gap: 20,
  },

  headerItem: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#889999", // optional button background to make it feel tappable
  },




  eventsLabel: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    width: 156,
    height: 41,
    marginLeft: 100,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 20,
    backgroundColor: "#D6D9FF",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  eventsLabelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filledButton: {
    backgroundColor: "#4F46E5S",
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 14,
  },
  filledText: {
    color: "#fff",
  },
  ghostText: {
    color: "#000",
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#333",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#D6D9FF",
    padding: 16,
    width: 370,
    height: 90,
    marginVertical: 6,
    borderRadius: 16,

    // Android
    elevation: 6,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111",
  },
  eventOrganizer: {
    fontSize: 12,
    color: "#555",
    marginBottom:4,
  },
  eventDate: {
    fontSize: 12,

    color: "#555",
    alignSelf: 'flex-start',  
    marginTop: 3,
  },
  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#465E5D",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "visible",
  },

  centerCircle: {
    position: "absolute",
    top: -25,
    left: "50%",
    right: "100%",
    marginLeft: -3, // half of width to center properly
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#465E5D",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  bottomIcon: {
    fontSize: 24,

    color: "white",
  },
  bottomIconleft:
  {
    fontSize: 24,
    left: -20,
    color: "white",
  },
  bottomIconright:
  {
    fontSize: 24,
    right: -25,
    color: "white",
  }

});


export default EventsScreen;

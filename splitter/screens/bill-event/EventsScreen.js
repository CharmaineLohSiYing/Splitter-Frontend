import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { matchUsersWithContacts } from "../../utils/initialiseContacts";

import EventItemDisplay from "../../components/EventItemDisplay";
import * as authActions from "../../store/actions/auth";
import * as eventActions from "../../store/actions/bill-event";
import Colors from "../../constants/Colors";


const EventsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const userEvents = useSelector((state) => state.billEvent.userEvents);
  const dispatch = useDispatch();

  var contactsFromStore = useSelector((state) => state.auth.contacts);

  const addEventHandler = () => {
    props.navigation.navigate("AddAttendees");
  };

  const loadUserEvents = useCallback(async () => {
    setError(null);
    try {
      await dispatch(eventActions.fetchUserEvents());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const listenerCreated = props.navigation.addListener(
      "focus",
      loadUserEvents
    );

    return () => {
      // calling this function will remove the listener
      listenerCreated();
    };
  }, [loadUserEvents]);

  useEffect(() => {
    async function initialiseContacts() {
      var matched = await matchUsersWithContacts();
      dispatch(authActions.setContacts(matched));
    }

    if (!contactsFromStore) {
      initialiseContacts();
    }
  }, [contactsFromStore]);

  useEffect(() => {
    setIsLoading(true);
    loadUserEvents().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadUserEvents]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadUserEvents}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && userEvents.length === 0) {
    return (
    <View style={[styles.screen, {justifyContent:'center', alignItems:'center'}]}>
        <View style={styles.noEventsContainer}>
          <Text>You have no events yet</Text>
         
            <TouchableOpacity style={styles.noEventsAdd} onPress={addEventHandler}>
              <Text style={styles.noEventsAddText}>Create one</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={addEventHandler}
        style={styles.addEventButton}
      >
        <Ionicons name="md-add" size={40} color="white" />
      </TouchableOpacity>
      <View style={styles.eventsContainer}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={userEvents}
          renderItem={({ item }) => (
            <EventItemDisplay
              onSelect={() =>
                props.navigation.navigate("ViewEvent", {
                  eventId: item.event._id,
                })
              }
              eventName={item.event.name}
              date={item.event.date}
              netBill={item.event.netBill}
              sharedOrders={item.sharedOrders}
              individualOrderAmount={item.individualOrderAmount}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventsContainer: {
    flex: 1,
  },
  noEventsContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    margin: 20,
    width: '80%',
    alignItems:'center',
    padding: 10
  },
  buttonContainer: {
    marginTop: 10,
  },
  noEventsAdd:{
    height: 30,
    backgroundColor:Colors.primary,
    alignItems:'center',
    justifyContent:'center',
    width:'50%',
    marginTop: 10
  },
  noEventsAddText:{
    color:'white'
  },
  addEventButton: {
    backgroundColor: Colors.primary,
    position: "absolute",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    borderRadius: 40,
    zIndex: 1,
  },
});

export default EventsScreen;

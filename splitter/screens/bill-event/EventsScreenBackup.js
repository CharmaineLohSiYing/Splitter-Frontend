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
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";

import EventItemDisplay from "../../components/EventItemDisplay";
import * as authActions from "../../store/actions/auth";
import * as eventActions from "../../store/actions/bill-event";
import Colors from '../../constants/Colors'
const EventsScreen = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const retrievedUserEvents = useSelector(state => state.billEvent.userEvents);
  const [userEvents, setUserEvents] = useState({})
  const dispatch = useDispatch();

  var contactsFromStore = useSelector((state) => state.auth.contacts);

  console.log('-----------events screen----------')

  const loadUserEvents = useCallback(async () => {
    console.log('set error(null), setIsRefreshing(true)')
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(eventActions.fetchUserEvents());
    } catch (err) {
      setError(err.message);
    }
    console.log('setIsRefreshing(false)')
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const listenerCreated = props.navigation.addListener(
      'focus',
      loadUserEvents
    );

    return () => {
      // calling this function will remove the listener
      listenerCreated();
    };
  }, [loadUserEvents]);

  useEffect(() => {

    async function initialiseContacts() {
      var matched = await matchUsersWithContacts()
      console.log('auth actions set contacts')
      dispatch(authActions.setContacts(matched));
    }

   if (!contactsFromStore){
      initialiseContacts()
    }
  }, [contactsFromStore]);

  useEffect(() => {
    if (retrievedUserEvents){
      console.log('set user events')
      setUserEvents(retrievedUserEvents)
    }
  }, [retrievedUserEvents]);

  useEffect(() => {
    console.log('useeffect set Isloading(true)')
    setIsLoading(true);
    loadUserEvents().then(() => {
      console.log('useeffect set Isloading(false)')
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

  if (!isLoading && Object.keys(userEvents) === 0)  {
    return (
      <View style={styles.centered}>
        <Text>No events found</Text>
      </View>
    );
  }


  
  return (
    <View style={styles.screen}>
      <Button
        title="Add Event"
        onPress={() => props.navigation.navigate("AddAttendees")}
      />
      <View style={styles.eventsContainer}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={retrievedUserEvents}
          renderItem={({ item }) => (
            <EventItemDisplay
              onSelect={() => props.navigation.navigate('ViewEvent', {eventId: item.event._id})}
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

EventsScreen.navigationOptions = {
  headerTitle: "Your Events",
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
  buttonContainer: {
    marginTop: 10,
  },
});

export default EventsScreen;

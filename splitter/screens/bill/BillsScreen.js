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

import BillItemDisplay from "../../components/BillItemDisplay";
import * as authActions from "../../store/actions/auth";
import * as billActions from "../../store/actions/bill";
import Colors from "../../constants/Colors";


const BillsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [text, setText] = useState("hello")
  const userBills = useSelector((state) => state.bill.userBills);
  const dispatch = useDispatch();

  var contactsFromStore = useSelector((state) => state.auth.contacts);

  const addBillHandler = () => {
    props.navigation.navigate("AddAttendees");
  };

  const loadUserBills = useCallback(async () => {
    setError(null);
    try {
      await dispatch(billActions.fetchUserBills());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const listenerCreated = props.navigation.addListener(
      "focus",
      loadUserBills
    );

    return () => {
      // calling this function will remove the listener
      listenerCreated();
    };
  }, [loadUserBills]);

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
    loadUserBills().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadUserBills]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadUserBills}
          color={Colors.blue1}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.blue1} />
      </View>
    );
  }

  if (!isLoading && userBills.length === 0) {
    return (
    <View style={[styles.screen, {justifyContent:'center', alignItems:'center'}]}>
        <View style={styles.noBillsContainer}>
          <Text>You have no bills yet</Text>
         
            <TouchableOpacity style={styles.noBillsAdd} onPress={addBillHandler}>
              <Text style={styles.noBillsAddText}>Create one</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  const change = () => {
    if (text == 'hello'){
      setText('bye')
    } else {
      setText('hello')
    }
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={addBillHandler}
        style={styles.addBillButton}
      >
        <Ionicons name="md-add" size={40} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={{height: 40, backgroundColor:'yellow', width: '100%'}} onPress={change}>
  <Text>{text}</Text>
      </TouchableOpacity>
      <View style={styles.billsContainer}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={userBills}
          renderItem={({ item }) => (
            <BillItemDisplay
              onSelect={() =>
                props.navigation.navigate("ViewBill", {
                  billId: item.bill._id,
                })
              }
              billName={item.bill.name}
              date={item.bill.date}
              netBill={item.bill.netBill}
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
  billsContainer: {
    flex: 1,
  },
  noBillsContainer: {
    borderWidth: 1,
    borderColor: Colors.blue1,
    margin: 20,
    width: '80%',
    alignItems:'center',
    padding: 10
  },
  buttonContainer: {
    marginTop: 10,
  },
  noBillsAdd:{
    height: 30,
    backgroundColor:Colors.blue1,
    alignItems:'center',
    justifyContent:'center',
    width:'50%',
    marginTop: 10
  },
  noBillsAddText:{
    color:'white'
  },
  addBillButton: {
    backgroundColor: Colors.blue1,
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

export default BillsScreen;

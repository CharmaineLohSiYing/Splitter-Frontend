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
import Screen from "../../components/UI/Screen";
import PlaceholderImage from "../../components/PlaceholderImage"

import BillItemDisplay from "../../components/BillItemDisplay";
import * as authActions from "../../store/actions/auth";
import * as billActions from "../../store/actions/bill";
import Colors from "../../constants/Colors";
import GlobalStyles from "../../assets/style";
import FlashMessage from "../../components/FlashMessage";

const BillsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [flashMessage, setFlashMessage] = useState(null);
  const userBills = useSelector((state) => state.bill.userBills);
  const dispatch = useDispatch();

  var contactsFromStore = useSelector((state) => state.auth.contacts);
  const {params} = props.route;

  useEffect(() => {
    if (flashMessage){
      setTimeout(() => {
        setFlashMessage(null)
      }, 3000)
    }
  }, [flashMessage])

  useEffect(() => {
    if (params && params.createBillSuccess){
      setTimeout(() => {

      }, 3000)
      setFlashMessage("Successfully created bill")
    }
  }, [params])

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
      <View style={GlobalStyles.centered}>
        <PlaceholderImage imageName={require("../../assets/pictures/no-data.png")} mainText="Oh no, something went wrong!" actionText={"Try again"} onPress={loadUserBills} error/>
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
      <View
        style={[
          styles.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
          <PlaceholderImage imageName={require("../../assets/pictures/no-bills.png")} mainText="You have no bills yet." actionText={"Create one"} onPress={addBillHandler}/>
      </View>
    );
  }

  return (
    <Screen>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={addBillHandler}
        style={GlobalStyles.floatingButton}
      >
        <Ionicons name="md-add" size={24} color="white" />
      </TouchableOpacity>
      <FlatList
      contentContainerStyle={{marginTop: 20}}
        style={GlobalStyles.flatlist}
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
      {flashMessage && <FlashMessage text={flashMessage} type={'success'}/>}
    </Screen>
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
  noBillsContainer: {
    borderWidth: 1,
    borderColor: Colors.blue1,
    margin: 20,
    width: "80%",
    alignItems: "center",
    padding: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  noBillsAdd: {
    height: 30,
    backgroundColor: Colors.blue1,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    marginTop: 10,
  },
  noBillsAddText: {
    color: "white",
  },
  floatingButton: {
    backgroundColor: Colors.blue1,
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    borderRadius: 30,
    zIndex: 1,
    flexDirection: "row",
  },
});

export default BillsScreen;

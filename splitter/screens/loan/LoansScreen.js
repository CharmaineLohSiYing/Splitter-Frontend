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
import Colors from '../../constants/Colors'

import LoanDisplay from "../../components/LoanDisplay";
import * as authActions from "../../store/actions/auth";
import * as loanActions from "../../store/actions/loan";
import {matchUsersWithContacts} from '../../utils/initialiseContacts'



const LoansScreen = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const loans = useSelector(state => state.loan.loans);
  const dispatch = useDispatch();

  console.log('------------loans screen---------')
  const loadLoans = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('fetching loans')
      await dispatch(loanActions.fetchLoans());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const listenerCreated = props.navigation.addListener(
      'focus',
      loadLoans
    );

    return () => {
      // calling this function will remove the listener
      listenerCreated();
    };
  }, [loadLoans]);

  // useEffect(() => {
  //   if (retrievedLoans){
  //     setLoans(retrievedLoans)
  //   }
  // }, [retrievedLoans]);

  useEffect(() => {
    setIsLoading(true);
    loadLoans().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadLoans]);

  var contactsFromStore = useSelector((state) => state.auth.contacts);
  

  useEffect(() => {

    async function initialiseContacts() {
      var matched = await matchUsersWithContacts()
      dispatch(authActions.setContacts(matched));
    }

   if (!contactsFromStore){
      console.log('calling initialiseContacts')
      initialiseContacts()
    }
  }, [contactsFromStore]);



  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadLoans}
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

  if (!isLoading && Object.keys(loans) === 0)  {
    return (
      <View style={styles.centered}>
        <Text>No loans found</Text>
      </View>
    );
  }

  return (
    <View>
      <View>
        <FlatList
          onRefresh={loadLoans}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(loans)}
          renderItem={({ item }) => (
            <LoanDisplay friendMobileNumber={item} debt={loans[item]} navigate={props.navigation.navigate}/>
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
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default LoansScreen;

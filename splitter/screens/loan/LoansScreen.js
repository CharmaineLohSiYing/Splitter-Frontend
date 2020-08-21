import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  SectionList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import LoanSectionDisplay from "../../components/LoanSectionDisplay";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../components/UI/Screen";
import Content from "../../components/UI/Content";
import GlobalStyles from "../../assets/style";
import * as authActions from "../../store/actions/auth";
import * as loanActions from "../../store/actions/loan";
import { matchUsersWithContacts } from "../../utils/initialiseContacts";
import SearchBar from "../../components/UI/SearchBar";

const LoansScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [query, setQuery] = useState("");
  const { borrowedFrom, loanedTo, borrowed, loaned } = useSelector(
    (state) => state.loan.loans
  );
  const netDebt = useSelector((state) => state.loan.netDebt);
  const dispatch = useDispatch();

  props.navigation.setOptions({
    headerTitle: "Track Loans",
  });

  const loadLoans = useCallback(async () => {
    console.log("load loans");
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(loanActions.fetchLoans());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const listenerCreated = props.navigation.addListener("focus", loadLoans);

    return () => {
      // calling this function will remove the listener
      listenerCreated();
    };
  }, [loadLoans]);

  useEffect(() => {
    setIsLoading(true);
    loadLoans().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadLoans]);

  var contactsFromStore = useSelector((state) => state.auth.contacts);

  useEffect(() => {
    async function initialiseContacts() {
      var matched = await matchUsersWithContacts();
      dispatch(authActions.setContacts(matched));
    }

    if (!contactsFromStore) {
      console.log("loans screen - calling initialiseContacts");
      initialiseContacts();
    }
  }, [contactsFromStore]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title="Try again" onPress={loadLoans} color={Colors.blue1} />
      </View>
    );
  }

  if (isLoading || !borrowedFrom) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.blue1} />
      </View>
    );
  }

  // if (!isLoading && Object.keys(loans) === 0) {
  //   return (
  //     <View style={styles.centered}>
  //       <Text>No loans found</Text>
  //     </View>
  //   );
  // }

  const handleSearch = (text) => {
    setQuery(text);
  };

  return (
    <Screen>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.navigation.navigate("ContactsList");
        }}
        style={GlobalStyles.floatingButton}
      >
        <Ionicons name="md-add" size={24} color="white" />
      </TouchableOpacity>

      <SearchBar handleSearch={handleSearch} query={query} style={{marginTop: 20}}/>
      <SectionList
        contentContainerStyle={{paddingTop: 10}}
        style={GlobalStyles.flatlist}
        onRefresh={loadLoans}
        refreshing={isRefreshing}
        sections={[
          {
            type: "borrowedFrom",
            data: [Object.keys(borrowedFrom)],
          },
          {
            type: "loanedTo",
            data: [Object.keys(loanedTo)],
          },
        ]}
        keyExtractor={(item, index) => item.toString()}
        renderItem={({ item, section: { type } }) => (
          <LoanSectionDisplay
            item={item}
            type={type}
            navigation={props.navigation}
            query={query}
          />
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default React.memo(LoansScreen);

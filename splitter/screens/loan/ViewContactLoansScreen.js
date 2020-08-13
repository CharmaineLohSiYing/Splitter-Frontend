import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import LoanModal from "../../components/LoanModal";
import TransactionModal from "../../components/TransactionModal";

import BillItemDisplay from "../../components/BillItemDisplay";
import * as authActions from "../../store/actions/auth";
import Colors from "../../constants/Colors";
import Avatar from "../../components/Avatar";

const ViewContactLoansScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [debt, setDebt] = useState();
  const [loans, setLoans] = useState([]);
  const dispatch = useDispatch();

  const { matchedName, friendMobileNumber } = props.route.params;
  const currUserId = useSelector((state) => state.auth.userId);
  const [friendUserId, setFriendUserId] = useState(
    props.route.params.friendUserId
  );
  const [createNewLoan, setCreateNewLoan] = useState(false);
  const [createNewTransaction, setCreateNewTransaction] = useState(false);

  const loadLoans = useCallback(async () => {
    console.log(friendUserId, props.route.params.friendUserId);
    setError(null);
    setIsRefreshing(true);

    let response;

    if (friendUserId) {
      try {
        console.log("have friend id");
        response = await fetch(
          "http://192.168.1.190:5000/loan/friend/" +
            currUserId +
            "/" +
            friendUserId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        setError(err);
      }
    } else {
      try {
        console.log("no friend id", friendUserId);
        response = await fetch(
          "http://192.168.1.190:5000/loan/friend/mobileNumber/" +
            currUserId +
            "/" +
            friendMobileNumber,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        setError(err);
      }
    }

    if (!response.ok) {
      const errorResData = await response.json();
      console.log("errorResData", errorResData);

      let message = "Something went wrong!";
      if (errorResData) {
        message = errorResData;
      }
      setError(message);
    }

    const resData = await response.json();
    const {loans, debt} = resData;
    if (!friendUserId && resData.friendUserId){
      setFriendUserId(resData.friendUserId)
    }
    setLoans(loans);
    setDebt(debt)
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const listenerCreated = props.navigation.addListener("focus", loadLoans);

    return () => {
      // calling this function will remove the listener
      listenerCreated();
    };
  }, [loadLoans]);

  useEffect(() => {
    loadLoans();
  }, [friendUserId, loadLoans]);

  const viewBillHandler = (billId) => {
    props.navigation.navigate("Bills", {
      screen: "ViewBill",
      params: { billId },
      initial: true,
    });
  };

  const LoanDisplay = (
    date,
    amount,
    matchedName,
    toId,
    payerId,
    isCancelled,
    billId
  ) => {
    let Container = View;
    if (billId) {
      Container = TouchableOpacity;
    }
    if (payerId) {
      // display loan
      return (
        <Container
          style={styles.loanContainer}
          onPress={() => viewBillHandler(billId)}
        >
          {payerId === currUserId ? (
            <Text style={[styles.text, { color: Colors.darkRed }]}>
              You owe {matchedName} ${amount}
            </Text>
          ) : (
            <Text style={[styles.text, { color: Colors.blue1 }]}>
              {matchedName} owes you ${amount}
            </Text>
          )}
          <Text>{moment(date).format("D MMM YYYY")}</Text>
        </Container>
      );
    } else {
      // display transaction
      return (
        <View style={styles.loanContainer}>
          {toId === currUserId ? (
            <Text>- ${amount.toFixed(2)}</Text>
          ) : (
            <Text>+ ${amount.toFixed(2)}</Text>
          )}
          <Text>{moment(date).format("D MMM YYYY")}</Text>
        </View>
      );
    }
  };

  const updateFriendId = (friendId) => {
    // console.log('setting...', friendId)
    // setFriendUserId(friendId)
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title="Try again" onPress={loadLoans} color={Colors.blue1} />
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

  if (!isLoading && Object.keys(loans) === 0) {
    return (
      <View style={styles.centered}>
        <Text>No loans found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <Avatar />
        <Text style={{ fontWeight: "bold", fontStyle: "italic", fontSize: 18 }}>
          {matchedName}
        </Text>
      </View>
      <View
        style={[
          styles.netDebt,
          { backgroundColor: debt > 0 ? Colors.lightRed : Colors.blue3 },
        ]}
      >
        {debt < 0 && (
          <Text>
            {matchedName} owes you ${-debt.toFixed(2)}
          </Text>
        )}
        {debt > 0 && (
          <Text>
            You owe {matchedName} ${debt.toFixed(2)}
          </Text>
        )}
        {debt === 0 && <Text>No debt</Text>}
      </View>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCreateNewLoan(true)}
        >
          <Text style={{ color: Colors.blue1 }}>Create New Loan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCreateNewTransaction(true)}
        >
          <Text style={{ color: Colors.blue1 }}>Transfer $</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loansContainer}>
        <FlatList
          onRefresh={loadLoans}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => index.toString()}
          // data={loans.slice(0, 3)}
          data={loans}
          renderItem={({ item }) =>
            LoanDisplay(
              item.date,
              item.amount,
              matchedName,
              item.from,
              item.payer,
              item.isCancelled,
              item.bill
            )
          }
        />
      </View>
      {createNewLoan && (
        <LoanModal
          matchedName={matchedName}
          friendUserId={friendUserId}
          friendMobileNumber={friendMobileNumber}
          setFriendUserId={updateFriendId}
          onClose={() => {
            setCreateNewLoan(false);
            loadLoans();
          }}
        />
      )}
      {createNewTransaction && (
        <TransactionModal
          matchedName={matchedName}
          friendUserId={friendUserId}
          friendMobileNumber={friendMobileNumber}
          setFriendUserId={updateFriendId}
          onClose={() => {
            setCreateNewTransaction(false);
            loadLoans();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loansContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  loanContainer: {
    paddingHorizontal: 5,
    backgroundColor: Colors.gray3,
    borderRadius: 10,
    marginTop: 10,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButtons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
  },
  button: {
    height: 30,
    width: "47%",
    borderRadius: 15,
    backgroundColor: Colors.blue3,
    borderWidth: 1,
    borderColor: Colors.blue1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  netDebt: {
    borderRadius: 20,
    paddingVertical: 5,
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});

export default ViewContactLoansScreen;

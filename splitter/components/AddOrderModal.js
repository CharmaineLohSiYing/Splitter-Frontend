import React, { useState, useCallback, useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AppModal from "./UI/AppModal";
import Calculator from "./Calculator";
import SharerDisplay from "./SharerDisplay";
import Colors from "../constants/Colors";
import * as billActions from "../store/actions/bill";

const ItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: Colors.blue3,
      }}
    ></View>
  );
};

const AddOrderModal = (props) => {
  const dispatch = useDispatch();
  const { sharedOrderIdToUpdate, newSharedOrder, user, updatePayer } = props;
  let sharedOrders;
  let sharedOrder;
  let unpaidAmount;
  let attendees = useSelector((state) => state.bill.attendees);
  let matchedUser;
  if (sharedOrderIdToUpdate) {
    sharedOrders = useSelector((state) => state.bill.sharedOrders);
    sharedOrder = sharedOrders.filter(
      (order) => order.id === sharedOrderIdToUpdate
    )[0];
  } else if (user) {
    matchedUser = attendees[user];
  }

  if (updatePayer) {
    unpaidAmount = useSelector((state) => state.bill.unpaidAmount);
  }
  const [sharers, setSharers] = useState(
    sharedOrderIdToUpdate ? sharedOrder.users : []
  );
  const [previousOperand, setPreviousOperand] = useState("");
  const [currentOperand, setCurrentOperand] = useState(() => {
    return sharedOrderIdToUpdate ? sharedOrder.amount : "0";
  });
  const [operation, setOperation] = useState("");
  // let previousOperand = "";
  // let currentOperand = "";
  // let operation = "";

  let initialAmount = 0;

  useEffect(() => {
    
    if (sharedOrderIdToUpdate) {
      initialAmount = sharedOrder.amount;
    } else if (updatePayer) {
      if (matchedUser.paidAmount > 0) {
        initialAmount = matchedUser.paidAmount;
      } else {
        initialAmount = unpaidAmount;
      }
    } else if (matchedUser) {
      initialAmount = matchedUser.amount;
    }
    console.log("useeffect", initialAmount);
    
    setCurrentOperand(initialAmount);
  }, []);

  const toggleSharerHandler = async (id) => {
    if (sharers.includes(id)) {
      setSharers(sharers.filter((sharer) => sharer !== id));
    } else {
      setSharers(sharers.concat(id));
    }
  };

  const HeaderComponent = () => (
    <View style={{ paddingBottom: 10, paddingHorizontal: 5 }}>
      <Text style={styles.selectSharersTitle}>Who shared?</Text>
    </View>
  );

  // const updateDisplay = async() => {
  //   console.log('operation',operation)
  //   if (operation !== "") {
  //     let symbol = operation
  //     setPreviousOperandDisplay(previousOperand + " " + symbol)
  //     console.log('setPrevOperand previousOperand', previousOperand);

  //   } else {
  //     setPreviousOperandDisplay("")
  //     console.log('setPrevOperand ""');
  //   }
  // };

  // const compute = async () => {
  //   let computation;
  //   const prev = parseFloat(previousOperand);
  //   const current = parseFloat(currentOperand);
  //   if (isNaN(prev) || isNaN(current)) return;
  //   switch (operation) {
  //     case "×":
  //       computation = prev * current;
  //       break;
  //     case "÷":
  //       computation = prev / current;
  //       break;
  //     case "+":
  //       computation = prev + current;
  //       break;
  //     case "-":
  //       computation = prev - current;
  //       break;
  //     case "=":
  //       computation = prev - current;
  //       break;
  //     default:
  //       return;
  //   }

  //   setOperation("")
  //   setCurrentOperand(computation)
  //   setPreviousOperand("")
  // };

  // const pressDigitHandler = async (value) => {
  //   if (value === "Decimal" && currentOperand.includes(".")) {
  //     return;
  //   } else if (value === "Decimal") {
  //     value = ".";
  //   } else if (value === "0" && currentOperand === "") {
  //     return;
  //   } else if (currentOperand === "0" && value !== "Decimal") {
  //     await setCurrentOperand(value.toString())
  //     return;
  //   } else {
  //     await setCurrentOperand(currentOperand.toString() + value.toString())
  //     console.log(value, 'currentOperand', currentOperand)
  //     updateDisplay();
  //   }
  // };

  // const pressEqualHandler = (value) => {
  //   compute();
  //   setPreviousOperandDisplay("")
  // };

  // const pressClearHandler = (value) => {
  //   setOperation("")
  //   setPreviousOperandDisplay("")
  //   setCurrentOperand("0")
  //   setPreviousOperand("")
  // };

  // const pressDeleteHandler = (value) => {
  //   const length = currentOperand.toString().length;
  //   if (length > 0) {
  //     if (length === 1) {
  //       pressClearHandler();
  //     } else {
  //       setCurrentOperand(currentOperand.toString().slice(0,-1))
  //     }
  //   }
  // };

  // const pressOperatorHandler = (type) => {
  //   console.log('OPERATOR HERE',type)
  //   if (currentOperand === "") return;

  //   compute();
  //   setOperation(type)
  //   setPreviousOperand(currentOperand)
  //   setCurrentOperand("")
  //   updateDisplay();
  // };

  const compute = (current, previous, operation) => {
    let computation;
    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
      case "×":
        computation = prev * curr;
        break;
      case "÷":
        computation = prev / curr;
        break;
      case "+":
        computation = prev + curr;
        break;
      case "-":
        computation = prev - curr;
        break;
      case "=":
        computation = prev - curr;
        break;
      default:
        return;
    }
    return computation;
  };

  const getValuesFromCalculator = (current, previous, op) => {
    console.log("get values", current, previous, op);
    setCurrentOperand(current);
    setPreviousOperand(previous);
    setOperation(op);
    // currentOperand = current;
    // previousOperand = previous;
    // operation = op;
  };

  const CalculatorComponent = useCallback(() => {
    console.log('initialamount', initialAmount)
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingTop: !user ? 10 : 0,
        }}
      >
        {!user && (
          <View style={{ padding: 5 }}>
            <Text>Price</Text>
          </View>
        )}
        {/* <Calculator updateSharedOrder={true} previousOperand={previousOperand} previousOperandDisplay={previousOperandDisplay} currentOperand={currentOperand} operation={operation} compute={compute} pressOperatorHandler={pressOperatorHandler} pressClearHandler={pressClearHandler} pressDeleteHandler={pressDeleteHandler} pressDigitHandler={pressDigitHandler} pressEqualHandler={pressEqualHandler}/> */}
        <Calculator
          initialAmount={initialAmount}
          getValuesFromCalculator={getValuesFromCalculator}
          style={
            user
              ? styles.individualOrderCalculator
              : styles.sharedOrderCalculator
          }
        />
      </View>
    );
  }, []);

  const onSubmit = async () => {
    let finalValue = 0;
    console.log("current", currentOperand);
    if (previousOperand && operation) {
      finalValue = compute(currentOperand, previousOperand, operation);
    } else {
      finalValue = currentOperand;
    }
    if (sharedOrderIdToUpdate) {
      await dispatch(
        billActions.updateSharedOrder(
          sharedOrderIdToUpdate,
          finalValue,
          sharers
        )
      );
    } else if (newSharedOrder) {
      await dispatch(billActions.addSharedOrder(finalValue, sharers));
    } else if (updatePayer) {
      await dispatch(billActions.updatePaidAmount(user, finalValue));
    } else {
      await dispatch(billActions.updateIndividualOrder(user, finalValue));
    }

    props.onClose();
  };

  if (user) {
    return (
      <AppModal
        title={
          matchedUser.name === "Me"
            ? "My Individual Order"
            : matchedUser.name + "'s Individual Order"
        }
        onClose={props.onClose}
        onSubmit={onSubmit}
        contentsStyle={styles.individualOrderModalContents}
      >
        <CalculatorComponent />
      </AppModal>
    );
  } else if (updatePayer) {
    return (
      <AppModal
        title={
          matchedUser.name === "Me"
            ? "How Much I Paid"
            : "How much " + matchedUser.name + " Paid"
        }
        onClose={props.onClose}
        onSubmit={onSubmit}
        contentsStyle={styles.individualOrderModalContents}
      >
        <CalculatorComponent />
      </AppModal>
    );
  }

  return (
    <AppModal title="Add Order" onClose={props.onClose} onSubmit={onSubmit}>
      <View style={styles.selectSharers}>
        <FlatList
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponent={HeaderComponent}
          ListFooterComponent={CalculatorComponent}
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(attendees)}
          initialNumToRender={10}
          renderItem={({ item, index }) => (
            <SharerDisplay
              first={index === 0}
              last={index === Object.keys(attendees).length - 1}
              name={attendees[item].name}
              selected={sharers.includes(item)}
              id={item}
              onSelect={toggleSharerHandler}
            />
          )}
        />
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  sharedOrderCalculator: {
    width: "70%",
    height: 300,
  },
  individualOrderCalculator: {
    width: "100%",
    height: 400,
    borderWidth: 0,
  },
  individualOrderModalContents: {
    paddingVertical: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:'yellow'
  },
});

export default AddOrderModal;

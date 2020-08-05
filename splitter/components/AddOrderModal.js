import React, { useState, useCallback } from "react";
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
import * as billActions from '../store/actions/bill'

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
  const dispatch = useDispatch()
  const { orderId } = props;
  let sharedOrders;
  let sharedOrder;
  const attendees = useSelector((state) => state.bill.attendees);
  if (orderId) {
    sharedOrders = useSelector((state) => state.bill.sharedOrders);
    sharedOrder = sharedOrders.filter((order) => order.id === orderId)[0];
  }
  const [modalVisible, setModalVisible] = useState(true);
  const [sharers, setSharers] = useState(orderId ? sharedOrder.users : []);
  const [previousOperand, setPreviousOperand] = useState("")
  const [currentOperand, setCurrentOperand] = useState(() => {return orderId ? sharedOrder.amount : "0"})
  const [operation, setOperation] = useState("")
  // let previousOperand = "";
  // let currentOperand = "";
  // let operation = "";

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
    setCurrentOperand(current)
    setPreviousOperand(previous)
    setOperation(op)
    // currentOperand = current;
    // previousOperand = previous;
    // operation = op;
  };

  const CalculatorComponent = useCallback(() => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingTop: 10,
        }}
      >
        <View style={{ padding: 5 }}>
          <Text>Price</Text>
        </View>
        {/* <Calculator updateSharedOrder={true} previousOperand={previousOperand} previousOperandDisplay={previousOperandDisplay} currentOperand={currentOperand} operation={operation} compute={compute} pressOperatorHandler={pressOperatorHandler} pressClearHandler={pressClearHandler} pressDeleteHandler={pressDeleteHandler} pressDigitHandler={pressDigitHandler} pressEqualHandler={pressEqualHandler}/> */}
        <Calculator
          updateSharedOrder={true}
          initialAmount={orderId ? sharedOrder.amount : "0"}
          getValuesFromCalculator={getValuesFromCalculator}
        />
      </View>
    );
  }, []);

  const onSubmit = async () => {
    let finalValue = 0;
    if (previousOperand && operation) {
      finalValue = compute(currentOperand, previousOperand, operation);
    } else {
      finalValue = currentOperand;
    }
    await dispatch(billActions.updateSharedOrder(orderId, finalValue, sharers))
    props.onClose()
  };

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
  selectSharers: {},
});

export default AddOrderModal;

import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import MyAppText from "../../components/UI/MyAppText";
import Colors from "../../constants/Colors"

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: true,
    touched: false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;

    if (props.numbers != null) {
      text = text.replace(/[^0-9]/g, "");
    }
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  if (props.horizontal){
    return (
      <View>
        <View style={{flexDirection:'row', alignItems:'center', paddingVertical: 10}}>
          {props.label && <MyAppText style={styles.label}>{props.label}</MyAppText>}
          <TextInput
            {...props}
            style={styles.inputHorizontal}
            value={inputState.value}
            onChangeText={textChangeHandler}
            onFocus={lostFocusHandler}
          />
        </View>
        
  
        {!inputState.isValid && inputState.touched && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{props.errorText}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View>
      {props.label && <MyAppText style={styles.label}>{props.label}</MyAppText>}
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onFocus={lostFocusHandler}
      />

      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 10,
    flex: 1
  },
  input: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  inputHorizontal: {
    flex: 2,
    backgroundColor: Colors.gray3,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13,
  },
});

export default Input;

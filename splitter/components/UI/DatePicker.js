import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";


const DatePicker = (props) => {
  const [date, setDate] = useState(props.date);
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState()

  const propsFormattedDate = props.formattedDate

  useEffect(() => {
    if (propsFormattedDate){
      setFormattedDate(propsFormattedDate);
    }
  }, [propsFormattedDate])
  
  const onChange = (bill, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    const fDate = moment(new Date(currentDate)).format("D MMM YYYY");
    setFormattedDate(fDate);
    props.onSelectDate(fDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={showDatepicker}
          style={styles.container}
        >
          <Ionicons name="ios-calendar" size={24} color="black" style={styles.icon}/>
          <Text>{formattedDate}</Text>
        </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    alignItems:'center'
  },
  icon:{
    paddingHorizontal: 5
  }
});

export default DatePicker;

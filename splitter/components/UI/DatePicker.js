import React, {useState} from 'react';
import {View, Button, Platform, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { Ionicons } from "@expo/vector-icons";

const DatePicker = (props) => {
  const [date, setDate] = useState(props.date);
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    props.onSelectDate(currentDate)
  };


  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View>
      <View>
        <TouchableOpacity activeOpacity={0.8}  onPress={showDatepicker}><Ionicons name="ios-calendar" size={24} color="black" /></TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode='date'
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePicker;
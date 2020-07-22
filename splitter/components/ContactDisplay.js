import React, { PureComponent } from "react";
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

class ContactDisplay extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {                                     
        const newSelected = nextProps.selected                                        
        const oldSelected = this.props.selected                
    
        return newSelected !== oldSelected                  
      }    

    render() {
        
        const mobileNumber = this.props.mobileNumber
        const name = this.props.name
        const selected = this.props.selected

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.onSelect(name, mobileNumber)} style={[selected? styles.selected : styles.default, styles.container]}> 
              <Text>{name}</Text>
              <Text>{mobileNumber.toString()}</Text>
            </TouchableOpacity>
          );
    }
  }
  const styles = StyleSheet.create({
    selected: {
      backgroundColor: 'yellow'
    },
    default: {
        backgroundColor:'white'
    },
    container:{
      height: 40,
      flexDirection:'row',
      justifyContent: 'space-between',
      alignItems:'center'
    }

  });
  
export default ContactDisplay;
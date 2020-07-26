import * as authActions from "../store/actions/auth";
import * as Contacts from "expo-contacts";


export async function matchUsersWithContacts() {
  
  console.log("matching users with contacts...");
  const { status } = await Contacts.requestPermissionsAsync();
  if (status === "granted") {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    const filteredData = data.filter((contact) => {
      return contact.phoneNumbers !== undefined;
    });

    var contactsObj = {};
    filteredData.forEach((contactData) => {
      contactData.phoneNumbers.forEach((phoneNumber) => {
        if (phoneNumber.label === "mobile") {
          var number = phoneNumber.number;
          if (number.startsWith("+65")) {
            number = number.substr(3);
          }
          number = number.replace(/ /g, "");
          if (
            (number.startsWith("8") || number.startsWith("9")) &&
            number.length == 8
          ) {
            const newContactData = {
              mobileNumber: number.toString(),
              name: contactData.name,
            };
            contactsObj[number.toString()] = newContactData;
          }
        }
      });
    });
    return contactsObj;
    
  }
}
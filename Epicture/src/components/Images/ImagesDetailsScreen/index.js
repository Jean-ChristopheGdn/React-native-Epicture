import React from "react";
import { View, Text, Button } from "react-native";

const ImagesDetailsScreen = ({navigation}) => {
  return (
    <View>
      <Text>Images Details Screen</Text>
      <Button title="Revenir" 
      onPress={()=>{
        navigation.goBack();
      }} />
    </View>
  );
};

export default ImagesDetailsScreen;

import React from "react";
import { StyleSheet, AsyncStorage} from "react-native";
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ImagesListScreen from "./src/components/Images/ImagesListScreen";
import Home from "./src/components/Home";
import Profile from "./src/components/Users/Profile";
import UserImages from "./src/components/Users/UserImages";
import Search from "./src/components/Search";

const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "367556087120046",
      data: undefined,
      images: undefined,
      press: false,
      profile: undefined,
    }
  }

  _storeData = async (params) => {
    try {
      // console.log('token', params)
      await AsyncStorage.setItem(
        'token', 
        params.access_token,
  
      );
    } catch (error) {
      console.log('err', error)
    }
  };

  getParam = async (webViewState) => {
    let url = webViewState.url;
    let myregex = /callback/;
    if (url.match(myregex) !== null) {
      let params = {};
      let queryString = url;
      let regex = /([^#&=]+)=([^#&]*)/g
      while (match = regex.exec(queryString)) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
      }
      this.setState({ data: params })
      //console.log('params', params)
     // console.log('data', this.state.data)
      await this._storeData(params)
    //console.log('ok')
    const res = await this._retrieveData()
    //console.log('res', res)
  } 
  }

  render() {
    let clientId = this.state.clientId;
    if (this.state.data === undefined) {
      return (
        <WebView
          source={{ uri: 'https://api.imgur.com/oauth2/authorize?client_id=' + clientId + '&response_type=token&state=APPLICATION_STATE' }}
          style={{ marginTop: 20 }}
          onNavigationStateChange={this.getParam}   
        />       
      );
    } else {
      return (

          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Epicture" component={Home} />
              <Stack.Screen name="Rechercher" component={Search} />
              <Stack.Screen name="Aléatoire" component={ImagesListScreen} />
              <Stack.Screen name="Images" component={UserImages} />
              <Stack.Screen name="Profile" component={Profile} />
            </Stack.Navigator>

          </NavigationContainer>

      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
});

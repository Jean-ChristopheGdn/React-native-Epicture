import React from 'react';
import { WebView } from 'react-native-webview';
import { ImageBackground, StyleSheet, View, AsyncStorage, ScrollView, Dimensions, Text, Button, Image } from 'react-native';
import { ThemeProvider, Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';



const w = Dimensions.get('window');

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "ac3067b64f5e0e3",
      data: undefined,
      images: undefined,
      searchQuery: '',
      profile: '',
      image: null
    }

    this._retrieveData()
      .then((res) => {
        this.getProfile(res)
      })

  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({ data: value })
        // console.log('value', value);
        return value;
      }
    } catch (error) {
      console.log('error', error)
      // Error retrieving data
    }
  };

  getProfile = (res) => {
    let url = "https://api.imgur.com/3/account/me"
    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + res
      },
      mode: 'cors',
      cache: 'default'
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({ profile: res.data });
        //console.log(this.state.profile)
      })
      .catch((err) => {
        console.log(err.response)
      })
  }
  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
      //console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  render() {

    let clientId = this.state.clientId;
    let { image } = this.state;

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
        < ThemeProvider style={styles.container} >
          <ImageBackground source={{ uri: 'https://imgur.com/user/' + this.state.profile.url + '/cover?maxwidth=2560' }} style={styles.image}>
            <ScrollView style={styles.scrollView}>
              <View style={{ alignItems: "center" }}>
                <Avatar
                  size="large"
                  containerStyle={{ flex: 1, marginTop: 20 }}
                  rounded
                  source={{ uri: 'https://imgur.com/user/' + this.state.profile.url + '/avatar?maxwidth=50' }}
                />
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
                <Text>Hello {this.state.profile.url}</Text>
                <Text>Bio : {this.state.profile.bio}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Choisir une photo" onPress={this._pickImage} />
                {image && <Image source={{ uri: image }} style={{ width: w.width, height: w.width }}  />}
              </View>
            </ScrollView>
          </ImageBackground>
        </ThemeProvider >
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  header: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: 'center'
  },
  text: {
    flex: 1,
    fontSize: 30,
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center'


  }

});

export default Profile;

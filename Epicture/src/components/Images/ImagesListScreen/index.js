import React from 'react';
import { WebView } from 'react-native-webview';
import { ImageBackground, StyleSheet, ScrollView, ActivityIndicator, Dimensions, AsyncStorage, View } from 'react-native';
import { Image, ThemeProvider } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';


const w = Dimensions.get('window');

class ImagesListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "ac3067b64f5e0e3",
      data: undefined,
      images: undefined,
      press: false,
      searchQuery: '',
      image: null
    }
    this._retrieveData()
    .then ((res) => {
    this.getImages(res)  
    })    
    
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({ data: value })
        return value;
      }
    } catch (error) {
      console.log('error', error)
      // Error retrieving data
    }
  };

  getImages = (res) => {
    let url = "https://api.imgur.com/3/gallery/random/random/0"
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
        this.setState({ images: res.data });
        this.setState({ press: true });

      })
      .catch((err) => {
        console.log(err.response)
      })
  }



  displayImages = () => {
    if (this.state.press)
      return (
        this.state.images.map((image, item) => {
          return (
            <ScrollView>
              <Image
                key={item.toString()}
                source={{ uri: image.link }}
                style={{ width: w.width, height: w.width }} 
                PlaceholderContent={<ActivityIndicator />}
              />
            </ScrollView>
          )
        })
      )
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

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

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
        <ThemeProvider style={styles.container}>
          <ImageBackground source={{ uri: 'https://imgur.com/user/' + this.state.data.account_username + '/cover?maxwidth=2560' }} style={styles.image}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      </View>
            
            <ScrollView style={styles.scrollView}>
              {this.displayImages()}
            </ScrollView>
            
          </ImageBackground>
        </ThemeProvider>
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

export default ImagesListScreen;

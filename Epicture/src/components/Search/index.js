import React from 'react';
import { WebView } from 'react-native-webview';
import { ImageBackground, StyleSheet, Button, ScrollView, Dimensions, TextInput, ActivityIndicator, View} from 'react-native';
import { Image, ThemeProvider } from 'react-native-elements';


const w = Dimensions.get('window');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "ac3067b64f5e0e3",
      data: undefined,
      images: undefined,
      press: false,
      search: '',
      images: []
    }

  }

  getParam = (webViewState) => {
    let url = webViewState.url;
    let myregex = /callback/;
    if (url.match(myregex) !== null) {
      let params = {};
      let queryString = url;
      let regex = /([^#&=]+)=([^#&]*)/g
      while (match = regex.exec(queryString)) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
      }
      this.setState({ data: params }, () => {

      })
    }

  }

  _onChangeSearch = (search) => {
    this.setState({ search })
  }

  searchImages = () => {
    //console.log("Input ", this.state.search) 
    var myHeaders = new Headers();
    const clientId = this.state.clientId
    myHeaders.append("Authorization", "Client-ID " + clientId);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    console.log('input', this.state.search)

    let Search = "https://api.imgur.com/3/gallery/search?q=" + this.state.search
    fetch(Search, requestOptions)
      .then((res) => {
        return res.json();
      })
      .then(res => {
        //console.log('search', res.data)
        this.setState({ images: res.data });
        this.setState({ press: true });
        // console.log('res', res)
      })
      .catch(error => console.log('error', error));
  }

  displaySearch = () => {
    if (this.state.press)
      //console.log(this.state.images[0].link)
      return (

        this.state.images.map((image, index) => {
          return (

            <View>
              <Image
                key={index}
                source={{ uri: image.link }}
                style={{ width: w.width, height: w.width }}
                PlaceholderContent={<ActivityIndicator />}
              />
            </View>


          )
        })
      )
  }

  render() {
    let clientId = this.state.clientId;
    const { search } = this.state;
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
            <TextInput style={styles.textinput}
              placeholder="Rechercher"
              backgroundColor="white"
              onChangeText={this._onChangeSearch}
              value={search}

            />

            <Button title="recherche" onPress={this.searchImages} />
            <ScrollView >
              {this.displaySearch()}
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
  textinput: {

    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  }

});

export default Search;

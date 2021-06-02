import React, { Component } from  'react';
import  Navigation from './Components/Navigation/Navigation';
import  Logo from './Components/Logo/Logo';
import Clarifai from 'clarifai';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Rank from './Components/Rank/Rank';
import './App.css';
import Particles from 'react-particles-js';


const app = new Clarifai.App({
 apiKey: 'c80c4557cb784fbaa9a29973e6a621cb'
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 900
            }
         }
      }
    }
    
class App extends Component {
  constructor () {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
  }

}

displayFaceBox = (box) => {
    this.setState({box: box});
}

  onInputChange = (event) => {
   this.setState({input: event.target.value});
  }

 onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        'f76196b43bbd45c99b4f3cd8e8b40a8a',
        this.state.input)
      .then(response => 
        this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }    

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({isSignedIn:false})
  } else if (route === 'home') { 
      this.setState({isSignedIn: true});
}
  this.setState({route: route});
}

  render() {
   const { isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">

    <Particles className='particles'
        params={particlesOptions}
        />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      { route ==='home' 
      ? <div>
          <Logo />
          <Rank />
          <ImageLinkForm  
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
      : (
        route ==='signin'
        ? <Signin onRouteChange={this.onRouteChange}/>
        : <Register onRouteChange={this.onRouteChange}/>
        )
     
  }
    </div>
   );
  }
}

export default App;

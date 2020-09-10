import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone'
import spinner from './spinner.svg';
import './App.css';
import Recipe from './Recipe.js';

function MyDropzone(props) {
  const { callAPI } = props;
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        callAPI(new Uint8Array(binaryStr));
      }
      reader.readAsArrayBuffer(file)
    })
    
  }, [callAPI])
  const {getRootProps, getInputProps} = useDropzone({onDrop, accept: 'image/*'})

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} />
      <p className="dropzone-inside">Drag & drop an image here, or click to select one</p>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      apiResponse: ""
  };
  }

  async callAPI(file) {
    this.setState({apiResponse: 'loading'});
    let base64String = '';
    if (file) {
      base64String = btoa(String.fromCharCode(...new Uint8Array(file)));
    }
    const url = base64String || this.state.imageUrl;
    const result = await fetch('http://localhost:9000/api', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"url": url})
    });
    const data = await result.json();
    this.setState({ apiResponse: data });
  }

  changeHandler(event) {
    const value = event.target.value;
    this.setState({ imageUrl: value });
  }

  submitHandler() {
    if (/^https?:(?:[/.\w\s-%])*\.(?:jpe?g|gif|png|webp|bmp)$/i.test(this.state.imageUrl)) {
      this.callAPI.call(this);
      this.setState({error: undefined});
    } else {
      this.setState({error: 'invalid-url'});
    }
  }

  focusHandler(event) {
    const value = event.target.value;
    if (value === 'Please provide an image URL') {
      this.setState({imageUrl: ''});
    }
  }

  blurHandler(event) {
    const value = event.target.value;
    if (value === '') {
      this.setState({imageUrl: 'Please provide an image URL'});
    }
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">       
          <input 
            type='text'
            className='App-input' 
            value={this.state.imageUrl} 
            placeholder='Please provide an image URL'
            // onFocus={this.focusHandler.bind(this)}
            // onBlur={this.blurHandler.bind(this)}
            onChange={ this.changeHandler.bind(this) }> 
          </input>
          <button className='App-button' onClick={this.submitHandler.bind(this)}>Submit</button>
        </header>
        {this.state.error === 'invalid-url' ? <p className='App-error'>Please provide a valid URL to an image</p> : null}
        <MyDropzone callAPI={this.callAPI.bind(this)} />
        <div className='App-recipe-container'>
          {
            this.state.apiResponse && this.state.apiResponse !== 'loading' ?
            this.state.apiResponse.map(recipe => <Recipe data={recipe} />) :
            this.state.apiResponse === 'loading' ? <img src={spinner} alt="loading" /> : null
          }
        </div>
      </div>
    );
  }
}

export default App;

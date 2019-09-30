import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import onImageUpload from '../actions/act-imageUpload';

class ImageUpload extends Component {
  inputImage = React.createRef();
  uploadImage(file) {
    const node = this.inputImage.current;
    var reader = new FileReader();
    reader.onload = function () {
      node.src = reader.result;
    }
    reader.readAsDataURL(file);

    this.props.onImageUpload(file);
  }
  render() {
    return(
      <div className="inputWrapper">
        <div style={{position: 'relative'}}>
          <input onChange={(event) => this.uploadImage(event.target.files[0])}  type="file" /><br />
        </div>
        <img ref={this.inputImage} id="inputImage" style={{maxHeight: '300px', maxWidth: '300px'}} src=""/>
      </div>
    );
  }
}


function matchDispatchToProps(dispatch) {
  return bindActionCreators({onImageUpload: onImageUpload}, dispatch);
}

export default connect(null, matchDispatchToProps)(ImageUpload);

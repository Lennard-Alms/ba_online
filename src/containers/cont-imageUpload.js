import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import onImageUpload from '../actions/act-imageUpload';
import DragAndDropArea from './cont-dragAndDrop';

class ImageUpload extends Component {
  render() {
    return(
      <div className="inputWrapper">
        <div style={{position: 'relative'}}>
          <input onChange={(event) => this.props.onImageUpload(event.target.files[0], this.refs.inputImage)}  type="file" /><br />
          <DragAndDropArea handleDrop={(files) => this.props.onImageUpload(files[0], this.refs.inputImage)}>
            <div id="droparea">
              Drag and Drop here.
            </div>
          </DragAndDropArea>
        </div>
        <img ref="inputImage" id="inputImage" src=""/>
      </div>
    );
  }
}


function matchDispatchToProps(dispatch) {
  return bindActionCreators({onImageUpload: onImageUpload}, dispatch);
}

export default connect(null, matchDispatchToProps)(ImageUpload);

import React, {Component} from 'react';
import {connect} from 'react-redux';

class AccessTest extends Component {
  render() {
    if(this.props.imageLoading){
      return(<h2>Loading...</h2>);
    }
    if(!this.props.image2D || this.props.image2D.length == 0) {
      return(<h2>Select an image...</h2>);
    }
    return (
      <div>
        <h2>Upload completed</h2>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    image2D: state.imageUpload.image2D,
    imageLoading: state.imageUpload.imageLoading
  };
}

export default connect(mapStateToProps)(AccessTest);

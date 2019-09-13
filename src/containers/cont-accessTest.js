import React, {Component} from 'react';
import {connect} from 'react-redux';

class AccessTest extends Component {
  render() {
    if(!this.props.image2D || this.props.image2D.lenght > 0) {
      return(<h3>Select an image...</h3>);
    }
    console.log(this.props.image2D);
    return (
      <div>
        <p>uploaded</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {image2D: state.image2D};
}

export default connect(mapStateToProps)(AccessTest);

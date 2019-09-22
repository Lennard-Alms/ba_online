import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import onCalculateTextOptions from '../actions/act-calculateLetterPositions';
import onTextChange from '../actions/act-onTextChange'

//import Polygon from '../util/polygon';

class Output extends Component {
  polygonCanvas = React.createRef()

  createNameList() {
    return this.props.polygonList.map((polygon, indexOuter) => {
      return polygon.text.split('').map((letter, indexInner) => {
        var left = this.props.textOptionList[indexOuter][indexInner].x
        var top = this.props.textOptionList[indexOuter][indexInner].y
        var leftStr = '';
        var topStr = '';
        var sizeStr = '';
        var scaleX = this.props.textOptionList[indexOuter][indexInner].scaleX;
        var scaleY = this.props.textOptionList[indexOuter][indexInner].scaleY;
        var size = this.props.textOptionList[indexOuter][indexInner].size;
        if(this.props.textOptionList[indexOuter][indexInner].x == -1000 && this.props.textOptionList[indexOuter][indexInner].y == -1000){
          //left = 10 * indexInner;
          //top = 17 * indexOuter;
          leftStr = '0px';
          topStr = '0px';
          sizeStr = '0px';
        } else {
          //left *= 2;
          //top *= 2;
          //size *= 2;
          sizeStr = size.toString() + 'px';
          leftStr = left.toString() + 'px';
          topStr = top.toString() + 'px';

        }
        return(
          <span
            key={'polygon' + indexInner.toString() + 'letter' + indexOuter.toString()}
            style={{
              position: 'absolute',
              left: leftStr,
              top: topStr,
              display: this.props.textOptionList[indexOuter][indexInner].display,
              fontSize: size.toString() + 'px',
              transform: 'scaleX(' + scaleX.toString() + ') scaleY(' + scaleY.toString() + ') rotate(' + polygon.angle + 'rad)',
            }}
            >{letter}</span>
        );
      });
    });
  }
  drawOnCanvas() {
    var canvas = this.polygonCanvas.current;
    canvas.height=300;
    canvas.width=300;
    var ctx = canvas.getContext("2d");
    this.props.polygonList.forEach((polygon) => {
      polygon.getLineSegments().forEach((line) => {
          ctx.beginPath();
          ctx.moveTo(line.start.x, line.start.y);
          ctx.lineTo(line.end.x, line.end.y);
          ctx.stroke();
      });
    });
  }
  createTextChangeList() {
    return this.props.polygonList.map((polygon, index) => {
      return(
        <div key={'polyTextChange' + index.toString()}>
          <input className='textChangeInput' key={'polyText' + index.toString()} type='text' onChange={(event) => this.props.onTextChange(event, polygon, index)} value={polygon.text} />
        </div>
      );
    });
  }

  render() {
    return(
      <div>
        <button onClick={(event) => this.props.onCalculateTextOptions(this.props.polygonList)}>Rechne!</button>
        <div id='canvasPolygonDiv'>
          <img id='backgroundPic' src={this.props.imageLink}/>
          {this.createNameList()}
        </div>
        <div>
          {this.createTextChangeList()}
        </div>
      </div>
    );
  }
  componentDidMount(){
    this.props.onCalculateTextOptions(this.props.polygonList);
  }
}

function mapStateToProps(state) {
  return {
    polygonList: state.polygonList,
    textOptionList: state.textOptionList,
    imageLink: state.imageUpload.image
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    onCalculateTextOptions: onCalculateTextOptions,
    onTextChange: onTextChange
  }, dispatch);
}

export default connect(mapStateToProps,matchDispatchToProps)(Output);

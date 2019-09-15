import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
//import Polygon from '../util/polygon';

class Output extends Component {
  polygonCanvas = React.createRef()

  createNameList() {
    return this.props.polygonList.map((polygon, indexOuter) => {
      var letterArray = polygon.text.split('');
      return(
        <p key={'polygon' + indexOuter} className='polygonName' >
        {
          letterArray.map((letter, indexInner) => {
            return(
              <span key={'polygon' + indexInner + 'letter' + indexOuter}>{letter}</span>
            );
          })
        }
      </p>
      );
    });
  }
  drawOnCanvas() {
    var canvas = this.polygonCanvas.current;
    canvas.height=400; // alle alten koordinaten durch 2
    canvas.width=500;
    var ctx = canvas.getContext("2d");
    this.props.polygonList.forEach((polygon) => {
      polygon.getLineSegments().forEach((line) => {
          ctx.beginPath();
          ctx.moveTo(line.start.x /2, line.start.y /2);
          ctx.lineTo(line.end.x /2, line.end.y /2);
          ctx.stroke();
      });
    });
  }


  render() {
    return(
      <div>
        <div id='canvasPolygonDiv'>
          <canvas ref={this.polygonCanvas}/>
        </div>
        <div className='polygonNames'>{this.createNameList()}</div>
      </div>
    );
  }
  componentDidMount(){
    this.drawOnCanvas()
  }
}

function mapStateToProps(state) {
  return {
    polygonList: state.polygonList
  };
}

export default connect(mapStateToProps)(Output);

import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';

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
    canvas.height=500;
    canvas.width=300;
    var ctx = canvas.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.stroke();
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

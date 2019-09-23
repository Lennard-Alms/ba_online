import LineSegment from './lineSegment';
import Vertex from './vertex';
import Graph from './graph';
import {splitPolygon, findFurthestPoints, turnPolygon, turnBack, turn} from './geometry'
import NormalDistribution from 'normal-distribution';



export default function calculalteTextOptions(polygon) {
  var options = drawText(turnPolygon(polygon));
  console.log(options);
  return options;
}



const drawText = (polygon) => {

  var ereignisstruktur = polygon.outline.slice();
  ereignisstruktur.sort((v1,v2) => { return v1.x - v2.x; });

  var outlineSegments = polygon.getLineSegments();
  var e = 0.002;
  var bisectorSegments = [];
  var area = {};
  // REDUZIERUNG

  for(var index = 0; index < ereignisstruktur.length - 1; index++) {
    let v = ereignisstruktur[index];
    let u = ereignisstruktur[index + 1];

    if(Math.abs(v.x - u.x) <= e) continue;

    var leftLine = new LineSegment(new Vertex(v.x + e, -1000), new Vertex(v.x + e , 10000)); // change to 300
    var rightLine = new LineSegment(new Vertex(u.x - e, -1000), new Vertex(u.x - e , 10000)); // change to 300

    var cutListL = [];
    var cutListR = [];

    outlineSegments.forEach((segment) => {
      var cutL = new Vertex(0,0);
      var cutR = new Vertex(0,0);
      if(leftLine.getLineIntersection(segment, cutL)) cutListL.push(cutL);
      if(rightLine.getLineIntersection(segment, cutR)) cutListR.push(cutR);
    });

    cutListL.sort((v1,v2) => { return v1.y - v2.y; });
    cutListR.sort((v1,v2) => { return v1.y - v2.y; });

    if(cutListL.length % 2 != 0 || cutListR.length % 2 != 0) continue;
    try {
      for(var jndex = 0; jndex < cutListL.length; jndex += 2) {
        let upper = new LineSegment(cutListL[jndex], cutListR[jndex]);
        let lower = new LineSegment(cutListL[jndex + 1], cutListR[jndex + 1]);
        var y1 = (upper.start.y + lower.start.y) / 2;
        var y2 = (upper.end.y + lower.end.y) / 2;
        var bisector = new LineSegment(new Vertex(upper.start.x, y1), new Vertex(upper.end.x, y2));
        var areaBisec = (Math.abs(upper.start.y - lower.start.y) + Math.abs(upper.end.y - lower.end.y)) / 4;
        area[bisector] = Math.max(areaBisec, 0.01);
        bisectorSegments.push(bisector);
      }
    } catch(err) {
      continue;
    }

  }

  var alpha = 0.5;

  var newBisectorSegments = [];

  while(newBisectorSegments.length != bisectorSegments.length) {

    var mu = 0;

    bisectorSegments.forEach((segment) => {
      mu += area[segment];
    });

    mu = mu / bisectorSegments.length;

    bisectorSegments.forEach((segment) => {
      if(area[segment] >= alpha * mu){
        newBisectorSegments.push(segment);
      }
    });

    bisectorSegments = newBisectorSegments;
  }


  // AUSWAHL

  bisectorSegments.sort((l1,l2) => { return l1.start.x - l2.start.x });

  var deltax = 30.0;
  var lastColumn = [];
  var newColumn = [];

  var G = new Graph();
  bisectorSegments.forEach((l) => {
    G.addVertex(l.end);
    G.addVertex(l.start);
    if(newColumn.length > 0 && l.start.x != newColumn[0].start.x) {
      lastColumn = newColumn;
      newColumn = [];
    }
    lastColumn.forEach((r) => {
      if(l.start.sub(r.end).mag() < 1 || polygon.canSee(r.end,l.start) && l.start.x - r.end.x <= deltax){
        G.addEdge(r.end, l.start);
      }
    });
    newColumn.push(l);
    G.addEdge(l.start, l.end);
  });

  var longestPath = G.findLongestPath();

  if(!longestPath) {
    var textOptions = [];
    console.log('no longest Path');
    for(var i = 0; i < polygon.text.length; i++){
      textOptions.push({
        display: 'none',
        x: 0,
        y: 300,
        size: 15,
        scaleX: 1,
        scaleY: 1,
      });
    }
    return textOptions;
  }
  // DISKRETISIERUNG

  var tau = 5;

  var deltaX = longestPath[longestPath.length - 1].x - longestPath[0].x;
  deltaX = deltaX / (tau * polygon.text.length);

  var discretePath = [];

  var xPointer = longestPath[0].x + deltaX / 2;

  while(xPointer < longestPath[longestPath.length - 1].x) {

    for(let i = 0; i < longestPath.length - 1; i++) {

      var start = longestPath[i];
      var end = longestPath[i+1];
      if(start.x == xPointer && xPointer == end.x) {
        discretePath.push(new Vertex(xPointer, Math.max(start.y, end.y)));
      }
      else if(start.x <= xPointer && xPointer < end.x) {
        var kante = new LineSegment(start, end);
        var verticalLine = new LineSegment(new Vertex(xPointer, 0), new Vertex(xPointer, 1000));
        var cut = new Vertex(0,0);
        if(verticalLine.getLineIntersection(kante, cut)) {
          discretePath.push(cut);
        }
      }

    }
    xPointer += deltaX;
  }

  // HOEHENBESTIMMUNG


  var heights = [];

  discretePath.forEach((v) => {
    var verticalLine = new LineSegment(new Vertex(v.x, 0),new Vertex(v.x, 1000));
    var height = 10000.0;
    outlineSegments.forEach((l) => {
      var cut = new Vertex(0,0);
      if(verticalLine.getLineIntersection(l, cut)){
        var dist = Math.abs(cut.y - v.y);
        if(dist < height) {
          height = dist;
        }
      }
    });
    heights.push(height);
  });

  // ZENTRENBESTIMMUNG

  var zentren = [];

  // NORMALVERTEILUNG
  var sigmay = deltaX;

  for(let i = 0; i < polygon.text.length; i++){
    let z = new Vertex(discretePath[Math.floor(i * tau + tau / 2)].x,0);
    let norm = new NormalDistribution(z.x, deltaX * sigmay);
    let g = 0.0;
    let count = 0.0;
    discretePath.forEach((v) => {
      g = norm.pdf(v.x - deltaX / 2, v.x + deltaX / 2);
      count += g;
      z.y += g * v.y;
    });
    z.y = z.y / count;
    zentren.push(z);
  }


  // HOEHENBERECHNUNG

  var zHeights = [];
  var sigmad = deltaX;

  for(let i = 0; i < polygon.text.length; i++){
    let z = zentren[i];
    var zHeight = 0.0;
    let norm = new NormalDistribution(z.x, deltaX * sigmad);
    let g = 0.0;
    let count = 0.0;
    discretePath.forEach((v, j) => {
      g = norm.pdf(v.x - deltaX / 2, v.x + deltaX / 2);
      count += g;
      zHeight += g * heights[j];
    });
    zHeight = zHeight / count;
    zHeights.push(zHeight);
  }

  // Bewertung

  var tooHigh = false;
  for(let i = 0; i < polygon.text.length; i++){
    tooHigh = zHeights[i] * 2 > 1.5 * deltaX * tau * 4;
    if(tooHigh) break;
  }
  var foundCut = false;
  if(tooHigh && polygon.text.length != 1) {

    //SPLIT TEXT

    var textParts = splitText(polygon.text);
    var upperRatio = textParts[0].length / polygon.text.length;

    //SPLIT POLYGON

    ereignisstruktur = polygon.outline.slice();
    ereignisstruktur.sort((v1,v2) => { return v1.y - v2.y; });
    outlineSegments = polygon.getLineSegments();

    e = 0.002;

    bisectorSegments = [];

    var originalArea = polygon.getAreaSize();
    var wantedUpperArea = originalArea * upperRatio;
    var upperP = null;
    var lowerP = null;

    mainloop: for(let i = 0; i < ereignisstruktur.length - 1; i++) {
      let v = ereignisstruktur[i];
      let u = ereignisstruktur[i+1];

      if(Math.abs(u.y - v.y) < e * 10.0) continue;

      var upLine = new LineSegment(new Vertex(-1000, v.y + e), new Vertex(10000, v.y + e));
      var downLine = new LineSegment(new Vertex(-1000, u.y - e), new Vertex(10000, u.y - e));

      var cutListU = [];
      var cutListD = [];
      var connectedEdge = {};
      outlineSegments.forEach((l) => {
        var cutU = new Vertex(0,0);
        var cutD = new Vertex(0,0);

        if(upLine.getLineIntersection(l, cutU)) cutListU.push(cutU);
        if(downLine.getLineIntersection(l, cutD)) cutListD.push(cutD);
        connectedEdge[cutU] = l;
        connectedEdge[cutD] = l;
      });
      cutListU.sort((v1,v2) => { return v1.x - v2.x; });
      cutListD.sort((v1,v2) => { return v1.x - v2.x; });

      for(var j = 0; j < cutListU.length; j += 2) {
        let upper = new LineSegment(cutListU[j], cutListU[j+ 1]);
        let lower = new LineSegment(cutListD[j], cutListD[j+ 1]);
        let areaT = (upper.start.y + lower.start.y) * (Math.abs(upper.start.x - upper.end.x) + Math.abs(lower.start.x - lower.end.x)) / 2;
        areaT = Math.max(areaT, 0.01);

        var polygonParts = splitPolygon(polygon, upper.start, connectedEdge[upper.start], upper.end, connectedEdge[upper.end]);
        upperP = polygonParts[0];
        lowerP = polygonParts[1];
        var upperArea = upperP.getAreaSize();
        if(Math.abs(upperArea - wantedUpperArea) < originalArea * 0.05) {
          foundCut = true;
          break mainloop;
        }
      }
    }

    if(foundCut) {
      upperP.text = textParts[0];
      lowerP.text = textParts[1];
      var upperTextOptions = drawText(upperP);
      var lowerTextOptions = drawText(lowerP);
      if(upperP.text.length + lowerP.text.length == polygon.text.length){
        return upperTextOptions.concat(lowerTextOptions);
      } else {
        upperTextOptions.push({
          display: 'none',
          x: 1,
          y: 1,
          size: 1,
          scaleX: 1,
          scaleY: 1,
        });
        return upperTextOptions.concat(lowerTextOptions);
      }
    }
  }

  if(!foundCut){

    var letters = polygon.text.split('');

    var textOptions = [];

    letters.forEach((letter, index) => {

      var z = zentren[index];
      var h = zHeights[index];
      var positionVertext = turnBack(z, polygon.angle, 350);
      console.log(z,positionVertext);
      var size = h * 2.8;
      var scaleY = 1;
      var scaleX =(1.8 * deltaX * tau) / size;
      var scaleXVector = turnBack(new Vertex(scaleX, 0), polygon.angle, 0);
      var scaleYVector = turnBack(new Vertex(0, scaleY), polygon.angle, 0);
      var lx = positionVertext.x - (size * 0.3);
      var ly = positionVertext.y - (size / 1.5);
      var letterOptions = {
        display: 'inline',
        x: lx,
        y: ly,
        size: size,
        scaleX: Math.abs(scaleXVector.mag()),
        scaleY: Math.abs(scaleYVector.mag()),
      }
      textOptions.push(letterOptions);
    });

    return textOptions;
  }
}

//import hyphenopoly from 'hyphenopoly';

// const hyphenator = hyphenopoly.config({
//   "require": ["de", "en-us"],
//   "paths": {
//       "maindir": "../node_modules/hyphenopoly/",
//       "patterndir": "../node_modules/hyphenopoly/patterns/"
//   },
//   "hyphen": "•",
//   "loader": "http"
// });
//
// const hyphenateText = hyphenator.get("de");

const splitText = (text) => {

  if(text.includes(" ") || text.substring(0,text.length - 1).includes("-")){

    var indexList = [];

    var textArray = text.split('');
    for (let i = 0; i < text.length - 1; i++){
      var c = textArray[i];
      if(c == ' ' || c == '-') {
        indexList.push(i);
      }
    }

    mid = indexList[Math.floor(indexList.length/2)];

    if(textArray[mid] == '-') {
      return [text.substring(0, mid + 1), text.substring(mid + 1)];
    } else {
      return [text.substring(0, mid), text.substring(mid + 1)];
    }


  } else {

    // var hyphenatedText = hyphenator_de.hyphenateText(text);
    //
    // if(hyphenatedText.size() > 1) {
    //
    //   subPoly1Text = "";
    //   subPoly2Text = "";
    //
    //   for(var j = 0; j < hyphenatedText.length; j++) {
    //
    //     if(j < hyphenatedText.length / 2){
    //       subPoly1Text += hyphenatedText[j];
    //     } else {
    //       subPoly2Text += hyphenatedText[j];
    //     }
    //
    //   }
    //
    //   return [subPoly1Text, subPoly2Text]
    //
    // } else {

      var mid = Math.floor(text.length / 2);
      return [text.substring(0, mid), text.substring(mid)];

    // }
  }
}

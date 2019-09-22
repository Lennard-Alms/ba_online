import {getAreaSizeOfPolygon} from './geometry';
import LineSegment from './lineSegment';
import Vertex from './vertex';

class Polygon {
  constructor(outline, text) {
    this.outline = outline;
    this.text = text.toUpperCase();
    this.angle = 0;//Math.PI/2;
  }
  addVertex(vertex) {
    this.outline.push(vertex);
  }
  getAreaSize() {
    return getAreaSizeOfPolygon(this);
  }
  getLineSegment(index) {
    var start = this.outline[index];
    var end = this.outline[(index + 1) % this.outline.length];
    return new LineSegment(start, end);
  }
  getLineSegments() {
    var segments = [];
    this.outline.forEach((vertex, index) => {
      segments.push(this.getLineSegment(index));
    });
    return segments;
  }
  vertexInPolygon(v){
    var verticalLine = new LineSegment(v, new Vertex(v.x, 0));
    var intersectionCount = 0;
    this.getLineSegments().forEach((edge) => {
      if(edge.intersects(verticalLine)) intersectionCount++;
    });
    if(intersectionCount % 2 == 0) return false;
    return true;
  }
  canSee(v,w) {
    if(v.equals(w)) return true;
    var visionLine = new LineSegment(v,w);
    var intersect = new Vertex(-1,-1);
    this.getLineSegments().forEach((edge) => {
      if(visionLine.getLineIntersection(edge, intersect)) {
        if(!intersect.equals(v) && !intersect.equals(w)) {
          return false;
        }
      }
    });
    if(!this.vertexInPolygon(v)) return false;
    return true;
  }
}

export default Polygon;

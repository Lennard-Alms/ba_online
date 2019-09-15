import Geometry from './geometry';
import LineSegment from './lineSegment';

class Polygon {
  constructor(outline, text) {
    this.outline = outline;
    this.text = text.toUpperCase();
  }
  addVertex(vertex) {
    this.outline.push(vertex);
  }
  getAreaSize() {
    return Geometry.getAreaSizeOfPolygon(this);
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
}

export default Polygon;

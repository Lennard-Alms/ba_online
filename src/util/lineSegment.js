import Vertex from './vertex';

class LineSegment {
  constructor(start,end){
    this.start = start;
    this.end = end;
  }
  intersects(line) {
    return this.getLineIntersection(line, new Vertex(0, 0));
  }
  getLineIntersection(line, vertex) {
    return this.calculateLineIntersection(this.start.x, this.start.y, this.end.x, this.end.y,
      line.start.x, line.start.y, line.end.x, line.end.y, vertex);
  }
  calculateLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, i) {
      var s1_x, s1_y, s2_x, s2_y;
      s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
      s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

      var s, t;
      s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
      t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

      if (s > 0 && s < 1 && t > 0 && t < 1) {
          // Collision detected
          i.x = p0_x + (t * s1_x);
          i.y = p0_y + (t * s1_y);
          return true;
      }
      return false; // No collision
  }
  toString() {
    return 'ls:sx' + this.start.x + 'sy' + this.start.y + 'ex' + this.end.x + 'ey' + this.end.x;
  }
}

export default LineSegment;

class Vertex {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  sub(vertex) {
    return new Vertex(this.x - vertex.x, this.y - vertex.y);
  }
  add(vertex) {
      return new Vertex(this.x + vertex.x, this.y + vertex.y);
  }
  dist(vertex) {
    return this.sub(vertex).mag();
  }
  mult(scalar) {
      return new Vertex(this.x * scalar, this.y * scalar);
  }
  toString() {
    return 'vertex:x' + this.x + 'y' + this.y;
  }
  equals(v) {
    if(v.x == this.x && v.y == this.y) return true;
    return false;
  }
}
export default Vertex;

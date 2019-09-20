

class Graph{
  constructor() {
    this.vertecies = [];
    this.neighbours = {}
  }

  addEdge(v, u) {
    this.neighbours[v].push(u);
  }

  addVertex(v) {
    this.vertecies.push(v);
    this.neighbours[v] = [];
  }

  distance(v, u) {
    return Math.abs(u.x - v.x);
  }

  findLongestPath() {

    this.vertecies.sort((v1,v2) => { return v1.x - v2.x });

    var pathLengthEndingHere = {};
    var parent = {};

    this.vertecies.forEach((vertex) => {
      pathLengthEndingHere[vertex] = 1;
    });

    if(this.vertecies.length == 0) return null;

    this.vertecies.forEach((vertex) => {
      this.neighbours[vertex].forEach((neighbour) => {
        if(pathLengthEndingHere[vertex] + this.distance(vertex,neighbour) > pathLengthEndingHere[neighbour]) {
          parent[neighbour] = vertex;
          pathLengthEndingHere[neighbour] = pathLengthEndingHere[vertex] + this.distance(vertex,neighbour);
        }
      });
    });

    var winner = this.vertecies[0];

    this.vertecies.forEach((vertex) => {
      if(pathLengthEndingHere[vertex] > pathLengthEndingHere[winner]) winner = vertex;
    });

    var longestPath = [];

    var pointer = winner;

    while(pointer) {
      longestPath.unshift(pointer);
      pointer = parent[pointer];
    }

    return longestPath;

  }

}

export default Graph;






















//

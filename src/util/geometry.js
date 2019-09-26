import Polygon from './polygon';
import Vertex from './vertex';
import hull from 'hull.js';

export function getAreaSizeOfPolygon(polygon) {
  var area = 0;
  polygon.getLineSegments().forEach((line) => {
    area += (line.start.x * line.end.y - line.start.y * line.end.x);
  });
  area /= 2;
  return Math.abs(area);
}

export function calcPolyOrientation(outline){
  var convexHull = hull(outline, Infinity, ['.x', '.y']);
  convexHull.pop();
  var podalPoints = getAllAntiPodalPairs(convexHull);
  var minDiameter = 9999999;
  var bestPair = null;
  podalPoints.forEach((pair) => {
    let u = new Vertex(pair[0].x, pair[0].y);
    let v = new Vertex(pair[1].x, pair[1].y);
    let diameter = u.dist(v);
    if( diameter < minDiameter ){
      minDiameter = diameter;
      bestPair = [u,v];
    }
  });
  var direction = bestPair[0].sub(bestPair[1]);
  var angle = Math.atan2(direction.y, direction.x);
  if(angle < 0) angle += 2 * Math.PI;
  angle += Math.PI * 0.5;
  return angle;
}

function getAllAntiPodalPairs(hull){
  const n = hull.length
  function next(i) {return (i + 1) % n}
  var pairs = [];
  var p = n - 1;
  var q = next(p);
  while(calcSignedTriangleArea(hull[p],hull[next(p)],hull[next(q)]) > calcSignedTriangleArea(hull[p],hull[next(p)],hull[q])) {
    q = next(q);
  }

  var q0 = q;
  while(q != 0) {
    p = next(p);
    pairs.push([hull[p],hull[q]]);
    while(calcSignedTriangleArea(hull[p],hull[next(p)],hull[next(q)]) > calcSignedTriangleArea(hull[p],hull[next(p)],hull[q])) {
      q = next(q);
      if(p != q0 && q != 0) {
        pairs.push([hull[p],hull[q]]);
      } else {
        break;
      }
    }
    if(calcSignedTriangleArea(hull[p],hull[next(p)],hull[next(q)]) == calcSignedTriangleArea(hull[p],hull[next(p)],hull[q])){
      if(p != q0 && q != n - 1){
        pairs.push([hull[p],hull[next(q)]]);
      }
    }
  }
  return pairs;
}

function calcSignedTriangleArea(u,v,w) {
  var matrix = [[u.x,u.y,1],[v.x,v.y,1],[w.x,w.y,1]];
  const determinant = m =>
    m.length == 1 ?
    m[0][0] :
  	m.length == 2 ?
  	m[0][0]*m[1][1]-m[0][1]*m[1][0] :
  	m[0].reduce((r,e,i) => r+(-1)**(i+2)*e*determinant(m.slice(1).map(c => c.filter((_,j) => i != j))),0);
  return determinant(matrix) * 0.5;
}


export function turnPolygon(polygon) {
  var newOutline = [];
  polygon.outline.forEach((point) => {
    newOutline.push(turn(point, polygon.angle, 350));
  });
  var newPoly = new Polygon(newOutline, polygon.text);
  newPoly.angle = polygon.angle;
  return newPoly;
}

export function turn(point, angle, offset) {
    return new Vertex(offset + Math.cos(-1 * angle) * point.x - Math.sin(-1 * angle) * point.y, offset + Math.sin(-1 * angle) * point.x + Math.cos(-1 * angle) * point.y)
}

export function turnBack(point, angle, offset) {
    return new Vertex(Math.cos(angle) * (point.x - offset) - Math.sin(angle) * (point.y - offset), Math.sin(angle) * (point.x - offset) + Math.cos(angle) * (point.y - offset));
}



export function eliminateDuplicates(outline) {
  var checklist = new Set([]);
  var newOutline = [];
  outline.forEach((v) => {
    if(!checklist.has(v)) {
      newOutline.push(v);
      checklist.add(v);
    }
  });
  return newOutline;
}

export function splitPolygon(poly, v, vEdge, w, wEdge) {
  var upper = [];
  var lower = [];
  var lowerArc = true;

  poly.outline.forEach((u) => {
    if(!u.equals(vEdge.start) && !u.equals(wEdge.start)) {
      if(lowerArc) lower.push(u);
      if(!lowerArc) upper.push(u);
    } else if(u.equals(vEdge.start)) {
      if(lowerArc) {
        lower.push(u);
        lower.push(v);
        upper.push(v);
        lowerArc = false;
      } else {
        upper.push(u);
        upper.push(v);
        lower.push(v);
        lowerArc = true;
      }
    } else if(u.equals(wEdge.start)) {
      if(lowerArc) {
        lower.push(u);
        lower.push(w);
        upper.push(w);
        lowerArc = false;
      } else {
        upper.push(u);
        upper.push(w);
        lower.push(w);
        lowerArc = true;
      }
    }
  });
  upper = eliminateDuplicates(upper);
  lower = eliminateDuplicates(lower);


  var vTOw = w.sub(v);
  var vTOvEdgeStart = vEdge.start.sub(v);

  var angle = Math.atan2(vTOvEdgeStart.y, vTOvEdgeStart.x) - Math.atan2(vTOw.y, vTOw.x);
  if(angle < 0) angle += 2 * Math.PI;

  var setUpper = new Set(upper);
  if(angle > Math.PI) {
    if(setUpper.has(vEdge.start)) {
      return [new Polygon(upper,''), new Polygon(lower,'')];
    } else {
      return [new Polygon(lower,''), new Polygon(upper,'')];
    }
  } else {
    if(setUpper.has(vEdge.start)) {
      return [new Polygon(lower,''), new Polygon(upper,'')];
    } else {
      return [new Polygon(upper,''), new Polygon(lower,'')];
    }
  }

}

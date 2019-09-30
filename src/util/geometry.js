import Polygon from './polygon';
import Vertex from './vertex';

export function getAreaSizeOfPolygon(polygon) {
  var area = 0;
  polygon.getLineSegments().forEach((line) => {
    area += (line.start.x * line.end.y - line.start.y * line.end.x);
  });
  area /= 2;
  return Math.abs(area);
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
    return new Vertex(offset + Math.cos(-1 * angle) * point.x - Math.sin(-1 * angle) * point.y, offset + Math.sin(-1 * angle) * point.x + Math.cos(-1 * angle) * point.y);
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

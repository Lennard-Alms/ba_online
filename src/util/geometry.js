class Geometry {
  getAreaSizeOfPolygon(polygon) {
    var area = 0;
    polygon.getLineSegments().forEach((line) => {
      area += (line.start.x * line.end.y - line.start.y * line.end.x);
    });
    area /= 2;
    return Math.abs(area);
  }
}
export default Geometry;

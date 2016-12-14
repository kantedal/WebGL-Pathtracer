struct BBoxCollision {
  float collision_distance;
  Object object;
};

bool PointInsideBox(vec3 bottom, vec3 top, vec3 point) {
  return (bottom.x < point.x && bottom.y < point.y && bottom.z < point.z && top.x > point.x && top.y > point.y && top.z > point.z);
}

// Returns collision distance
float BoundingBoxCollision(vec3 bottom, vec3 top, Ray r, float is_leaf) {
  // Disables self collision, which speeds up the render quite a bit
//  if (is_leaf == 1.0 ) {
//    if (PointInsideBox(bottom, top, r.start_position)) return 0.0;
//  }

  //if (PointInsideBox(bottom, top, r.start_position)) return 0.0;

  vec3 dirfrac = vec3(0,0,0);
  dirfrac.x = 1.0 / r.direction.x;
  dirfrac.y = 1.0 / r.direction.y;
  dirfrac.z = 1.0 / r.direction.z;

  // lb is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
  // r.org is origin of ray
  float t1 = (bottom.x - r.start_position.x) * dirfrac.x;
  float t2 = (top.x - r.start_position.x) * dirfrac.x;
  float t3 = (bottom.y - r.start_position.y) * dirfrac.y;
  float t4 = (top.y - r.start_position.y) * dirfrac.y;
  float t5 = (bottom.z - r.start_position.z) * dirfrac.z;
  float t6 = (top.z - r.start_position.z) * dirfrac.z;

  float tmin = max(max(min(t1, t2), min(t3, t4)), min(t5, t6));
  float tmax = min(min(max(t1, t2), max(t3, t4)), max(t5, t6));

  // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
  if (tmax < 0.0 || tmin > tmax) return 10000.0;

  return tmin;
}

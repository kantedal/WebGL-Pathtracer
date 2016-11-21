struct LeafNode {
  float distance;
  int triangle_start_index;
  int triangle_count;
};


bool BoundingBoxCollision(vec3 bottom, vec3 top, Ray r, inout float collision_distance) {
  vec3 dirfrac = vec3(0,0,0);
  dirfrac.x = 1.0 / r.direction.x;
  dirfrac.y = 1.0 / r.direction.y;
  dirfrac.z = 1.0 / r.direction.z;

  // lb is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
  // r.org is origin of ray
  float t1 = (bottom.x - r.start_position.x)*dirfrac.x;
  float t2 = (top.x - r.start_position.x)*dirfrac.x;
  float t3 = (bottom.y - r.start_position.y)*dirfrac.y;
  float t4 = (top.y - r.start_position.y)*dirfrac.y;
  float t5 = (bottom.z - r.start_position.z)*dirfrac.z;
  float t6 = (top.z - r.start_position.z)*dirfrac.z;

  float tmin = max(max(min(t1, t2), min(t3, t4)), min(t5, t6));
  float tmax = min(min(max(t1, t2), max(t3, t4)), max(t5, t6));

  // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
  if (tmax < 0.0 || tmin > tmax) return false;

  collision_distance = tmin;
  return true;
}


bool BoundingBoxCollision(vec3 bottom, vec3 top, Ray ray) {
  float tmin = (bottom.x - ray.start_position.x) / ray.direction.x;
  float tmax = (top.x - ray.start_position.x) / ray.direction.x;

  if (tmin > tmax) {
    float temp = tmin;
    tmin = tmax;
    tmax = temp;
  }

  float tymin = (bottom.y - ray.start_position.y) / ray.direction.y;
  float tymax = (top.y - ray.start_position.y) / ray.direction.y;

  if (tymin > tymax) {
    float temp = tymin;
    tymin = tymax;
    tymax = temp;
  }

  if ((tmin > tymax) || (tymin > tmax))
  return false;

  if (tymin > tmin)
  tmin = tymin;

  if (tymax < tmax)
  tmax = tymax;

  float tzmin = (bottom.z - ray.start_position.z) / ray.direction.z;
  float tzmax = (top.z - ray.start_position.z) / ray.direction.z;

  if (tzmin > tzmax) {
    float temp = tzmin;
    tzmin = tzmax;
    tzmax = temp;
  }

  if ((tmin > tzmax) || (tzmin > tmax))
  return false;

  if (tzmin > tmin)
  tmin = tzmin;

  if (tzmax < tmax)
  tmax = tzmax;

  return true;
}


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

  if ((tmin > tzmax) || (tzmin > tmax)) return false;

  return true;
}

bool BoundingBoxIntersection(vec3 bottom, vec3 top, Ray ray) {
  float tmin, tmax, tymin, tymax, tzmin, tzmax;

  if (ray.sign.x == 0.0) {
    tmin = (bottom.x - ray.start_position.x) * ray.inv_direction.x;
    tmax = (top.x - ray.start_position.x) * ray.inv_direction.x;
  }
  else {
    tmin = (top.x - ray.start_position.x) * ray.inv_direction.x;
    tmax = (bottom.x - ray.start_position.x) * ray.inv_direction.x;
  }

  if (ray.sign.y == 0.0) {
    tymin = (bottom.y - ray.start_position.y) * ray.inv_direction.y;
    tymax = (top.y - ray.start_position.y) * ray.inv_direction.y;
  }
  else {
    tymin = (top.y - ray.start_position.y) * ray.inv_direction.y;
    tymax = (bottom.y - ray.start_position.y) * ray.inv_direction.y;
  }

  if ((tmin > tymax) || (tymin > tmax))
    return false;
  if (tymin > tmin)
    tmin = tymin;
  if (tymax < tmax)
    tmax = tymax;

  if (ray.sign.z == 0.0) {
    tzmin = (bottom.z - ray.start_position.z) * ray.inv_direction.z;
    tzmax = (top.z - ray.start_position.z) * ray.inv_direction.z;
  }
  else {
    tzmin = (top.z - ray.start_position.z) * ray.inv_direction.z;
    tzmax = (bottom.z - ray.start_position.z) * ray.inv_direction.z;
  }

  if ((tmin > tzmax) || (tzmin > tmax))
    return false;
  if (tzmin > tmin)
    tmin = tzmin;
  if (tzmax < tmax)
    tmax = tzmax;

  return true;
}

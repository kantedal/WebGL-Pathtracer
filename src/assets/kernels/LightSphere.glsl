
//bool LightSphereContribution(Ray ray, inout Collision collision) {
//  vec3 position = vec3(0,0,0);
//  float radius = 100.0;
//
//  vec3 op = position - ray.start_position;
//  float t, epsilon = 0.0001;
//  float b = dot(op, ray.direction);
//  float disc = b * b - dot(op, op) + radius * radius;
//  if (disc < 0.0) return false;
//  else disc = sqrt(disc);
//
//  t = (t = b - disc) > epsilon ? t : ((t = b + disc) > epsilon ? t : 0.0);
//
//  if (t < 0.01)
//    return false;
//
//  collision.position = ray.start_position + ray.direction * t;
//  collision.normal = normalize(collision.position  - position);
//  collision.material_index = 8;
//  collision.distance = distance(ray.start_position, collision.position);
//
//  return true;
//}


vec3 LightSphereContributions(Ray ray) {
  vec3 sun_position = normalize(vec3(1.0, 1.0, 1.0));
  vec3 position = vec3(0,0,0);
  float radius = 100.0;

  vec3 op = position - ray.start_position;
  float t, epsilon = 0.0001;
  float b = dot(op, ray.direction);
  float disc = b * b - dot(op, op) + radius * radius;
  if (disc < 0.0) return vec3(0,0,0);
  else disc = sqrt(disc);

  t = (t = b - disc) > epsilon ? t : ((t = b + disc) > epsilon ? t : 0.0);

  if (t < 0.01)
    return vec3(0,0,0);

  vec3 collision_position = (ray.start_position + ray.direction * t) / 100.0;
  float sun_distance = distance(collision_position, sun_position);

  if (sun_distance < 0.1) {
    return vec3(1,0.7,0.7) * 20.0;
  }
  else {
    return vec3(pow(1.0 - clamp(collision_position.y, 0.0, 1.0), 2.0) * 0.9, 0.9, 1.0) * 0.05;
  }
}

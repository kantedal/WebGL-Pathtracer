struct Sphere {
  vec3 position;
  float radius;
  int material_index;
};

bool SphereIntersection(Ray ray, Sphere sphere, inout Collision collision) {
  vec3 position = sphere.position;
  float radius = sphere.radius;

  vec3 op = position - ray.start_position;
  float t, epsilon = 0.0001;
  float b = dot(op, ray.direction);
  float disc = b * b - dot(op, op) + radius * radius;
  if (disc < 0.0) return false;
  else disc = sqrt(disc);


  t = (t = b - disc) > epsilon ? t : ((t = b + disc) > epsilon ? t : 0.0);

  if (t < 0.01)
    return false;

  collision.position = ray.start_position + ray.direction * t;
  collision.normal = normalize(collision.position  - position);
  collision.material_index = sphere.material_index;

  return true;
}

Sphere GetSphere(int sphere_index) {
  // Fetch material from texture
  vec2 sample = vec2(1.0, 0.0) / vec2(512, 512);
  vec2 start_sample = (vec2(1.0, 0.0) / vec2(512, 512)) * float(sphere_index) * 2.0 + 0.5 * sample;

  vec3 color = vec3(texture2D(u_sphere_texture, start_sample));
  float radius = texture2D(u_sphere_texture, start_sample + sample).x;
  int material_index = int(texture2D(u_sphere_texture, start_sample + sample).y);
  return Sphere(color, radius, material_index);
}

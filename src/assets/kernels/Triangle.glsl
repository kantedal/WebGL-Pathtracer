struct Triangle {
  vec3 v0;
  vec3 edge1;
  vec3 edge2;
  int material_index;
};

// Ray CreateRay(vec2 pixel_position, int sample) {
//   vec3 base_vector_x = camera.v3 - camera.v4;
//   vec3 base_vector_y = camera.v1 - camera.v4;
//
//   float width = 512.0;
//   float height = 512.0;
//
//   vec3 dx = (base_vector_x / width);
//   vec3 dy = (base_vector_y / height);
//
//   vec3 rand_x = dx * random(vec3(1.9898, 128.13, 7.7182), time + float(sample));
//   vec3 rand_y = dy * random(vec3(134.9898, 36.342, 424.232), time + float(sample));
//
//   vec3 vert = camera.v4 + pixel_position.x / width * base_vector_x + (1.0 - pixel_position.y / height) * base_vector_y;
//   vert += rand_x + rand_y;
//   vec3 direction = normalize(vert - camera.position);
//
//   return Ray(camera.position, direction);
// }

Triangle GetTriangleFromIndex(int triangle_index) {
  // Fetch triangle from texture
  vec2 sample = vec2(1.0,0) / vec2(1024, 1024);
  vec2 start_sample = (vec2(1.0,0) / vec2(1024, 1024)) * float(triangle_index) * 4.0 + 0.5 * sample;

  vec3 v0 = vec3(texture2D(u_triangle_texture, start_sample));
  vec3 v1 = vec3(texture2D(u_triangle_texture, start_sample + sample));
  vec3 v2 = vec3(texture2D(u_triangle_texture, start_sample + 2.0 * sample));

  vec3 edge1 = v1 - v0;
  vec3 edge2 = v2 - v0;

  int material_index = int(texture2D(u_triangle_texture, start_sample + 3.0 * sample).x);

  return Triangle(v0, edge1, edge2, material_index);
}

Triangle GetLightTriangleFromIndex(int triangle_index) {
  // Fetch triangle from texture
  vec2 sample = vec2(1.0,0) / vec2(128, 128);
  vec2 start_sample = (vec2(1.0,0) / vec2(128, 128)) * float(triangle_index) * 4.0 + 0.5 * sample;

  vec3 v0 = vec3(texture2D(u_light_texture, start_sample));
  vec3 v1 = vec3(texture2D(u_light_texture, start_sample + sample));
  vec3 v2 = vec3(texture2D(u_light_texture, start_sample + 2.0 * sample));

  vec3 edge1 = v1 - v0;
  vec3 edge2 = v2 - v0;

  int material_index = int(texture2D(u_light_texture, start_sample + 3.0 * sample).x);

  return Triangle(v0, edge1, edge2, material_index);
}

bool TriangleIntersection(Ray ray, Triangle triangle, inout Collision collision) {
  float EPS = 0.0001;

  //Begin calculating determinant - also used to calculate u parameter
  vec3 P = cross(ray.direction, triangle.edge2);
  float det = dot(triangle.edge1, P);

  if (det > -EPS && det < EPS) return false;
  float inv_det = 1.0 / det;

  //Distance from vertex1 to ray origin
  vec3 T = ray.start_position - triangle.v0;
  float u = dot(T, P);
  if (u < 0.0 || u > det) return false;

  vec3 Q = cross(T, triangle.edge1);

  float v = dot(ray.direction, Q);
  if(v < 0.0 || u+v > det) return false;

  float t = dot(triangle.edge2, Q);

  if(t > EPS) {
      collision.position = ray.start_position + inv_det * t * ray.direction;
      collision.material_index = triangle.material_index;
      collision.normal = normalize(cross(triangle.edge1, triangle.edge2));
      return true;
  }

  return false;
}

vec3 RandomizePointOnTriangle(Triangle triangle) {
  float u = random(vec3(51.9898, 4567.13, 23.7182), time);
  float v = (1.0 - u) * random(vec3(4.9898, 421.13, 45.7182), time + 245.642);
  
  vec3 v0 = triangle.v0;
  vec3 v1 = triangle.edge1 + v0;
  vec3 v2 = triangle.edge2 + v0;
  return (1.0 - u - v) * v0 + u * v1 + v * v2;
}

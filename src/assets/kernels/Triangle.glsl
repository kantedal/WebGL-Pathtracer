struct Triangle {
  vec3 v0;
  vec3 edge1;
  vec3 edge2;
  vec3 n0;
  vec3 n1;
  vec3 n2;
  int material_index;
};

Triangle GetTriangleFromIndex(int triangle_index) {
  // Fetch triangle from texture
  vec2 sample_step = vec2(1.0,0) / vec2(2048, 2048);
  vec2 start_sample = (vec2(1.0,0) / vec2(2048, 2048)) * float(triangle_index) * 7.0;

  vec2 sample1 = vec2(start_sample.x - floor(start_sample.x), floor(start_sample.x) / 2048.0);
  vec2 sample2 = vec2((start_sample.x + 1.0*sample_step.x) - floor((start_sample.x + 1.0*sample_step.x)), floor((start_sample.x + 1.0*sample_step.x)) / 2048.0);
  vec2 sample3 = vec2((start_sample.x + 2.0*sample_step.x) - floor((start_sample.x + 2.0*sample_step.x)), floor((start_sample.x + 2.0*sample_step.x)) / 2048.0);
  vec2 sample4 = vec2((start_sample.x + 3.0*sample_step.x) - floor((start_sample.x + 3.0*sample_step.x)), floor((start_sample.x + 3.0*sample_step.x)) / 2048.0);
  vec2 sample5 = vec2((start_sample.x + 4.0*sample_step.x) - floor((start_sample.x + 4.0*sample_step.x)), floor((start_sample.x + 4.0*sample_step.x)) / 2048.0);
  vec2 sample6 = vec2((start_sample.x + 5.0*sample_step.x) - floor((start_sample.x + 5.0*sample_step.x)), floor((start_sample.x + 5.0*sample_step.x)) / 2048.0);
  vec2 sample7 = vec2((start_sample.x + 6.0*sample_step.x) - floor((start_sample.x + 6.0*sample_step.x)), floor((start_sample.x + 6.0*sample_step.x)) / 2048.0);

  vec3 v0 = vec3(texture2D(u_triangle_texture, sample1));
  vec3 edge1 = vec3(texture2D(u_triangle_texture, sample2));
  vec3 edge2 = vec3(texture2D(u_triangle_texture, sample3));

  vec3 n0 = vec3(texture2D(u_triangle_texture, sample4));
  vec3 n1 = vec3(texture2D(u_triangle_texture, sample5));
  vec3 n2 = vec3(texture2D(u_triangle_texture, sample6));

  int material_index = int(texture2D(u_triangle_texture, sample7).x);

  return Triangle(v0, edge1, edge2, n0, n1, n2, material_index);
}

int getTriangleIndex(int stackIdx) {
  vec2 sample_step = vec2(1.0,0) / vec2(1024, 1024);
  vec2 start_sample = (vec2(1.0,0) / vec2(1024, 1024)) * float(stackIdx);

  float row = floor(start_sample.x);
  start_sample.x = start_sample.x - row;
  start_sample.y = row / 1024.0;

  vec3 triangle_index_slot = vec3(texture2D(u_triangle_index_texture, start_sample));
  return int(triangle_index_slot.x);
}

Triangle GetLightTriangleFromIndex(int triangle_index) {
  // Fetch triangle from texture
  vec2 sample_step = vec2(1.0,0) / vec2(128, 128);
  vec2 start_sample = (vec2(1.0,0) / vec2(128, 128)) * float(triangle_index) * 4.0;// + 0.5 * sample_step;

  vec3 v0 = vec3(texture2D(u_light_texture, start_sample));
  vec3 v1 = vec3(texture2D(u_light_texture, start_sample + sample_step));
  vec3 v2 = vec3(texture2D(u_light_texture, start_sample + 2.0 * sample_step));

  vec3 edge1 = v1 - v0;
  vec3 edge2 = v2 - v0;

  int material_index = int(texture2D(u_light_texture, start_sample + 3.0 * sample_step).x);

  return Triangle(v0, edge1, edge2, vec3(0,0,0), vec3(0,0,0), vec3(0,0,0), material_index);
}

bool TriangleIntersection(Ray ray, Triangle triangle, inout Collision collision, float closest_collision_distance) {
  if (dot(ray.direction, triangle.n0) > 0.0) return false;

  //Begin calculating determinant - also used to calculate u parameter
  vec3 P = cross(ray.direction, triangle.edge2);
  float det = dot(triangle.edge1, P);
  float inv_det = 1.0 / det;

  if (det > -EPS && det < EPS) return false;

  //Distance from vertex1 to ray origin
  vec3 T = ray.start_position - triangle.v0;
  float u = dot(T, P) * inv_det;
  if (u < 0.0 || u > 1.0) return false;

  vec3 Q = cross(T, triangle.edge1);

  float v = dot(ray.direction, Q) * inv_det;
  if(v < 0.0 || u+v > 1.0) return false;

  float t = dot(triangle.edge2, Q);

  if(t > EPS) {
    collision.position = ray.start_position + inv_det * t * ray.direction;
    collision.distance = distance(ray.start_position, collision.position);

    if (closest_collision_distance < collision.distance){
      return false;
    }

    collision.material_index = triangle.material_index;
    // Interpolate normal
    float m = (triangle.n0 == triangle.n1 && triangle.n0 == triangle.n2) ? 0.0 : 1.0;
    collision.normal = mix(triangle.n0, (1.0 - u - v) * triangle.n0 + u * triangle.n1 + v * triangle.n2, m);
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

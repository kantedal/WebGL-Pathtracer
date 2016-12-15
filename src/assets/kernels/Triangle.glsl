struct Triangle {
  vec3 v0;
  vec3 edge1;
  vec3 edge2;
  vec3 n0;
  vec3 n1;
  vec3 n2;
  vec2 uv0;
  vec2 uv1;
  vec2 uv2;
  float triangle_area;
  int material_index;
};

struct BaseTriangle {
  vec3 v0;
  vec3 edge1;
  vec3 edge2;
};

Triangle GetTriangleFromIndex(int triangle_index) {
  // Fetch triangle from texture
  vec2 start_sample = SAMPLE_STEP_2048 * float(triangle_index) * 11.0;

  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 0.0);
  vec2 sample2 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 1.0);
  vec2 sample3 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 2.0);
  vec2 sample4 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 3.0);
  vec2 sample5 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 4.0);
  vec2 sample6 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 5.0);
  vec2 sample7 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 6.0);
  vec2 sample8 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 7.0);
  vec2 sample9 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 8.0);
  vec2 sample10 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 9.0);

  vec3 v0 = vec3(texture2D(u_triangle_texture, sample1));
  vec3 edge1 = vec3(texture2D(u_triangle_texture, sample2));
  vec3 edge2 = vec3(texture2D(u_triangle_texture, sample3));

  vec3 n0 = vec3(texture2D(u_triangle_texture, sample4));
  vec3 n1 = vec3(texture2D(u_triangle_texture, sample5));
  vec3 n2 = vec3(texture2D(u_triangle_texture, sample6));

  vec2 uv0 = vec2(texture2D(u_triangle_texture, sample7));
  vec2 uv1 = vec2(texture2D(u_triangle_texture, sample8));
  vec2 uv2 = vec2(texture2D(u_triangle_texture, sample9));

  int material_index = int(texture2D(u_triangle_texture, sample10).x);
  float triangle_area = texture2D(u_light_texture, sample10).z;

  return Triangle(v0, edge1, edge2, n0, n1, n2, uv0, uv1, uv2, triangle_area, material_index);
}

BaseTriangle GetBaseTriangleFromIndex(int triangle_index) {
  // Fetch triangle from texture
  vec2 start_sample = SAMPLE_STEP_2048 * float(triangle_index) * 11.0;

  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 0.0);
  vec2 sample2 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 1.0);
  vec2 sample3 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 2.0);

  vec3 v0 = vec3(texture2D(u_triangle_texture, sample1));
  vec3 edge1 = vec3(texture2D(u_triangle_texture, sample2));
  vec3 edge2 = vec3(texture2D(u_triangle_texture, sample3));

  return BaseTriangle(v0, edge1, edge2);
}

int getTriangleIndex(int stackIdx) {
  vec2 start_sample = SAMPLE_STEP_1024 * float(stackIdx);
  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_1024, 1024.0, 0.0);

  vec4 triangle_index_slot = texture2D(u_triangle_index_texture, sample1);
  return int(triangle_index_slot.x);
}

Triangle GetLightTriangleFromIndex(int triangle_index) {
  // Fetch triangle from texture
  vec2 sample_step = vec2(1.0,0) / vec2(128, 128);
  vec2 start_sample = (vec2(1.0,0) / vec2(128, 128)) * float(triangle_index) * 11.0;

  vec2 sample1 = getSample(start_sample, sample_step, 128.0, 0.0);
  vec2 sample2 = getSample(start_sample, sample_step, 128.0, 1.0);
  vec2 sample3 = getSample(start_sample, sample_step, 128.0, 2.0);
  vec2 sample4 = getSample(start_sample, sample_step, 128.0, 3.0);
  vec2 sample5 = getSample(start_sample, sample_step, 128.0, 4.0);
  vec2 sample6 = getSample(start_sample, sample_step, 128.0, 5.0);
  vec2 sample7 = getSample(start_sample, sample_step, 128.0, 6.0);
  vec2 sample8 = getSample(start_sample, sample_step, 128.0, 7.0);
  vec2 sample9 = getSample(start_sample, sample_step, 128.0, 8.0);
  vec2 sample10 = getSample(start_sample, sample_step, 128.0, 9.0);

  vec3 v0 = vec3(texture2D(u_light_texture, sample1));
  vec3 edge1 = vec3(texture2D(u_light_texture, sample2));
  vec3 edge2 = vec3(texture2D(u_light_texture, sample3));

  vec3 n0 = vec3(texture2D(u_light_texture, sample4));
  vec3 n1 = vec3(texture2D(u_light_texture, sample5));
  vec3 n2 = vec3(texture2D(u_light_texture, sample6));

  vec2 uv0 = vec2(texture2D(u_triangle_texture, sample7));
  vec2 uv1 = vec2(texture2D(u_triangle_texture, sample8));
  vec2 uv2 = vec2(texture2D(u_triangle_texture, sample9));

  int material_index = int(texture2D(u_light_texture, sample7).x);
  float triangle_area = texture2D(u_light_texture, sample7).z;

  return Triangle(v0, edge1, edge2, n0, n1, n2, uv0, uv1, uv2, triangle_area, material_index);
}

float TriangleIntersection(Ray ray, Triangle triangle, inout Collision collision, float closest_collision_distance) {
  if (dot(ray.direction, triangle.n0) > 0.0) return -1.0;

  //Begin calculating determinant - also used to calculate u parameter
  vec3 P = cross(ray.direction, triangle.edge2);
  float det = dot(triangle.edge1, P);

  if (det > -EPS && det < EPS) return -1.0;

  //Distance from vertex1 to ray origin
  vec3 T = ray.start_position - triangle.v0;
  float u = dot(T, P);
  if (u < 0.0 || u > det) return -1.0;

  vec3 Q = cross(T, triangle.edge1);

  float v = dot(ray.direction, Q);
  if(v < 0.0 || u+v > det) return -1.0;

  float t = dot(triangle.edge2, Q);

  if(t < EPS) return -1.0;

  float inv_det = 1.0 / det;

  collision.position = ray.start_position + inv_det * t * ray.direction;
  collision.distance = distanceSquared(ray.start_position, collision.position);

  if (closest_collision_distance < collision.distance) return -1.0;

  collision.material_index = triangle.material_index;

  // Interpolate normal
  if (triangle.n0 == triangle.n1) {
    collision.normal = triangle.n0;
  }
  else {
    u = u * inv_det;
    v = v * inv_det;
    collision.normal = (1.0 - u - v) * triangle.n0 + u * triangle.n1 + v * triangle.n2;
  }

  return 1.0;
}

vec3 RandomizePointOnTriangle(Triangle triangle) {
  float u = random(vec3(51.9898, 4567.13, 23.7182), time);
  float v = (1.0 - u) * random(vec3(4.9898, 421.13, 45.7182), 3243.232 * time + 245.642);

  vec3 v0 = triangle.v0;
  vec3 v1 = triangle.edge1 + v0;
  vec3 v2 = triangle.edge2 + v0;
  return (1.0 - u - v) * v0 + u * v1 + v * v2;
}

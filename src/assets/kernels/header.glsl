precision lowp float;

uniform float time;
uniform int trace_depth;
uniform int triangle_count;
uniform int object_count;
uniform vec2 resolution;

// Camera uniforms
uniform lowp vec3 camera_position;
uniform lowp vec3 camera_direction;
uniform lowp vec3 camera_right;
uniform lowp vec3 camera_up;

uniform lowp sampler2D u_buffer_texture;
uniform lowp sampler2D u_triangle_texture;
uniform lowp sampler2D u_triangle_index_texture;
uniform lowp sampler2D u_bvh_texture;
uniform lowp sampler2D u_light_texture;
uniform lowp sampler2D u_material_texture;
uniform lowp sampler2D u_objects_bvh_texture;
uniform lowp sampler2D u_objects_texture;
uniform lowp sampler2D u_light_sphere_texture;

#define EPS 0.0001
#define PI 3.14
#define TEST(i) ( (i) )

float random(vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

float distanceSquared(vec3 a, vec3 b) {
  return length(a - b);
}

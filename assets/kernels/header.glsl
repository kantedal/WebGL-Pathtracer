precision highp float;

uniform float time;
uniform int trace_depth;
uniform float global_lightning_enabled;
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

#define EPS 0.000001
#define PI 3.14
#define TEST(i) ( (i) )

#define SAMPLE_STEP_128 vec2(1,0) / 128.0
#define SAMPLE_STEP_256 vec2(1,0) / 256.0
#define SAMPLE_STEP_512 vec2(1,0) / 512.0
#define SAMPLE_STEP_1024 vec2(1,0) / 1024.0
#define SAMPLE_STEP_2048 vec2(1,0) / 2048.0

float random(vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

//float GPURnd(inout vec4 n)
//{
//	const vec4 q = vec4(   1225.0,    1585.0,    2457.0,    2098.0);
//	const vec4 r = vec4(   1112.0,     367.0,      92.0,     265.0);
//	const vec4 a = vec4(   3423.0,    2646.0,    1707.0,    1999.0);
//	const vec4 m = vec4(4194287.0, 4194277.0, 4194191.0, 4194167.0);
//
//	vec4 beta = floor(n / q);
//	vec4 p = a * (n - beta * q) - beta * r;
//	beta = (sign(-p) + vec4(1.0)) * vec4(0.5) * m;
//	n = (p + beta);
//
//	return fract(dot(n / m, vec4(1.0, -1.0, 1.0, -1.0)));
//}

float distanceSquared(vec3 a, vec3 b) {
  return length(a - b);
}

vec2 getSample(vec2 start_sample, vec2 sample_step, float resolution, float steps) {
  float s = start_sample.x + steps * sample_step.x;
  return vec2(fract(s), floor(s) / resolution);
}

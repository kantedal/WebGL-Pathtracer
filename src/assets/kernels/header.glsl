precision highp float;
uniform float time;
uniform int triangle_count;
uniform int sphere_count;
uniform vec2 resolution;

// Camera uniforms
uniform vec3 camera_position;
uniform vec3 camera_direction;
uniform vec3 camera_right;
uniform vec3 camera_up;

uniform sampler2D u_buffer_texture;
uniform sampler2D u_triangle_texture;
uniform sampler2D u_triangle_index_texture;
uniform sampler2D u_bvh_texture;
uniform sampler2D u_light_texture;
uniform sampler2D u_sphere_texture;
uniform sampler2D u_material_texture;

uniform sampler2D u_light_sphere_texture;

float random(vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

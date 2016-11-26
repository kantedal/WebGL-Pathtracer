struct Object {
  vec3 bounding_bottom;
  vec3 bounding_top;
  vec3 position;
  int object_bvh_start_index;
  int triangle_start_index;
};

void getObjectAtIndex(int index, inout Object object) {
  vec2 sample_step = vec2(1,0) / vec2(512, 512);
  vec2 start_sample = vec2(1,0) / vec2(512, 512) * float(index) * 4.0;

  float row = floor(start_sample.x);
  start_sample.x = start_sample.x - row;
  start_sample.y = row / 512.0;

  vec2 sample1 = start_sample;
  vec2 sample2 = start_sample + sample_step;
  vec2 sample3 = start_sample + 2.0 * sample_step;
  vec2 sample4 = start_sample + 3.0 * sample_step;

  vec3 bottom_bbox = vec3(texture2D(u_objects_texture, sample1));
  vec3 top_bbox = vec3(texture2D(u_objects_texture, sample2));
  vec3 position = vec3(texture2D(u_objects_texture, sample3));
  vec3 extra_data = vec3(texture2D(u_objects_texture, sample4));

  // Triangle model
  int bvh_start_index = int(extra_data.x);
  int triangle_start_index = int(extra_data.y);

  object = Object(bottom_bbox, top_bbox, position, bvh_start_index, triangle_start_index);
}

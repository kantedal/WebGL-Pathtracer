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

  vec2 sample1 = getSample(start_sample, sample_step, 512.0, 0.0);
  vec2 sample2 = getSample(start_sample, sample_step, 512.0, 1.0);
  vec2 sample3 = getSample(start_sample, sample_step, 512.0, 2.0);
  vec2 sample4 = getSample(start_sample, sample_step, 512.0, 3.0);

  vec3 bottom_bbox = vec3(texture2D(u_objects_texture, sample1));
  vec3 top_bbox = vec3(texture2D(u_objects_texture, sample2));
  vec3 position = vec3(texture2D(u_objects_texture, sample3));
  vec3 extra_data = vec3(texture2D(u_objects_texture, sample4));

  // Triangle model
  int bvh_start_index = int(extra_data.x);
  int triangle_start_index = int(extra_data.y);

  object = Object(bottom_bbox, top_bbox, position, bvh_start_index, triangle_start_index);
}

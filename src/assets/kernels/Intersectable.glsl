struct Object {
  vec3 bounding_bottom;
  vec3 bounding_top;
  float smooth_shading;
  int object_bvh_start_index;
  int triangle_start_index;
};

void getObjectAtIndex(int index, inout Object object, inout Sphere sphere, inout int object_type) {
  vec2 sample_step = vec2(1,0) / vec2(512, 512);
  vec2 start_sample = (vec2(1,0) / vec2(512, 512)) * float(index) * 4.0;

  float row = floor(start_sample.x);
  if (start_sample.x >= 1.0) {
    start_sample.x = start_sample.x - row;
    start_sample.y = row / 512.0;
  }

  vec2 sample1 = start_sample;
  vec2 sample2 = start_sample + sample_step;
  vec2 sample3 = start_sample + 2.0 * sample_step;
  vec2 sample4 = start_sample + 3.0 * sample_step;

  vec3 bottom_bbox = vec3(texture2D(u_objects_texture, sample1));
  vec3 top_bbox = vec3(texture2D(u_objects_texture, sample2));
  vec3 extra_data1 = vec3(texture2D(u_objects_texture, sample3));
  vec3 extra_data2 = vec3(texture2D(u_objects_texture, sample4));

  object_type = int(extra_data1.x);

  // Triangle model
  if (object_type == 0) {
    int bvh_start_index = int(extra_data1.y);
    int triangle_start_index = int(extra_data1.z);
    float smooth_shading = extra_data2.x;

    object = Object(bottom_bbox, top_bbox, smooth_shading, bvh_start_index, triangle_start_index);
  }
//  // Sphere model
//  else if (object_type == 1) {
//    int sphere_index = int(extra_data.y);
//    sphere = GetSphere(sphere_index, bottom_bbox, top_bbox);
//  }
}

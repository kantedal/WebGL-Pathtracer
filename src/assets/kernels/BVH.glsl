struct BVHNode {
  vec3 bottom_bbox;
  vec3 top_bbox;
  bool is_leaf;
  int extra_data1;
  int extra_data2;
};

void getNodeData(int index, inout BVHNode node) {
  vec2 sample_step = vec2(1,0) / vec2(2048, 2048);
  vec2 start_sample = (vec2(1,0) / vec2(2048, 2048)) * float(index) * 3.0;

  float row = floor(start_sample.x);
  if (start_sample.x >= 1.0) {
    start_sample.x = start_sample.x - row;
    start_sample.y = row / 2048.0;
  }

  vec2 sample1 = start_sample;
  vec2 sample2 = start_sample + sample_step;
  vec2 sample3 = start_sample + 2.0 * sample_step;

  node.bottom_bbox = vec3(texture2D(u_objects_bvh_texture, sample1));
  node.top_bbox = vec3(texture2D(u_objects_bvh_texture, sample2));

  vec3 extra_data = vec3(texture2D(u_objects_bvh_texture, sample3));
  node.is_leaf = extra_data.x == 0.0 ? true : false;
  node.extra_data1 = int(extra_data.y);
  node.extra_data2 = int(extra_data.z);
}

void traverseObjectTree(Ray ray, inout Collision closest_collision, int start_index, int triangle_start_index) {
  Collision collision;
  int stack[32];
  int stackIdx = 0;
  setStackIndex(stackIdx++, 0, stack);

  for (int i = 0; i < 1000; i++) {
    if (stackIdx < 1) break;
    int box_index = getStackValue(--stackIdx, stack);

    // Fetch node data
    BVHNode node;
    getNodeData(box_index + start_index, node);

    if (node.is_leaf) {

      // Check collision with bounding box
      float collision_distance = 0.0;
      if (BoundingBoxCollision(node.bottom_bbox, node.top_bbox, ray, collision_distance)) {
        // Check distance to bounding box collision
        if (collision_distance < closest_collision.distance) {
          setStackIndex(stackIdx++, node.extra_data1, stack); // Set left child index: extra_data1 = left index
          setStackIndex(stackIdx++, node.extra_data2, stack); // Set right child index: extra_data2 = right index

          // Return if stack index exceeds stack size
          if (stackIdx > 31) return;
        }
      }
    }
    else {
      int triangle_count = node.extra_data1;
      int start_triangle_index = node.extra_data2 + triangle_start_index;

      int current_index = start_triangle_index;
      int end_index = start_triangle_index + triangle_count;

      for (int idx = 0; idx < 10; idx++) {
        Triangle triangle = GetTriangleFromIndex(getTriangleIndex(current_index));

        if (TriangleIntersection(ray, triangle, collision)) {
          if (collision.distance < closest_collision.distance) {
            closest_collision = collision;
          }
        }

        if (++current_index >= end_index)
          break;
      }
    }
  }
}

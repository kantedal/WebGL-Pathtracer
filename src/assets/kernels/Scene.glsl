bool SceneIntersections(Ray ray, inout Collision collision) {
  //Check sphere collision
  int sphere_index = 0;
  for (int i = 0; i < 10000; i++) {
    Sphere sphere = GetSphere(sphere_index);
    if (SphereIntersection(ray, sphere, collision)) {
      return true;
    }
    sphere_index++;

    if (sphere_index >= sphere_count)
      break;
  }

  // Check triangle collision
  int triangle_index = 0;
  for (int i = 0; i < 10000; i++) {
    Triangle triangle = GetTriangleFromIndex(triangle_index);
    if (TriangleIntersection(ray, triangle, collision)) {
      return true;
    }
    triangle_index++;

    if (triangle_index >= triangle_count)
      break;
  }

  return false;
}

int getTriangleIndex(int stackIdx) {
  vec2 sample_step = vec2(1.0,0) / vec2(1024, 1024);
  vec2 start_sample = (vec2(1.0,0) / vec2(1024, 1024)) * float(stackIdx);

  float row = floor(start_sample.x);
  if (start_sample.x >= 1.0) {
    start_sample.x = start_sample.x - row;
    start_sample.y = row / 1024.0;
  }

  vec3 triangle_index_slot = vec3(texture2D(u_triangle_index_texture, start_sample));
  return int(triangle_index_slot.x);
}

void getNodeData(int index, inout vec3 bottom_bbox, inout vec3 top_bbox, inout int is_leaf, inout int extra_data1, inout int extra_data2) {
  vec2 sample_step = vec2(1,0) / vec2(2048, 2048);
  vec2 start_sample = (vec2(1,0) / vec2(2048, 2048)) * float(index) * 3.0;

  vec2 sample1 = start_sample;
  vec2 sample2 = start_sample + sample_step;
  vec2 sample3 = start_sample + 2.0 * sample_step;

  float row = floor(sample1.x);
  if (sample1.x >= 1.0) {
    sample1.x = sample1.x - row;
    sample1.y = row / 2048.0;
  }
  else if (sample2.x >= 1.0) {
    sample2.x = sample2.x - row;
    sample2.y = row / 2048.0;
  }
  else if (sample3.x >= 1.0) {
    sample3.x = sample3.x - row;
    sample3.y = row / 2048.0;
  }

  bottom_bbox = vec3(texture2D(u_bvh_texture, sample1));
  top_bbox = vec3(texture2D(u_bvh_texture, sample2));

  vec3 extra_data = vec3(texture2D(u_bvh_texture, sample3));
  is_leaf = int(extra_data.x);
  extra_data1 = int(extra_data.y);
  extra_data2 = int(extra_data.z);
}

bool SceneIntersection(Ray ray, inout Collision collision) {
  Collision closest_collision;
  closest_collision.distance = 1000.0;

  int sphere_index = 0;
  for (int i = 0; i < 100; i++) {
    Sphere sphere = GetSphere(sphere_index);
    if (SphereIntersection(ray, sphere, collision)) {
      if (collision.distance < closest_collision.distance)
        closest_collision = collision;
    }
    sphere_index++;

    if (sphere_index >= sphere_count)
      break;
  }

  LeafNode leafNodes[32];
  int leafCount = 0;

  int stack[32];
  int stackIdx = 0;
  setStackIndex(stackIdx, 0, stack);
  stackIdx++;

  vec3 bottom_bbox;
  vec3 top_bbox;
  int is_leaf;
  int extra_data1;
  int extra_data2;

  for (int i = 0; i < 1000; i++) {
    if (stackIdx < 0) break;
    int box_index = getStackValue(--stackIdx, stack);

    // Fetch node data
    getNodeData(box_index, bottom_bbox, top_bbox, is_leaf, extra_data1, extra_data2);

    if (is_leaf == 0) {
      // Check collision with bounding box
      if (BoundingBoxIntersection(bottom_bbox, top_bbox, ray)) {
        int right_index = extra_data2 / 9;
        int left_index = extra_data1 / 9;

        setStackIndex(stackIdx++, right_index, stack); // Set right child index
        setStackIndex(stackIdx++, left_index, stack); // Set left child index

        if (stackIdx > 10) {
          return false;
        }
      }
    }
    else {
      float distance = 0.0;
      int triangle_count = extra_data1;
      int start_triangle_index = extra_data2;
      //setLeafNode(leafCount++, LeafNode(distance, start_triangle_index, triangle_count), leafNodes);

      int index = start_triangle_index;
      int end_index = start_triangle_index + triangle_count;

      for (int idx = 0; idx < 1000; idx++) {
        Triangle triangle = GetTriangleFromIndex(getTriangleIndex(index));

        if (TriangleIntersection(ray, triangle, collision)) {
          if (collision.distance < closest_collision.distance) {
            closest_collision = collision;
          }
        }

        index++;
        if (index >= end_index)
          break;
      }
    }
  }

  for (int leaf_idx = 0; leaf_idx < 1000; leaf_idx++) {


   if (leaf_idx >= leafCount)
     break;
  }

  if (closest_collision.distance == 1000.0) {
    return false;
  }
  else {
    collision = closest_collision;
    return true;
  }
}


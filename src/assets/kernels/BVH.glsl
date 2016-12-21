struct BVHNode {
  vec3 bottom_bbox;
  vec3 top_bbox;
  float is_leaf;
  float distance;
  float extra_data1;
  float extra_data2;
  float node_index;
  float parent_index;
  float sibling_index;
};

void getNodeData(float index, float start_index, Ray ray, inout BVHNode node) {
  vec2 start_sample = SAMPLE_STEP_2048 * (index + start_index) * 4.0;

  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 0.0);
  vec2 sample2 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 1.0);
  vec2 sample3 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 2.0);
  vec2 sample4 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 3.0);

  node.bottom_bbox = vec3(texture2D(u_objects_bvh_texture, sample1));
  node.top_bbox = vec3(texture2D(u_objects_bvh_texture, sample2));

  vec3 extra_data1 = vec3(texture2D(u_objects_bvh_texture, sample3));
  node.is_leaf = extra_data1.x;
  node.extra_data1 = extra_data1.y;
  node.extra_data2 = extra_data1.z;

  vec3 extra_data2 = vec3(texture2D(u_objects_bvh_texture, sample4));
  node.parent_index = extra_data2.x;
  node.sibling_index = extra_data2.y;

//  node.distance = BoundingBoxCollision(node.bottom_bbox, node.top_bbox, ray, node.is_leaf);

  node.node_index = index;
}

void processLeaf(BVHNode node, inout Collision closest_collision, Ray ray, float triangle_start_index, Object object) {
  float triangle_count = node.extra_data1;
  float start_triangle_index = node.extra_data2 + triangle_start_index;

  float current_index = start_triangle_index;
  float end_index = start_triangle_index + triangle_count;

  Collision collision;
  for (int idx = 0; idx < 1000; idx++) {
    Triangle triangle = GetTriangleFromIndex(getTriangleIndex(current_index));

    if (TriangleIntersection(ray, triangle, object.position, collision, closest_collision.distance) == 1.0) {
      closest_collision = collision;
    }

    if (++current_index >= end_index) break;
  }
}

void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
  float start_index = object.object_bvh_start_index;
  float triangle_start_index = object.triangle_start_index;

  Collision collision;
  BVHNode node;
  BVHNode left_node;
  BVHNode right_node;

  float stack[32];
  float stackIdx = 0.0;
  stack[0] = 0.0;
  stackIdx++;

  for (int i = 0; i < 100; i++) {
    if (stackIdx < 1.0) break;
    float box_index = getStackValue(--stackIdx, stack);

    // Fetch node data
    getNodeData(box_index, start_index, ray, node);

    if (node.is_leaf == 0.0) {
      // Check collision with bounding box
      float collision_distance = 0.0;

      getNodeData(node.extra_data1, start_index, ray, left_node);
      getNodeData(node.extra_data2, start_index, ray, right_node);

      left_node.distance = BoundingBoxCollision(left_node.bottom_bbox + object.position, left_node.top_bbox + object.position, ray, left_node.is_leaf);
      right_node.distance = BoundingBoxCollision(right_node.bottom_bbox + object.position, right_node.top_bbox + object.position, ray, right_node.is_leaf);

      float near_distance = min(left_node.distance, right_node.distance);
      float far_distance = max(left_node.distance, right_node.distance);

      float mixer = clamp(step(right_node.distance, left_node.distance), 0.0, 1.0);
      float near_child = mix(node.extra_data1, node.extra_data2, mixer);
      float far_child = mix(node.extra_data2, node.extra_data1, mixer);

      if (far_distance < closest_collision.distance) {
        setStackIndex(stackIdx++, far_child, stack); // Set left child index: extra_data1 = left index
        setStackIndex(stackIdx++, near_child , stack); // Set left child index: extra_data1 = left index
      }
      else if (near_distance < closest_collision.distance) {
        setStackIndex(stackIdx++, near_child , stack); // Set left child index: extra_data1 = left index
      }

      // Return if stack index exceeds stack size
      if (stackIdx > 31.0) return;
    }
    else {
      processLeaf(node, closest_collision, ray, triangle_start_index, object);
    }
  }
}

//int nearChild(int current, inout BVHNode current_node, inout BVHNode sibling_node, int start_index, Ray ray) {
//  vec2 start_sample = SAMPLE_STEP_2048 * float(current + start_index) * 4.0;
//  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 2.0);
//
//  vec3 extra_data1 = vec3(texture2D(u_objects_bvh_texture, sample1));
//  int left_child_index = int(extra_data1.y);
//  int right_child_index = int(extra_data1.z);
//
//  getNodeData(left_child_index, start_index, ray, current_node);
//  getNodeData(right_child_index, start_index, ray, sibling_node);
//
//  current_node.distance = BoundingBoxCollision(current_node.bottom_bbox, current_node.top_bbox, ray, current_node.is_leaf);
//  sibling_node.distance = BoundingBoxCollision(sibling_node.bottom_bbox, sibling_node.top_bbox, ray, sibling_node.is_leaf);
//
//  if (current_node.distance < sibling_node.distance) {
//    return left_child_index;
//  }
//  else {
//    BVHNode temp = current_node;
//    current_node = sibling_node;
//    sibling_node = temp;
//    return right_child_index;
//  }
//}
//
//int nearChil(int current, int start_index) {
//  vec2 start_sample = SAMPLE_STEP_2048 * float(current + start_index) * 4.0;
//  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 2.0);
//
//  return int(vec3(texture2D(u_objects_bvh_texture, sample1)).y);
//}
//
//int farChild(int current, int start_index) {
//  vec2 start_sample = SAMPLE_STEP_2048 * float(current + start_index) * 4.0;
//  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 2.0);
//
//  return int(vec3(texture2D(u_objects_bvh_texture, sample1)).z);
//}
//
//int sibling(int current, int start_index) {
//  vec2 start_sample = SAMPLE_STEP_2048 * float(current + start_index) * 4.0;
//  vec2 sample4 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 3.0);
//
//  return int(texture2D(u_objects_bvh_texture, sample4).y);
//}
//
//int parent(int current, int start_index) {
//  vec2 start_sample = SAMPLE_STEP_2048 * float(current + start_index) * 4.0;
//  vec2 sample4 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 3.0);
//
//  int parent_index = int(texture2D(u_objects_bvh_texture, sample4).x);
//
//  return parent_index;
//}
//
//void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
//  int start_index = object.object_bvh_start_index;
//  int triangle_start_index = object.triangle_start_index;

//  BVHNode node;
//  BVHNode near_node;
//  BVHNode far_node;
//
//  int root = 0;
//  int current = nearChil(root, start_index);
//  int last = 0;
//
//  for (int i = 0; i < 200; i++) {
//    nearChild(current, near_node, far_node, start_index, ray);
//    int near = near_node.node_index;
//    int far = far_node.node_index;
//    int parent_index = parent(current, start_index);
//
//    //if (last == far && current == root) return;
//
//    // Already returned from far child - traverse up
//    if (last == far) {
//      last = current;
//      current = parent_index;
//
//      //if (current == root) return;
//      continue;
//    }
//
//    // If coming from parent, try near child else far child
//    int tryChild = near; //(last == parent(current, start_index) ? near : far);
//    node = near_node;
//    if (last != parent_index) {
//      tryChild = far;
//      node = far_node;
//    }
//
//    // HIT
//    if (node.distance < closest_collision.distance) {
//      if (node.is_leaf == 1.0) processLeaf(node, closest_collision, ray, triangle_start_index);
//
//      last = current;
//      current = tryChild;
//    }
//    // MISS
//    else {
//      if (tryChild == near) {
//        last = near;
//        //current = far;
//      }
//      else {
//        last = current;
//        current = parent_index;
//      }
//    }
//
//    if (tryChild == far && current == root) return;
//    //if (current == root) return;
//  }
//}



//void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
//  int start_index = object.object_bvh_start_index;
//  int triangle_start_index = object.triangle_start_index;
//
//  Collision collision;
//  BVHNode node;
//  BVHNode left_node;
//  BVHNode right_node;
//
//  int stack[32];
//  int stackIdx = 0;
//  stack[0] = 0;
//  stackIdx++;
//
//  for (int i = 0; i < 1000; i++) {
//    if (stackIdx < 1) break;
//    int box_index = getStackValue(--stackIdx, stack);
//
//    // Fetch node data
//    getNodeData(box_index, start_index, ray, node);
//
//    if (node.is_leaf == 0.0) {
//      // Check collision with bounding box
//      float collision_distance = 0.0;
//
//      getNodeData(node.extra_data1, start_index, ray, left_node);
//      getNodeData(node.extra_data2, start_index, ray, right_node);
//
//      left_node.distance = BoundingBoxCollision(left_node.bottom_bbox, left_node.top_bbox, ray, left_node.is_leaf);
//      right_node.distance = BoundingBoxCollision(right_node.bottom_bbox, right_node.top_bbox, ray, right_node.is_leaf);
//
//      float near_distance = min(left_node.distance, right_node.distance);
//      float far_distance = max(left_node.distance, right_node.distance);
//
//      float mixer = clamp(step(right_node.distance, left_node.distance), 0.0, 1.0);
//      int near_child = int(mix(float(node.extra_data1), float(node.extra_data2), mixer));
//      int far_child = int(mix(float(node.extra_data2), float(node.extra_data1), mixer));
//
//      if (far_distance < closest_collision.distance) {
//        setStackIndex(stackIdx++, far_child, stack); // Set left child index: extra_data1 = left index
//        setStackIndex(stackIdx++, near_child , stack); // Set left child index: extra_data1 = left index
//      }
//      else if (near_distance < closest_collision.distance) {
//        setStackIndex(stackIdx++, near_child , stack); // Set left child index: extra_data1 = left index
//      }
//
//      // Return if stack index exceeds stack size
//      if (stackIdx > 31) return;
//    }
//    else {
//      processLeaf(node, closest_collision, ray, triangle_start_index);
//    }
//  }
//}

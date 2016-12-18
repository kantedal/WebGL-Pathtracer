struct BVHNode {
  vec3 bottom_bbox;
  vec3 top_bbox;
  float is_leaf;
  float distance;
  int extra_data1;
  int extra_data2;
  int node_index;
  int parent_index;
  int sibling_index;
};

void getNodeData(int index, int start_index, Ray ray, inout BVHNode node) {
  vec2 start_sample = SAMPLE_STEP_2048 * float(index + start_index) * 4.0;

  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 0.0);
  vec2 sample2 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 1.0);
  vec2 sample3 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 2.0);
  vec2 sample4 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 3.0);

  node.bottom_bbox = vec3(texture2D(u_objects_bvh_texture, sample1));
  node.top_bbox = vec3(texture2D(u_objects_bvh_texture, sample2));

  vec3 extra_data1 = vec3(texture2D(u_objects_bvh_texture, sample3));
  node.is_leaf = extra_data1.x;
  node.extra_data1 = int(extra_data1.y);
  node.extra_data2 = int(extra_data1.z);

  vec3 extra_data2 = vec3(texture2D(u_objects_bvh_texture, sample4));
  node.parent_index = int(extra_data2.x);
  node.sibling_index = int(extra_data2.y);

//  node.distance = BoundingBoxCollision(node.bottom_bbox, node.top_bbox, ray, node.is_leaf);

  node.node_index = index;
}

void processLeaf(BVHNode node, inout Collision closest_collision, Ray ray, int triangle_start_index) {
  int triangle_count = node.extra_data1;
  int start_triangle_index = node.extra_data2 + triangle_start_index;

  int current_index = start_triangle_index;
  int end_index = start_triangle_index + triangle_count;

  Collision collision;
  for (int idx = 0; idx < 1000; idx++) {
    Triangle triangle = GetTriangleFromIndex(getTriangleIndex(current_index));

    if (TriangleIntersection(ray, triangle, collision, closest_collision.distance) == 1.0) {
      closest_collision = collision;
    }

    if (++current_index >= end_index) break;
  }
}

//BVHNode nearChild(BVHNode current, int start_index, Ray ray) {
//  BVHNode left_node;
//  BVHNode right_node;
//
//  int left_child_index = current.extra_data1;
//  int right_child_index = current.extra_data2;
//
//  getNodeData(left_child_index, start_index, ray, left_node);
//  getNodeData(right_child_index, start_index, ray, right_node);
//
//  float left_collision_distance = BoundingBoxCollision(left_node.bottom_bbox, left_node.top_bbox, ray, left_node.is_leaf);
//  float right_collision_distance = BoundingBoxCollision(right_node.bottom_bbox, right_node.top_bbox, ray, right_node.is_leaf);
//
//  if (left_collision_distance < right_collision_distance) {
//    left_node.distance = left_collision_distance;
//    return left_node;
//  }
//  else {
//    right_node.distance = right_collision_distance;
//    return right_node;
//  }
//}
//
//void children(inout BVHNode near, inout BVHNode far, int start_index, Ray ray) {
//  BVHNode left_node;
//  BVHNode right_node;
//
//  int left_child_index = near.extra_data1;
//  int right_child_index = near.extra_data2;
//
//  getNodeData(left_child_index, start_index, ray, left_node);
//  getNodeData(right_child_index, start_index, ray, right_node);
//
//  if (left_node.distance < right_node.distance) {
//    near = left_node;
//    far = right_node;
//  }
//  else {
//    far = left_node;
//    near = right_node;
//  }
//}
//
//void parent(inout BVHNode current, inout BVHNode sibl, inout BVHNode parent_node, Ray ray, int start_index) {
//  current = parent_node;
//  getNodeData(current.parent_index, start_index, ray, parent_node);
//  getNodeData(current.sibling_index, start_index, ray, sibl);
//}

//void sibling(inout BVHNode current, int start_index) {
//  getNodeData(current.sibling_index, start_index, current);
//}

#define fromParent 0
#define fromChild 1
#define fromSibling 2
#define fromNearChild 3
#define fromFarChild 4


//void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
//  int start_index = object.object_bvh_start_index;
//  int triangle_start_index = object.triangle_start_index;
//
//  BVHNode current;
//  BVHNode sibl;
//  BVHNode parent_node;
//  BVHNode root;
//
//  getNodeData(0, start_index, ray, root);
//  getNodeData(0, start_index, ray, current);
//
//  parent_node = current;
//  children(current, sibl, start_index, ray);
//
//  int state = fromParent;
//  for (int i = 0; i < 200; i++) {
//    if (state == fromChild) {
//      if (current.node_index == root.node_index) return; // Finished
//
//      if (current.distance < sibl.distance) {
//        current = sibl;
//        state = fromSibling;
//      }
//      else {
//        parent(current, sibl, parent_node, ray, start_index);
//        state = fromChild;
//      }
//    }
//    else if (state == fromSibling) {
//      float collision_distance = current.distance;
//
//      // MISSED
//      if (collision_distance > 1000.0 || collision_distance > closest_collision.distance) {
//        parent(current, sibl, parent_node, ray, start_index);
//        state = fromChild;
//      }
//      else if (current.is_leaf == 1.0) {
//        processLeaf(current, closest_collision, ray, triangle_start_index);
//
//        parent(current, sibl, parent_node, ray, start_index);
//
//        state = fromChild;
//      }
//      else {
//        parent_node = current;
//        children(current, sibl, start_index, ray);
//
//        state = fromParent;
//      }
//
//    }
//    else if (state == fromParent) {
//      float collision_distance = current.distance;
//
//      // MISSED
//      if (collision_distance > 1000.0 || collision_distance > closest_collision.distance) {
//        current = sibl;
//        state = fromSibling;
//      }
//      else if (current.is_leaf == 1.0) {
//        processLeaf(current, closest_collision, ray, triangle_start_index);
//
//        current = sibl;
//        state = fromSibling;
//      }
//      else {
//        parent_node = current;
//        children(current, sibl, start_index, ray);
//
//        state = fromParent;
//      }
//    }
//  }
//}

void children(inout BVHNode near, inout BVHNode far, int start_index, Ray ray) {
  BVHNode left_node;
  BVHNode right_node;

  int left_child_index = near.extra_data1;
  int right_child_index = near.extra_data2;

  getNodeData(left_child_index, start_index, ray, left_node);
  getNodeData(right_child_index, start_index, ray, right_node);

  if (left_node.distance < right_node.distance) {
    near = left_node;
    far = right_node;
  }
  else {
    far = left_node;
    near = right_node;
  }
}

int nearChild(int current, inout BVHNode current_node, inout BVHNode sibling_node, int start_index, Ray ray) {
  vec2 start_sample = SAMPLE_STEP_2048 * float(current + start_index) * 4.0;
  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 2.0);

  vec3 extra_data1 = vec3(texture2D(u_objects_bvh_texture, sample1));
  int left_child_index = int(extra_data1.y);
  int right_child_index = int(extra_data1.z);

  getNodeData(left_child_index, start_index, ray, current_node);
  getNodeData(right_child_index, start_index, ray, sibling_node);

  current_node.distance = BoundingBoxCollision(current_node.bottom_bbox, current_node.top_bbox, ray, current_node.is_leaf);
  sibling_node.distance = BoundingBoxCollision(sibling_node.bottom_bbox, sibling_node.top_bbox, ray, sibling_node.is_leaf);

  if (current_node.distance < sibling_node.distance) {
    return left_child_index;
  }
  else {
    BVHNode temp = current_node;
    current_node = sibling_node;
    sibling_node = temp;
    return right_child_index;
  }
}

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

//float boundingBoxDistance(int current, int start_index, Ray ray) {
//   vec2 start_sample = SAMPLE_STEP_2048 * float(current + start_index) * 4.0;
//   vec2 sample1 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 0.0);
//   vec2 sample2 = getSample(start_sample, SAMPLE_STEP_2048, 2048.0, 1.0);
//
//   node.bottom_bbox = vec3(texture2D(u_objects_bvh_texture, sample1));
//   node.top_bbox = vec3(texture2D(u_objects_bvh_texture, sample2));
//}

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
//
//  BVHNode current_node;
//  BVHNode sibling_node;
//
//  getNodeData(0, start_index, ray, current_node);
//
//  int root = 0;
//
//  int parent_idx = 0;
//  BVHNode parent_sibling;
//  bool coming_from_near = false;
//
//  int current = nearChild(0, current_node, sibling_node, start_index, ray);
//  int state = fromParent;
//
//  for (int i = 0; i < 1000; i++) {
//    if (state == fromChild) {
//      //current = parent_idx; //parent_sibling.node_index;
//
//      if (current == root) return; // Finished
//
//      int parent_index = parent(current, start_index);
//      int near_parent_child = nearChild(parent_index, current_node, sibling_node, start_index, ray);
//
//      if (current == near_parent_child) {
//        current = sibling_node.node_index;
//        current_node = sibling_node;
//        state = fromSibling;
//      }
//      else {
//        current = parent_index;
//        state = fromChild;
//      }
//    }
//    else if (state == fromSibling) {
//      // HIT
//      if (current_node.distance < closest_collision.distance && current_node.is_leaf == 1.0) {
//        processLeaf(current_node, closest_collision, ray, triangle_start_index);
//        current = current_node.parent_index, start_index;
//        state = fromChild;
//      }
//      // MISSED
//      else if (current_node.distance > closest_collision.distance) {
//        current = current_node.parent_index, start_index;
//        state = fromChild;
//      }
//      else {
//        parent_idx = current;
//        current = nearChild(current, current_node, sibling_node, start_index, ray);
//        state = fromParent;
//      }
//
//    }
//    else if (state == fromParent) {
//      // HIT
//      if (current_node.distance < closest_collision.distance && current_node.is_leaf == 1.0) {
//        processLeaf(current_node, closest_collision, ray, triangle_start_index);
//        current = current_node.sibling_index;
//        current_node = sibling_node;
//        state = fromSibling;
//      }
//      // MISSED
//      else if (current_node.distance > closest_collision.distance) {
//        current = current_node.sibling_index;
//        current_node = sibling_node;
//        state = fromSibling;
//      }
//      else {
//        parent_idx = current;
//        current = nearChild(current, current_node, sibling_node, start_index, ray);
//        state = fromParent;
//      }
//    }
//  }
//}

//void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
//  int start_index = object.object_bvh_start_index;
//  int triangle_start_index = object.triangle_start_index;
//
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

void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
  int start_index = object.object_bvh_start_index;
  int triangle_start_index = object.triangle_start_index;

  Collision collision;
  BVHNode node;
  BVHNode left_node;
  BVHNode right_node;

  int stack[32];
  int stackIdx = 0;
  stack[0] = 0;
  stackIdx++;

  for (int i = 0; i < 100; i++) {
    if (stackIdx < 1) break;
    int box_index = getStackValue(--stackIdx, stack);

    // Fetch node data
    getNodeData(box_index, start_index, ray, node);

    if (node.is_leaf == 0.0) {
      // Check collision with bounding box
      float collision_distance = 0.0;

      getNodeData(node.extra_data1, start_index, ray, left_node);
      getNodeData(node.extra_data2, start_index, ray, right_node);

      left_node.distance = BoundingBoxCollision(left_node.bottom_bbox, left_node.top_bbox, ray, left_node.is_leaf);
      right_node.distance = BoundingBoxCollision(right_node.bottom_bbox, right_node.top_bbox, ray, right_node.is_leaf);

      float near_distance = min(left_node.distance, right_node.distance);
      float far_distance = max(left_node.distance, right_node.distance);

      float mixer = clamp(step(right_node.distance, left_node.distance), 0.0, 1.0);
      int near_child = int(mix(float(node.extra_data1), float(node.extra_data2), mixer));
      int far_child = int(mix(float(node.extra_data2), float(node.extra_data1), mixer));

      if (far_distance < closest_collision.distance) {
        setStackIndex(stackIdx++, far_child, stack); // Set left child index: extra_data1 = left index
        setStackIndex(stackIdx++, near_child , stack); // Set left child index: extra_data1 = left index
      }
      else if (near_distance < closest_collision.distance) {
        setStackIndex(stackIdx++, near_child , stack); // Set left child index: extra_data1 = left index
      }

      // Return if stack index exceeds stack size
      if (stackIdx > 31) return;
    }
    else {
      processLeaf(node, closest_collision, ray, triangle_start_index);
    }
  }
}

struct BVHNode {
  vec3 bottom_bbox;
  vec3 top_bbox;
  float is_leaf;
  int extra_data1;
  int extra_data2;
  int node_index;
  int parent_index;
  int sibling_index;
};

void getNodeData(int index, int start_index, inout BVHNode node) {
  vec2 sample_step = vec2(1,0) / vec2(2048, 2048);
  vec2 start_sample = (vec2(1,0) / vec2(2048, 2048)) * float(index) * 4.0;

  vec2 sample1 = vec2(start_sample.x - floor(start_sample.x), floor(start_sample.x) / 2048.0);
  vec2 sample2 = vec2((start_sample.x + 1.0*sample_step.x) - floor((start_sample.x + 1.0*sample_step.x)), floor((start_sample.x + 1.0*sample_step.x)) / 2048.0);
  vec2 sample3 = vec2((start_sample.x + 2.0*sample_step.x) - floor((start_sample.x + 2.0*sample_step.x)), floor((start_sample.x + 2.0*sample_step.x)) / 2048.0);
  vec2 sample4 = vec2((start_sample.x + 3.0*sample_step.x) - floor((start_sample.x + 3.0*sample_step.x)), floor((start_sample.x + 3.0*sample_step.x)) / 2048.0);

  node.bottom_bbox = vec3(texture2D(u_objects_bvh_texture, sample1));
  node.top_bbox = vec3(texture2D(u_objects_bvh_texture, sample2));

  vec3 extra_data1 = vec3(texture2D(u_objects_bvh_texture, sample3));
  node.is_leaf = extra_data1.x;
  node.extra_data1 = int(extra_data1.y);
  node.extra_data2 = int(extra_data1.z);

  vec3 extra_data2 = vec3(texture2D(u_objects_bvh_texture, sample4));
  node.parent_index = int(extra_data2.x);
  node.sibling_index = int(extra_data2.y);

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

    if (TriangleIntersection(ray, triangle, collision, closest_collision.distance) == 1.0) closest_collision = collision;

    if (++current_index >= end_index) break;
  }
}

int nearChild(int current, int start_index) {
  BVHNode node;
  getNodeData(current + start_index, node);
  return node.extra_data1;
}

int farChild(int current, int start_index) {
  BVHNode node;
  getNodeData(current + start_index, node);
  return node.extra_data2;
}

int parent(int current, int start_index) {
  BVHNode node;
  getNodeData(current + start_index, node);
  return node.parent_index;
}

int sibling(int current, int start_index) {
  BVHNode node;
  getNodeData(current + start_index, node);
  return node.sibling_index;
}

#define fromParent 0
#define fromChild 1
#define fromSibling 2

//void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
//  int start_index = object.object_bvh_start_index;
//  int triangle_start_index = object.triangle_start_index;
//
//  int root = 0;
//  int current = nearChild(0, start_index);
//  int state = fromParent;
//
//  for (int i = 0; i < 200; i++) {
//    int near = nearChild(current);
//    int far = farChild(current);
//
//  }
//}

void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
  int start_index = object.object_bvh_start_index;
  int triangle_start_index = object.triangle_start_index;

  BVHNode node;
  int root = 0;
  int current = nearChild(0, start_index);
  int state = fromParent;

  for (int i = 0; i < 200; i++) {
    if (state == fromChild) {
      if (current == root) return; // Finished

      int p = parent(current, start_index);
      if (current == nearChild(p, start_index)) {
        current = sibling(current, start_index); state = fromSibling;
      }
      else {
        current = parent(current, start_index); state = fromChild;
      }

    }
    else if (state == fromSibling) {
      getNodeData(current + start_index, node);

      float collision_distance = BoundingBoxCollision(node.bottom_bbox, node.top_bbox, ray);

      // MISSED
      if (collision_distance > 1000.0 || collision_distance > closest_collision.distance) {
        current = parent(current, start_index); state = fromChild;
      }
      else if (node.is_leaf != 0.0) {
        processLeaf(node, closest_collision, ray, triangle_start_index);
        current = parent(current, start_index); state = fromChild;
      }
      else {
        current = nearChild(current, start_index); state = fromParent;
      }

    }
    else if (state == fromParent) {
      getNodeData(current + start_index, node);

      float collision_distance = BoundingBoxCollision(node.bottom_bbox, node.top_bbox, ray);

      // MISSED
      if (collision_distance > 1000.0 || collision_distance > closest_collision.distance) {
        current = sibling(current, start_index); state = fromSibling;
      }
      else if (node.is_leaf != 0.0) {
        processLeaf(node, closest_collision, ray, triangle_start_index);
        current = sibling(current, start_index); state = fromSibling;
      }
      else {
        current = nearChild(current, start_index); state = fromParent;
      }
    }
  }
}


//void traverseObjectTree(Ray ray, inout Collision closest_collision, Object object) {
//  int start_index = object.object_bvh_start_index;
//  int triangle_start_index = object.triangle_start_index;
//
//  Collision collision;
//  int stack[32];
//  int stackIdx = 0;
//  setStackIndex(stackIdx++, 0, stack);
//
//  for (int i = 0; i < 1000; i++) {
//    if (stackIdx < 1) break;
//    int box_index = getStackValue(--stackIdx, stack);
//
//    // Fetch node data
//    BVHNode node;
//    getNodeData(box_index + start_index, node);
//
//    if (node.is_leaf == 0.0) {
//      // Check collision with bounding box
//      float collision_distance = 0.0;
//
//      BVHNode left_node;
//      BVHNode right_node;
//      getNodeData(node.extra_data1 + start_index, left_node);
//      getNodeData(node.extra_data2 + start_index, right_node);
//
//      float left_collision_distance = BoundingBoxCollision(left_node.bottom_bbox, left_node.top_bbox, ray);
//      float right_collision_distance = BoundingBoxCollision(right_node.bottom_bbox, right_node.top_bbox, ray);
//
//      float near_distance = min(left_collision_distance, right_collision_distance);
//      float far_distance = max(left_collision_distance, right_collision_distance);
//
//      float mixer = clamp(step(right_collision_distance, left_collision_distance), 0.0, 1.0);
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

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

void setStackIndex(int index, int value, inout int stack[32]) {
  if (index == 0) stack[0] = value;
  if (index == 1) stack[1] = value;
  if (index == 2) stack[2] = value;
  if (index == 3) stack[3] = value;
  if (index == 4) stack[4] = value;
  if (index == 5) stack[5] = value;
  if (index == 6) stack[6] = value;
  if (index == 7) stack[7] = value;
  if (index == 8) stack[8] = value;
  if (index == 9) stack[9] = value;
  if (index == 10) stack[10] = value;
  if (index == 11) stack[11] = value;
  if (index == 12) stack[12] = value;
  if (index == 13) stack[13] = value;
  if (index == 14) stack[14] = value;
  if (index == 15) stack[15] = value;
  if (index == 16) stack[16] = value;
  if (index == 17) stack[17] = value;
  if (index == 18) stack[18] = value;
  if (index == 19) stack[19] = value;
  if (index == 20) stack[20] = value;
  if (index == 21) stack[21] = value;
  if (index == 22) stack[22] = value;
  if (index == 23) stack[23] = value;
  if (index == 24) stack[24] = value;
  if (index == 25) stack[25] = value;
  if (index == 26) stack[26] = value;
  if (index == 27) stack[27] = value;
  if (index == 28) stack[28] = value;
  if (index == 29) stack[29] = value;
  if (index == 30) stack[30] = value;
  if (index == 31) stack[31] = value;
}

int getStackValue(int index, int stack[32]) {
  if (index == 0) return stack[0];
  if (index == 1) return stack[1];
  if (index == 2) return stack[2];
  if (index == 3) return stack[3];
  if (index == 4) return stack[4];
  if (index == 5) return stack[5];
  if (index == 6) return stack[6];
  if (index == 7) return stack[7];
  if (index == 8) return stack[8];
  if (index == 9) return stack[9];
  if (index == 10) return stack[10];
  if (index == 11) return stack[11];
  if (index == 12) return stack[12];
  if (index == 13) return stack[13];
  if (index == 14) return stack[14];
  if (index == 15) return stack[15];
  if (index == 16) return stack[16];
  if (index == 17) return stack[17];
  if (index == 18) return stack[18];
  if (index == 19) return stack[19];
  if (index == 20) return stack[20];
  if (index == 21) return stack[21];
  if (index == 22) return stack[22];
  if (index == 23) return stack[23];
  if (index == 24) return stack[24];
  if (index == 25) return stack[25];
  if (index == 26) return stack[26];
  if (index == 27) return stack[27];
  if (index == 28) return stack[28];
  if (index == 29) return stack[29];
  if (index == 30) return stack[30];
  if (index == 31) return stack[31];

  return -1;
}

//void getBoundingBoxes(int stackIdx, inout vec3 bottom_bbox, inout vec3 top_bbox) {
//  vec2 sample_step = vec2(1.0,0) / vec2(2048, 2048);
//  vec2 start_sample = (vec2(1.0,0) / vec2(2048, 2048)) * float(stackIdx) * 3.0;;
//
//  float row = floor(start_sample.x);
//  if (start_sample.x >= 1.0) {
//    start_sample.x = start_sample.x - row;
//    start_sample.y = row / 2048.0;
//  }
//
//  bottom_bbox = vec3(texture2D(u_bvh_texture, start_sample));
//  top_bbox = vec3(texture2D(u_bvh_texture, start_sample + sample_step));
//}

void getNodeChildIndices(int stackIdx, inout int left_index, inout int right_index) {
  vec2 sample_step = vec2(1.0,0) / vec2(2048, 2048);
  vec2 start_sample = (vec2(1.0,0) / vec2(2048, 2048)) * float(stackIdx) * 3.0;

  float row = floor(start_sample.x);
  if (start_sample.x >= 1.0) {
    start_sample.x = start_sample.x - row;
    start_sample.y = row / 2048.0;
  }

  vec4 indices = texture2D(u_bvh_texture, start_sample + sample_step * 2.0);
  left_index = int(indices.y);
  right_index = int(indices.z);
}
//
void getLeafData(int stackIdx, inout int triangle_count, inout int start_triangle_index, inout int is_leaf) {
  vec2 sample_step = vec2(1.0,0) / vec2(2048, 2048);
  vec2 start_sample = (vec2(1.0,0) / vec2(2048, 2048)) * float(stackIdx) * 3.0;

  float row = floor(start_sample.x);
  if (start_sample.x >= 1.0) {
    start_sample.x = start_sample.x - row;
    start_sample.y = row / 2048.0;
  }

  vec4 indices = texture2D(u_bvh_texture, start_sample + sample_step * 2.0);
  is_leaf = int(indices.x);
  triangle_count = int(indices.y);
  start_triangle_index = int(indices.z);
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

  float row = floor(start_sample.x);
  if (start_sample.x >= 1.0) {
    start_sample.x = start_sample.x - row;
    start_sample.y = row / 2048.0;
  }

  bottom_bbox = vec3(texture2D(u_bvh_texture, start_sample));
  top_bbox = vec3(texture2D(u_bvh_texture, start_sample + sample_step));

  vec3 extra_data = vec3(texture2D(u_bvh_texture, start_sample + sample_step * 2.0));
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

  int stack[32];
  int stackIdx = 0;
  setStackIndex(stackIdx, 0, stack);
  stackIdx++;


  for (int i = 0; i < 1000; i++) {
    if (stackIdx <= 0) break;

    int box_index = getStackValue(stackIdx - 1, stack);

    stackIdx--;

    // Fetch node data
    vec3 bottom_bbox;
    vec3 top_bbox;
    int is_leaf;
    int extra_data1;
    int extra_data2;

    getNodeData(box_index - 1, bottom_bbox, top_bbox, is_leaf, extra_data1, extra_data2);

    //if (box_index == 9) return true;

    if (is_leaf == 0) {
      // Check collision with bounding box
      if (BoundingBoxCollision(bottom_bbox, top_bbox, ray)) {
        int right_index = extra_data2;
        int left_index = extra_data1;

        setStackIndex(stackIdx++, right_index, stack); // Set left child index
        setStackIndex(stackIdx++, left_index, stack); // Set right child index

        if (stackIdx > 32) {
          return false;
        }
      }
    }
    else {
      int triangle_count = extra_data1;
      int start_triangle_index = extra_data2;

      int index = start_triangle_index;
      int end_index = start_triangle_index + triangle_count;
      for (int idx = 0; idx < 30; idx++) {
        int triangle_index = getTriangleIndex(index);

        Triangle triangle = GetTriangleFromIndex(triangle_index);

        if (TriangleIntersection(ray, triangle, collision)) {
          if (collision.distance < closest_collision.distance)
            closest_collision = collision;
        }

        index++;
        if (index == end_index)
          break;
      }
    }
  }
  collision = closest_collision;
  return true;
}


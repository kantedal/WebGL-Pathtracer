void setBBoxCollisionIndex(int index, BBoxCollision value, inout BBoxCollision stack[32]) {
  if (index < 16) {
    if (index < 8) {
      if (index < 4) {
        if (index < 2) {
          if (index == 0) stack[0] = value;
          else stack[1] = value;
        }
        else {
          if (index == 2) stack[2] = value;
          else stack[3] = value;
        }
      }
      else {
        if (index < 6) {
          if (index == 4) stack[4] = value;
          else stack[5] = value;
        }
        else {
          if (index == 6) stack[6] = value;
          else stack[7] = value;
        }
      }
    }
    else {
      if (index < 12) {
        if (index < 10) {
          if (index == 8) stack[8] = value;
          else stack[9] = value;
        }
        else {
          if (index == 10) stack[10] = value;
          else stack[11] = value;
        }
      }
      else {
        if (index < 14) {
          if (index == 12) stack[12] = value;
          else stack[13] = value;
        }
        else {
           if (index == 14) stack[14] = value;
           else stack[15] = value;
        }
      }
    }
  }
  else {
    if (index < 24) {
      if (index < 20) {
        if (index < 18) {
          if (index == 16) stack[16] = value;
          else stack[17] = value;
        }
        else {
          if (index == 18) stack[18] = value;
          else stack[19] = value;
        }
      }
      else {
        if (index < 22) {
          if (index == 20) stack[20] = value;
          else stack[21] = value;
        }
        else {
          if (index == 22) stack[22] = value;
          else stack[23] = value;
        }
      }
    }
    else {
      if (index < 28) {
        if (index < 26) {
          if (index == 24) stack[24] = value;
          else stack[25] = value;
        }
        else {
          if (index == 26) stack[26] = value;
          else stack[27] = value;
        }
      }
      else {
        if (index < 30) {
          if (index == 28) stack[28] = value;
          else stack[29] = value;
        }
        else {
          if (index == 30) stack[30] = value;
          else stack[31] = value;
        }
      }
    }
  }
}

bool SceneIntersection(in Ray ray, inout Collision collision) {
  Collision closest_collision;
  closest_collision.distance = 1000.0;

  Object object;
  //BBoxCollision collisions[32]; // Stores all bounding box collision in sorted order
  int collision_count = 0;
  for (int i = 0; i < 1000; i++) {
    getObjectAtIndex(i, object);

    float collision_distance = BoundingBoxCollision(object.bounding_bottom + object.position, object.bounding_top + object.position, ray);

    if (collision_distance < closest_collision.distance) {
      traverseObjectTree(ray, closest_collision, object);
    }

    if (i >= object_count) break;
  }

  if (closest_collision.distance == 1000.0) {
    return false;
  }
  else {
    collision = closest_collision;
    return true;
  }
}


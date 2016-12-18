bool SceneIntersection(in Ray ray, inout Collision collision) {
  Collision closest_collision;
  closest_collision.distance = 1000.0;
  float collision_distance = 0.0;

  Object object;
  int object_type;
  for (int i = 0; i < object_count; i++) {
    getObjectAtIndex(i, object, object_type);

    bool collision = BoundingBoxCollision(object.bounding_bottom, object.bounding_top, ray, collision_distance);
    if (collision) {
      if (collision_distance < closest_collision.distance) {
        traverseObjectTree(ray, closest_collision, object.object_bvh_start_index, object.triangle_start_index);
      }
    }
  }

  if (closest_collision.distance == 1000.0) {
    return false;
  }
  else {
    collision = closest_collision;
    return true;
  }
}


bool SceneIntersection(in Ray ray, inout Collision collision) {
  Collision closest_collision;
  closest_collision.distance = 1000.0;
  float collision_distance = 0.0;

  Object object;
  Sphere sphere;
  int object_type;
  for (int i = 0; i < 1000; i++) {
    getObjectAtIndex(i, object, sphere, object_type);

    if (BoundingBoxCollision(object.bounding_bottom, object.bounding_top, ray, collision_distance)) {
      if (collision_distance < closest_collision.distance) {
        traverseObjectTree(ray, closest_collision, object.object_bvh_start_index, object.triangle_start_index);
      }
    }
    if (i >= object_count)
      break;
  }

  if (closest_collision.distance == 1000.0) {
    return false;
  }
  else {
    collision = closest_collision;

    float u = collision.uv.x;
    float v = collision.uv.y;
    float shade = 0.0;
    collision.normal = mix(collision.n0, (1.0 - u - v) * collision.n0 + u * collision.n1 + v * collision.n2, shade);

    return true;
  }
}


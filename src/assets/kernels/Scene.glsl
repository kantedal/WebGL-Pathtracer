bool SceneIntersections(Ray ray, inout Collision collision) {
  //Check sphere collision
  int sphere_index = 0;
  for (int i = 0; i < 1000; i++) {
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
  for (int i = 0; i < 1000; i++) {
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

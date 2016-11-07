vec3 CosineDistributeDirection(vec3 normal) {
    float sin_theta = sqrt(random(vec3(4.21, 2456.23, 2.425), time + 18.421));
    float cos_theta = sqrt(1.0 - sin_theta * sin_theta);

    // Random in plane angle;
    float psi = random(vec3(5267.68, 2.13, 42.23), time + 89.362) * 2.0 * 3.14;

    // Generate tangents along plane
    vec3 tangent1, tangent2;
    tangent1 = cross(normal, vec3(0,0,1));
    tangent2 = cross(normal, tangent1);

    vec3 v1, v2, v3;
    v1 = sin_theta * cos(psi) * tangent1;
    v2 = sin_theta * sin(psi) * tangent2;
    v3 = cos_theta * normal;

    return v1 + v2 + v3;
}

vec3 ShadowRay(vec3 collision_pos, vec3 collision_normal) {
  int light_index = int(random(vec3(15.326, 24.4236, 812.23), time + 12421.362) * 2.0);

  // Fetch triangle and material
  Triangle light_triangle = GetLightTriangleFromIndex(light_index);
  Material light_material = GetMaterial(light_triangle.material_index);
  vec3 light_normal = cross(light_triangle.edge1, light_triangle.edge2);

  // Generate emission position and direction
  vec3 light_emission_pos = RandomizePointOnTriangle(light_triangle);
  vec3 light_emission_direction = normalize(collision_pos - light_emission_pos);
  Ray shadow_ray = Ray(light_emission_pos, light_emission_direction);

  // Test ray visibility
  Collision collision;
  if (SceneIntersections(shadow_ray, collision)) {
    if (distance(collision.position, collision_pos) < 0.1) {

      // Point is visible
      vec3 distance_vector = light_emission_pos - collision_pos;
      vec3 L = normalize(distance_vector);
      float cosine_term = clamp(dot(collision_normal, L), 0.0, 1.0);
      float light_area = (length(light_triangle.edge1) * length(light_triangle.edge2)) / 2.0;
      float projected_light_area = clamp(dot(light_normal, -1.0 * L), 0.0, 1.0);


      return light_material.emission_rate * light_material.color * cosine_term * projected_light_area * 1.0 / pow(length(distance_vector), 2.0);
    }
  }

  return vec3(0,0,0);
}

struct LightPosition {
  vec3 radiance;
  vec3 position;
};

void GenerateLightPath(inout LightPosition light_positions[5]) {
  // Triangle light_triangle = GetLightTriangleFromIndex(0);
  // vec3 light_start_direction = CosineDistributeDirection(light_triangle.normal);
  // vec3 light_start_position = RandomizePointOnTriangle(light_triangle);
  //
  // Ray start_ray = Ray(light_start_position, light_start_direction);
  //
  // Collision collision;
  // if (SceneIntersections(shadow_ray, collision)) {
  //   if (distance(collision.position, collision_pos) < 0.1) {
  //     light_intensity += vec3(1,1,1) * (1.0 / pow(distance(light_pos, collision_pos) * 0.3, 2.0));
  //   }
  // }

  // for (int iteration = 0; iteration < 5; iteration++) {
  //
  // }
}

vec3 PathTrace(Ray ray) {
  vec3 mask = vec3(1,1,1);
  vec3 accumulated_color = vec3(0,0,0);
  Collision collision;
  Material collision_material;

  for (int iteration = 0; iteration < 5; iteration++) {

    float distribution = 1.0;

    if (!SceneIntersections(ray, collision))
      return vec3(0,0,0);

    collision_material = GetMaterial(collision.material_index);

    vec3 next_dir = PDF(ray, collision_material, collision.normal, iteration, distribution);
    mask *= BRDF(ray, collision_material, collision.normal, next_dir) * distribution;

    if (collision_material.emission_rate != 0.0) {
      accumulated_color += (mask * collision_material.color * collision_material.emission_rate);
      //break;
    }
    // else {
    //   vec3 light_intensity = ShadowRay(collision.position, collision.normal);
    //   accumulated_color += (mask * collision_material.color * light_intensity);
    // }

    if (!(next_dir.x == 0.0 && next_dir.y == 0.0 && next_dir.z == 0.0)) {
      ray = Ray(collision.position + next_dir * 0.01, next_dir);
    }
    else {
      break;
    }
  }

  return accumulated_color;
}


vec3 TracePath(Ray ray) {
  Collision collision;

  if (!SceneIntersections(ray, collision))
    return vec3(0,0,0);

  Material collision_material = GetMaterial(collision.material_index);
  if (collision_material.emission_rate != 0.0)
    return vec3(1,0,1);

  return collision_material.color;
}

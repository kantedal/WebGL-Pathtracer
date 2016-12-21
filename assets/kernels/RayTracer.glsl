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

vec3 ShadowRay(Material collision_material, vec3 collision_pos, vec3 collision_normal) {
  int light_index = int(random(vec3(15.326, 24.4236, 812.23), sin(time) * 30245.42 + 12421.362) * 2.0);

  // Fetch triangle and material
  Triangle light_triangle = GetLightTriangleFromIndex(light_index);
  vec3 light_normal = light_triangle.n0;

  // Generate emission position and direction
  vec3 light_emission_pos = RandomizePointOnTriangle(light_triangle);
  vec3 light_emission_direction = normalize(light_emission_pos - collision_pos);

  if (dot(collision_normal, light_emission_direction) > 0.0) {
    // Test ray visibility
    Collision collision;
    Ray shadow_ray = newRay(collision_pos, light_emission_direction);
    if (SceneIntersection(shadow_ray, collision)) {
      if (distance(collision.position, light_emission_pos) < EPS) {

        // Point is visible
        vec3 distance_vector = light_emission_pos - collision_pos;
        float alpha = dot(collision_normal, light_emission_direction);
        float beta = clamp(dot(light_normal, -light_emission_direction), 0.0, 1.0);
        Material light_material = GetMaterial(light_triangle.material_index);
        return 0.5 * dot(collision_normal, light_emission_direction) * light_material.emission_rate * light_material.color * alpha * beta * light_triangle.triangle_area * 1.0 / pow(length(distance_vector), 2.0);
     }
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

  for (int iteration = 0; iteration < 10; iteration++) {
    float distribution = 1.0;

    //accumulated_color += mask * ShadowRay(collision_material, collision.position, collision.normal);
    //break;

    if (!SceneIntersection(ray, collision)) {
      //if (global_lightning_enabled == 1.0) {
        vec3 lightSphereContribution = LightSphereContributions(ray);
        if (iteration == 0) {
          return vec3(0,0,0); //(lightSphereContribution - 0.5) * 1.5 + 0.5;
        }
        else {
          lightSphereContribution = ((lightSphereContribution - 0.5) * 2.5 + 0.5) * 0.8;
          accumulated_color += (mask * lightSphereContribution);
        }

      //}
      break;
    }

    collision_material = GetMaterial(collision.material_index);

    vec3 next_dir = PDF(ray, collision_material, collision.normal, iteration, distribution);
    mask *= BRDF(ray, collision_material, collision.uv, collision.normal, next_dir) * distribution;
    //mask *= 2.0;

    accumulated_color += mask * collision_material.emission_rate;

    if (collision_material.emission_rate != 0.0) break;

    if (iteration == trace_depth - 1) {
//      // Cast shadow ray to end point of ray chain if it has not hit any light source
//      if (collision_material.material_type == DIFFUSE_MATERIAL) {
//        accumulated_color += mask * ShadowRay(collision_material, collision.position, collision.normal);
//      }

      break;
    }
    else {
      ray = Ray(collision.position + next_dir * EPS, next_dir);
    }
  }

  //return vec3(clamp(accumulated_color.x, 0.0, 1.0), clamp(accumulated_color.y, 0.0, 1.0), clamp(accumulated_color.z, 0.0, 1.0));
  return accumulated_color;
}




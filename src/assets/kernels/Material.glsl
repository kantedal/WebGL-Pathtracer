struct Material {
  vec3 color;
  int material_type;
  float emission_rate;
};

Material GetMaterial(int material_index) {
  // Fetch material from texture
  vec2 sample_step = vec2(1.0, 0.0) / vec2(512, 512);
  vec2 start_sample = (vec2(1.0, 0.0) / vec2(512, 512)) * float(material_index) * 2.0 + 0.5 * sample_step;

  vec3 color = vec3(texture2D(u_material_texture, start_sample));
  int material_type = int(texture2D(u_material_texture, start_sample + sample_step).x);
  float emission_rate = texture2D(u_material_texture, start_sample + sample_step).y;

  return Material(color, material_type, emission_rate);
}

vec3 BRDF(Ray ray, Material material, vec3 collision_normal, vec3 next_dir) {
  // Lambertian diffuse material
  if (material.material_type == 0) {
    return material.color * dot(ray.direction, -collision_normal);// / 3.14 * 2.0;
  }

  // Specular material
  if (material.material_type == 1) {
    return material.color;
  }

  // Emission material
  if (material.material_type == 2) {
    return material.color;
  }

  // Transmission material
  if (material.material_type == 3) {
    return material.color;
  }

  // Oren nayar diffuse material
  if (material.material_type == 4) {
    float albedo = 1.8;
    float roughness = 1.0;
    vec3 view_direction = -1.0 * ray.direction;

    // set value depending on materia
    const float PI = 3.14159;

    // calculate intermediary values
    float NdotL = dot(collision_normal, next_dir);
    float NdotV = dot(collision_normal, view_direction);

    float angleVN = acos(NdotV);
    float angleLN = acos(NdotL);

    float alpha = max(angleVN, angleLN);
    float beta = min(angleVN, angleLN);
    float gamma = dot(view_direction - collision_normal * dot(view_direction, collision_normal), next_dir - collision_normal * dot(next_dir, collision_normal));

    float roughnessSquared = roughness * roughness;

    // calculate A and B
    float A = 1.0 - 0.5 * (roughnessSquared / (roughnessSquared + 0.57));
    float B = 0.45 * (roughnessSquared / (roughnessSquared + 0.09));
    float C = sin(alpha) * tan(beta);

    // put it all together
    float L1 = max(0.0, NdotL) * (A + B * max(0.0, gamma) * C);

    // get the final color
    return material.color * L1;
  }
}

vec3 PDF(Ray ray, Material material, vec3 collision_normal, int iteration, inout float distribution) {
  vec3 real_normal = dot(collision_normal, ray.direction) > 0.0 ? -1.0 * collision_normal : collision_normal;
  vec3 next_dir;

  if (material.material_type == 0 ) {
    float r1 = 2.0 * 3.14 * random(vec3(12.9898, 78.233, 151.7182), time + float(iteration));
    float r2 = random(vec3(63.7264, 10.873, 623.6736), time + float(iteration));
    float r2s = sqrt(r2);

    vec3 w = collision_normal;
    vec3 u = normalize(cross((abs(w.x) > .1 ? vec3(0, 1, 0) : vec3(1, 0, 0)), w));
    vec3 v = cross(w, u);

    // compute cosine weighted random ray direction on hemisphere
    next_dir = normalize(u * cos(r1) * r2s + v * sin(r1) * r2s + w * sqrt(1.0 - r2));

    return next_dir;
  }

  if (material.material_type == 4) {
    float r1 = 2.0 * 3.14 * random(vec3(12.9898, 78.233, 151.7182), time + float(iteration));
    float r2 = random(vec3(63.7264, 10.873, 623.6736), time + float(iteration));
    float r2s = sqrt(r2);

    vec3 w = collision_normal;
    vec3 u = normalize(cross((abs(w.x) > .1 ? vec3(0, 1, 0) : vec3(1, 0, 0)), w));
    vec3 v = cross(w, u);

    // compute cosine weighted random ray direction on hemisphere
    next_dir = normalize(u * cos(r1) * r2s + v * sin(r1) * r2s + w * sqrt(1.0 - r2));

    return next_dir;
  }

  if (material.material_type == 1) {
    return normalize(ray.direction - 2.0 * dot(ray.direction, collision_normal) * collision_normal);
  }

  if (material.material_type == 3) {
    bool into = dot(collision_normal, real_normal) > 0.0; // is ray entering or leaving refractive material?
    float nc = 1.0;  // Index of Refraction air
    float nt = 1.3;  // Index of Refraction glass/water
    float nnt = into ? nc / nt : nt / nc;  // IOR ratio of refractive materials
    float ddn = dot(ray.direction, real_normal);
    float cos2t = 1.0 - nnt*nnt * (1.0 - ddn*ddn);

    if (cos2t < 0.0) // total internal reflection
    {
        next_dir = normalize(ray.direction - collision_normal * 2.0 * dot(collision_normal, ray.direction));
    }
    else // cos2t > 0
    {
      // compute direction of transmission ray
      vec3 tdir = ray.direction * nnt;
      tdir -= normalize(collision_normal * ((into ? 1.0 : -1.0) * (ddn * nnt + sqrt(cos2t))));

      float R0 = (nt - nc)*(nt - nc) / (nt + nc)*(nt + nc);
      float c = 1.0 - (into ? -ddn : dot(tdir, collision_normal));
      float Re = R0 + (1.0 - R0) * c * c * c * c * c;
      float Tr = 1.0 - Re; // Transmission
      float P = 0.25 + 0.5 * Re;
      float RP = Re / P;
      float TP = Tr / (1.0 - P);

      // randomly choose reflection or transmission ray
      float rand = random(vec3(86.425, 145.233, 42.525), time + float(iteration));
      if (rand < 0.2) // reflection ray
      {
        distribution = RP;
        next_dir = normalize(ray.direction - collision_normal * 2.0 * dot(collision_normal, ray.direction));
      }
      else // transmission ray
      {
        distribution = TP;
        next_dir = normalize(tdir);
      }

      return next_dir;
    }
  }

  return vec3(0,0,0);
}

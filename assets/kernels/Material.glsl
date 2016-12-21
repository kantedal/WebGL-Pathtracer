#define DIFFUSE_MATERIAL 0
#define SPECULAR_MATERIAL 1
#define EMISSION_MATERIAL 2
#define TRANSMISSION_MATERIAL 3
#define GLOSSY_MATERIAL 5

struct Material {
  vec3 color;
  int material_type;
  float emission_rate;
  float material_parameter1;
  float material_parameter2;
};

Material GetMaterial(int material_index) {
  // Fetch material from texture
  vec2 start_sample = SAMPLE_STEP_512 * float(material_index) * 3.0;
  vec2 sample1 = getSample(start_sample, SAMPLE_STEP_512, 512.0, 0.0);
  vec2 sample2 = getSample(start_sample, SAMPLE_STEP_512, 512.0, 1.0);
  vec2 sample3 = getSample(start_sample, SAMPLE_STEP_512, 512.0, 2.0);

  vec3 color = vec3(texture2D(u_material_texture, sample1));
  vec3 extra_data1 = vec3(texture2D(u_material_texture, sample2));
  vec3 extra_data2 = vec3(texture2D(u_material_texture, sample3));

  int material_type = int(extra_data1.x);
  float emission_rate = extra_data1.y;

  float material_parameter1 = extra_data2.x;
  float material_parameter2 = extra_data2.y;

  return Material(color, material_type, emission_rate, material_parameter1, material_parameter2);
}

vec3 BRDF(Ray ray, Material material, vec2 uv, vec3 collision_normal, vec3 next_dir) {
  // Lambertian diffuse material
  if (material.material_type == DIFFUSE_MATERIAL) {
    float albedo = material.material_parameter1; // material parameter 1 is albedo
    float roughness = material.material_parameter2; // material parameter 2 is roughness
    vec3 view_direction = -1.0 * ray.direction;

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
    //vec3 texture_color = texture2D(u_light_sphere_texture, uv * 5.0).rgb;
    return material.color * L1;
  }

  // Emission material
  else if (material.material_type == EMISSION_MATERIAL) {
    return material.color;
  }

  // Specular material
  else if (material.material_type == SPECULAR_MATERIAL) {
    return material.color;
  }

  // Transmission material
  else if (material.material_type == TRANSMISSION_MATERIAL) {
    return material.color;
  }

  // Glossy material
  else if (material.material_type == GLOSSY_MATERIAL) {
    return material.color;
  }


}

vec3 PDF(Ray ray, Material material, vec3 collision_normal, int iteration, inout float distribution) {
  vec3 real_normal = dot(collision_normal, ray.direction) > 0.0 ? -1.0 * collision_normal : collision_normal;
  vec3 next_dir;

  if (material.material_type == DIFFUSE_MATERIAL) {
    float r1 = 2.0 * 3.14 * random(vec3(12.9898, 78.233, 151.7182), time + 100.0 * float(iteration));
    float r2 = random(vec3(63.7264, 10.873, 623.6736), time + 12.0 * float(iteration));
    float r2s = sqrt(r2);

    vec3 w = collision_normal;

    vec3 u = normalize(cross(mix(vec3(1,0,0), vec3(0,1,0), step(0.1, abs(w.x))), w));
    vec3 v = cross(w, u);

    // compute cosine weighted random ray direction on hemisphere
    next_dir = normalize(u * cos(r1) * r2s + v * sin(r1) * r2s + w * sqrt(1.0 - r2));

    return next_dir;
  }

  // Fully specular material
  else if (material.material_type == SPECULAR_MATERIAL) {
    return normalize(ray.direction - 2.0 * dot(ray.direction, collision_normal) * collision_normal);
  }

  // Glossy material
  else if (material.material_type == GLOSSY_MATERIAL) {
    vec3 reflected = normalize(ray.direction - 2.0 * dot(ray.direction, collision_normal) * collision_normal);

    float r1 = 2.0 * 3.14 * random(vec3(521.9898, 2321.233, 241.7182), time + 100.0 * float(iteration));
    float r2 = random(vec3(2631.7264, 5.873, 245.6736), time + 12.0 * float(iteration));
    float r2s = pow(r2, material.material_parameter1);

    vec3 w = reflected;
    vec3 u = normalize(cross(mix(vec3(1,0,0), vec3(0,1,0), step(0.1, abs(w.x))), w));
    vec3 v = cross(w, u);

    // compute cosine weighted random ray direction on hemisphere
    next_dir = normalize(u * cos(r1) * r2s + v * sin(r1) * r2s + w * sqrt(1.0 - r2));
    return next_dir;
  }

  else if (material.material_type == TRANSMISSION_MATERIAL) {
    bool into = dot(collision_normal, real_normal) > 0.0; // is ray entering or leaving refractive material?
    float nc = 1.0;  // Index of Refraction air
    float nt = 1.5;  // Index of Refraction glass/water
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

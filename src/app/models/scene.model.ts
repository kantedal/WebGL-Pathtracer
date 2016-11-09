declare var Vector;

import {Ray} from "./ray.model";
import {MATERIAL_TYPES, Material} from "./material.model";
import {LoadObjects} from "./loader";
import {Sphere} from "./sphere.model";
import {Object3d} from "./object3d.model";

export class Scene {
  private _objects: Array<Object3d>;
  private _spheres: Array<Sphere>;
  private _materials: Array<Material>;

  constructor() {
    this._objects = [];
    this._spheres = [];
    this._materials = [];
  }

  public sceneIntersection(ray: Ray): Object3d {
    let colliding_objects = [];
    let collision_positions = [];

    for (let object of this._objects) {
      let collision_pos: GLM.IArray = vec3.fromValues(0,0,0);
      if (object.rayIntersection(ray, collision_pos)) {
        colliding_objects.push(object);
        collision_positions.push(collision_pos);
      }
    }

    let closestIndex = 0;
    let closestDistance = 1000;
    for (let i = 0; i < collision_positions.length; i++) {
      let distance = vec3.squaredDistance(ray.startPosition, collision_positions[i]);
      if (distance < closestDistance) {
        closestIndex = i;
        closestDistance = distance;
      }
    }

    return colliding_objects[closestIndex];
  }

  CreateDefaultScene() {
    let red_material = new Material(vec3.fromValues(1,0,0), MATERIAL_TYPES.oren_nayar);
    let green_material = new Material(vec3.fromValues(0,1,0), MATERIAL_TYPES.oren_nayar);
    let blue_material = new Material(vec3.fromValues(0,0,1), MATERIAL_TYPES.oren_nayar);
    let white_material = new Material(vec3.fromValues(1.0, 0.5, 1.0), MATERIAL_TYPES.oren_nayar);
    let green_glass = new Material(vec3.fromValues(0.5, 1.0, 0.5), MATERIAL_TYPES.transmission);
    let specular_red_material = new Material(vec3.fromValues(1,0.5,0.5), MATERIAL_TYPES.specular);

    let emission_material = new Material(vec3.fromValues(1,1,1), MATERIAL_TYPES.emission);
    emission_material.emission_rate = 10.0;
    let emission_red_material = new Material(vec3.fromValues(1,0.7,0.7), MATERIAL_TYPES.emission);
    emission_red_material.emission_rate = 20.0;

    this._materials.push(red_material);
    this._materials.push(green_material);
    this._materials.push(blue_material);
    this._materials.push(white_material);
    this._materials.push(green_glass);
    this._materials.push(specular_red_material);
    this._materials.push(emission_material);
    this._materials.push(emission_red_material);

    // Load objects from .obj files
    LoadObjects([
        {fileName: './assets/models/light_plane.obj', material: emission_material },
        {fileName: './assets/models/floor.obj', material: white_material },
        {fileName: './assets/models/right_wall.obj', material: blue_material },
        {fileName: './assets/models/left_wall.obj', material: red_material},
        {fileName: './assets/models/roof.obj', material: white_material},
      ], (objects) => {
        for (let object of objects) {
          this._objects.push(object);
        }
      },
      () => {});

    this._spheres.push(new Sphere(vec3.fromValues(5.0, -3, -3.5), 0.5, emission_red_material));
    this._spheres.push(new Sphere(vec3.fromValues(8.0, 1.8, -3.0), 1.8, green_glass));
    this._spheres.push(new Sphere(vec3.fromValues(9.0, -1.8, -3.0), 1.8, white_material));
  }

  BuildSceneTextures() {
    let textureData = {
      triangles: new Float32Array(2048 * 2048 * 3),
      triangle_count: 0,
      materials: new Float32Array(512 * 512 * 3),
      material_count: 0,
      spheres: new Float32Array(512 * 512 * 3),
      sphere_count: 0,
      light_triangles: new Float32Array(128 * 128 * 3),
      light_count: 0
    };

    // Build material data
    let materialData = [];
    for (let mat_idx = 0; mat_idx < this._materials.length; mat_idx++) {
      let material = this._materials[mat_idx];

      // Set material index
      material.material_index = mat_idx;

      // Color
      materialData.push(material.color[0]);
      materialData.push(material.color[1]);
      materialData.push(material.color[2]);

      // Extra data
      materialData.push(material.material_type);
      materialData.push(material.emission_rate);
      materialData.push(0);
    }

    textureData.material_count = this._materials.length;
    for (let i = 0; i < materialData.length; i++) {
      textureData.materials[i] = materialData[i];
    }

    // Build sphere data
    let sphereData = [];
    for (let sphere of this._spheres) {
      // Find material index for current object
      let material_index = 0;
      for (let mat_idx = 0; mat_idx < this._materials.length; mat_idx++) {
        if (this._materials[mat_idx] === sphere.material) {
          material_index = mat_idx;
          break;
        }
      }

      // Position
      sphereData.push(sphere.position[0]);
      sphereData.push(sphere.position[1]);
      sphereData.push(sphere.position[2]);

      // Extra data
      sphereData.push(sphere.radius);
      sphereData.push(material_index);
      sphereData.push(0);
    }

    textureData.sphere_count = this._spheres.length;
    for (let i = 0; i < materialData.length; i++) {
      textureData.spheres[i] = sphereData[i];
    }

    // Build triangle data
    let triangleData = [];
    let lightData = [];
    for (let object of this._objects) {

      // Find material index for current object
      let material_index = 0;
      for (let mat_idx = 0; mat_idx < this._materials.length; mat_idx++) {
        if (this._materials[mat_idx] === object.material) {
          material_index = mat_idx;
          break;
        }
      }

      // Add triangle data
      for (let triangle of object.triangles) {
        // v0
        triangleData.push(triangle.v0[0]);
        triangleData.push(triangle.v0[1]);
        triangleData.push(triangle.v0[2]);

        // Edge 1
        triangleData.push(triangle.v1[0]);
        triangleData.push(triangle.v1[1]);
        triangleData.push(triangle.v1[2]);

        // Edge 2
        triangleData.push(triangle.v2[0]);
        triangleData.push(triangle.v2[1]);
        triangleData.push(triangle.v2[2]);

        // Extra data
        triangleData.push(material_index);
        triangleData.push(0);
        triangleData.push(0);

        // Add light data
        if (object.material.material_type == MATERIAL_TYPES.emission) {
          // v0
          lightData.push(triangle.v0[0]);
          lightData.push(triangle.v0[1]);
          lightData.push(triangle.v0[2]);

          // Edge 1
          lightData.push(triangle.v1[0]);
          lightData.push(triangle.v1[1]);
          lightData.push(triangle.v1[2]);

          // Edge 2
          lightData.push(triangle.v2[0]);
          lightData.push(triangle.v2[1]);
          lightData.push(triangle.v2[2]);

          // Extra data
          lightData.push(material_index);
          lightData.push(0);
          lightData.push(0);
        }
      }
    }

    let tri_count = 0;
    for (let i = 0; i < triangleData.length; ++i) {
      if (i % 12 == 0) tri_count++;
      textureData.triangles[i] = triangleData[i];
    }
    textureData.triangle_count = tri_count;

    let light_count = 0;
    for (let i = 0; i < lightData.length; ++i) {
      if (i % 12 == 0) light_count++;
      textureData.light_triangles[i] = lightData[i];
    }
    textureData.light_count = light_count;

    return textureData;
  }

  saveSceneToFile() {
    let objects = [];
    for (let object of this._objects) {
      objects.push(object.toJSON());
    }

    let spheres = [];
    for (let sphere of this._spheres) {
      spheres.push(sphere.toJSON());
    }

    let materials = [];
    for (let material of this._materials) {
      materials.push(material.toJSON());
    }

    let dataStr = JSON.stringify({
      objects: objects,
      spheres: spheres,
      materials: materials
    });

    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let exportFileDefaultName = 'scene.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  get objects(): Array<Object3d> {
    return this._objects;
  }

  set objects(value: Array<Object3d>) {
    this._objects = value;
  }
  get spheres(): Array<Sphere> {
    return this._spheres;
  }

  set spheres(value: Array<Sphere>) {
    this._spheres = value;
  }
  get materials(): Array<Material> {
    return this._materials;
  }

  set materials(value: Array<Material>) {
    this._materials = value;
  }
}


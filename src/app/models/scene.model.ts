import {LoadObjects} from "./loader";
declare var Vector;

import {Ray} from "./ray.model";
import {MATERIAL_TYPES, Material} from "./material.model";
import {Sphere} from "./sphere.model";
import {Object3d, Triangle} from "./object3d.model";
import {BVH} from "./bvh/bvh.model";
import {BVHNode, BVHLeaf} from "./bvh/bvh-node.model";

export class Scene {
  private _sceneListener: SceneListener;
  private _bvh: BVH;
  private _triangles: Array<Triangle>;
  private _objects: Array<Object3d>;
  private _spheres: Array<Sphere>;
  private _materials: Array<Material>;

  constructor() {
    this._triangles = []
    this._objects = [];
    this._spheres = [];
    this._materials = [];
  }

  // private recurseBBoxes(node: any, ray: Ray, colliding_objects: Array<Object3d>) {
  //   if (!node.isLeaf()) {
  //     if (node.left.rayIntersection(ray)) {
  //       this.recurseBBoxes(node.left, ray, colliding_objects);
  //     }
  //
  //     if (node.right.rayIntersection(ray)) {
  //       this.recurseBBoxes(node.right, ray, colliding_objects);
  //     }
  //   }
  //   else {
  //     for (let triangle of node.triangles) {
  //       let collision_pos = vec3.create();
  //       if (triangle.rayIntersection(ray, collision_pos)) {
  //         colliding_objects.push(this._objects[triangle.objectIndex]);
  //       }
  //     }
  //   }
  // }

  private recurseBBoxes(node_index: number, ray: Ray, colliding_objects: Array<Object3d>) {
    let node = new BVHNode();
    node.bottom = vec3.fromValues(this._bvh.bvhTexture[node_index], this._bvh.bvhTexture[node_index + 1], this._bvh.bvhTexture[node_index + 2]);
    node.top = vec3.fromValues(this._bvh.bvhTexture[node_index + 3], this._bvh.bvhTexture[node_index + 4], this._bvh.bvhTexture[node_index + 5]);

    let isLeaf = (this._bvh.bvhTexture[node_index + 6] == 1) ? true : false;
    if (!isLeaf) {
      let left_index = this._bvh.bvhTexture[node_index + 7];
      let right_index = this._bvh.bvhTexture[node_index + 8];

      let left_node = new BVHNode();
      left_node.bottom = vec3.fromValues(this._bvh.bvhTexture[left_index], this._bvh.bvhTexture[left_index + 1], this._bvh.bvhTexture[left_index + 2]);
      left_node.top = vec3.fromValues(this._bvh.bvhTexture[left_index + 3], this._bvh.bvhTexture[left_index + 4], this._bvh.bvhTexture[left_index + 5]);

      let right_node = new BVHNode();
      right_node.bottom = vec3.fromValues(this._bvh.bvhTexture[right_index], this._bvh.bvhTexture[right_index + 1], this._bvh.bvhTexture[right_index + 2]);
      right_node.top = vec3.fromValues(this._bvh.bvhTexture[right_index + 3], this._bvh.bvhTexture[right_index + 4], this._bvh.bvhTexture[right_index + 5]);

      if (left_node.rayIntersection(ray)) {
        this.recurseBBoxes(left_index, ray, colliding_objects);
      }

      if (right_node.rayIntersection(ray)) {
        this.recurseBBoxes(right_index, ray, colliding_objects);
      }
    }
    else {
      let triangle_count = this._bvh.bvhTexture[node_index + 7];
      let start_triangle_index = this._bvh.bvhTexture[node_index + 8];

      for (let tri_idx = start_triangle_index; tri_idx < triangle_count + start_triangle_index; tri_idx += 1) {
        let triangle = this._triangles[this._bvh.triangleIndexTexture[tri_idx * 3]];
        let collision_pos = vec3.create();
        if (triangle.rayIntersection(ray, collision_pos)) {
          console.log(this._bvh.triangleIndexTexture[tri_idx * 3]);
          colliding_objects.push(this._objects[triangle.objectIndex]);
        }
      }
    }
  }

  private traverseBBoxes(ray: Ray, colliding_objects: Array<Object3d>) {
    let stack = [];
    let stackIdx = 0;
    stack[stackIdx++] = 0;

    while (stackIdx != 0) {
      let boxIndex = stack[stackIdx - 1];
      console.log(boxIndex);
      stackIdx--;

      let currentNode = new BVHNode();
      currentNode.bottom = vec3.fromValues(this._bvh.bvhTexture[boxIndex], this._bvh.bvhTexture[boxIndex + 1], this._bvh.bvhTexture[boxIndex + 2]);
      currentNode.top = vec3.fromValues(this._bvh.bvhTexture[boxIndex + 3], this._bvh.bvhTexture[boxIndex + 4], this._bvh.bvhTexture[boxIndex + 5]);

      console.log(currentNode.bottom[0] + " " + currentNode.bottom[1] + " " + currentNode.bottom[2]);
      console.log(currentNode.top[0] + " " + currentNode.top[1] + " " + currentNode.top[2]);

      let isLeaf = (this._bvh.bvhTexture[boxIndex + 6] == 1);
      if (!isLeaf) {
        if (currentNode.rayIntersection(ray)) {
          let left_index = this._bvh.bvhTexture[boxIndex + 7];
          let right_index = this._bvh.bvhTexture[boxIndex + 8];

          stack[stackIdx++] = right_index;
          stack[stackIdx++] = left_index;

          if (stackIdx > 32) {
            return false;
          }
        }
      }
      else {
        let triangle_count = this._bvh.bvhTexture[boxIndex + 7];
        let start_triangle_index = this._bvh.bvhTexture[boxIndex + 8];

        console.log("count " + triangle_count);
        for (let tri_idx = start_triangle_index; tri_idx < triangle_count + start_triangle_index; tri_idx += 1) {
          let triangle = this._triangles[this._bvh.triangleIndexTexture[tri_idx * 3]];
          let collision_pos = vec3.create();
          if (triangle.rayIntersection(ray, collision_pos)) {
            //console.log(this._bvh.triangleIndexTexture[tri_idx * 3] + " " + tri_idx);
            colliding_objects.push(this._objects[triangle.objectIndex]);
          }
        }
      }

    }
  }

  public sceneIntersection(ray: Ray): Object3d {
    let colliding_objects = [];
    let collision_positions = [];

    //this.recurseBBoxes(this._bvh.root, ray, colliding_objects);
    this.traverseBBoxes(ray, colliding_objects);
    console.log("---------------------");

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

  buildScene() {
    for (let obj_idx = 0; obj_idx < this._objects.length; obj_idx++) {
      let object = this._objects[obj_idx];
      for (let triangle of object.triangles) {
        triangle.objectIndex = obj_idx;
        this._triangles.push(triangle);
      }
    }

    for (let tri_idx = 0; tri_idx < this._triangles.length; tri_idx++) {
      this._triangles[tri_idx].triangleIndex = tri_idx;
    }

    this._bvh = new BVH();
    this._bvh.createBVH(this._triangles);
  }

  buildSceneTextures() {
    let textureData = {
      triangles: new Float32Array(2048 * 2048 * 3),
      triangle_count: 0,
      bvh: this._bvh.bvhTexture,
      triangle_indices: this._bvh.triangleIndexTexture,
      materials: new Float32Array(512 * 512 * 3),
      material_count: 0,
      spheres: new Float32Array(512 * 512 * 3),
      sphere_count: 0,
      light_triangles: new Float32Array(128 * 128 * 3),
      light_count: 0,
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
        triangleData.push(triangle.objectIndex);
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

  public loadObj() {
    LoadObjects([
        {fileName: './assets/models/test.obj', material: this._materials[0] },
      ], (objects) => {
        for (let object of objects) {
          this._objects.splice(0, 0, object);
        }

        if (this._sceneListener != null)
          this._sceneListener.sceneUpdated();
      },
      () => {});
  }

  public saveSceneToFile() {
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

  set objects(objects: Array<Object3d>) { this._objects = objects;}
  get objects(): Array<Object3d> { return this._objects; }
  get spheres(): Array<Sphere> { return this._spheres; }
  set spheres(value: Array<Sphere>) { this._spheres = value; }
  get materials(): Array<Material> { return this._materials; }
  set materials(value: Array<Material>) { this._materials = value;}
  set sceneListener(value: SceneListener) { this._sceneListener = value; }
}

export interface SceneListener {
  sceneUpdated();
}

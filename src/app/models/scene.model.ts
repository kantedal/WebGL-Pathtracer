import {LoadObjects} from "./loader";
import {Ray} from "./ray.model";
import {MATERIAL_TYPES, Material} from "./material.model";
import {Sphere} from "./primitives/sphere.model";
import {Object3d} from "./primitives/object3d.model";
import {BVH} from "./bvh/bvh.model";
import {BVHNode, BVHLeaf} from "./bvh/bvh-node.model";
import {Triangle} from "./primitives/triangle.model";
import {Intersectable} from "./primitives/intersectable.model";

export class Scene {
  private _sceneListener: SceneListener;
  private _bvh: BVH;
  private _intersectables: Array<Intersectable>;
  private _triangles: Array<Triangle>;
  private _objects: Array<Object3d>;
  private _spheres: Array<Sphere>;
  private _materials: Array<Material>;

  constructor() {
    this._intersectables = [];
    this._triangles = [];
    this._objects = [];
    this._spheres = [];
    this._materials = [];
  }

  private recurseBBoxes(node: any, ray: Ray, colliding_objects: Array<Object3d>) {
    if (!node.isLeaf()) {
      if (node.left.rayIntersection(ray)) {
        this.recurseBBoxes(node.left, ray, colliding_objects);
      }
      if (node.right.rayIntersection(ray)) {
        this.recurseBBoxes(node.right, ray, colliding_objects);
      }
    }
    else {
      for (let triangle of node.triangles) {
        let collision_pos = vec3.create();
        if (triangle.rayIntersection(ray, collision_pos)) {
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
      stackIdx--;

      let currentNode = new BVHNode();
      currentNode.bottom = vec3.fromValues(this._bvh.bvhTexture[boxIndex], this._bvh.bvhTexture[boxIndex + 1], this._bvh.bvhTexture[boxIndex + 2]);
      currentNode.top = vec3.fromValues(this._bvh.bvhTexture[boxIndex + 3], this._bvh.bvhTexture[boxIndex + 4], this._bvh.bvhTexture[boxIndex + 5]);

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
    for (let object of this._objects) {
      if(object.boundingBox.rayIntersection(ray)) {
        if (object.rayIntersection(ray, vec3.create())) {
          colliding_objects.push(object);
          break;
        }
      }
    }
    console.log(colliding_objects);
    return colliding_objects[0];


    //
    // this.recurseBBoxes(this._bvh.root, ray, colliding_objects);
    // //this.traverseBBoxes(ray, colliding_objects);
    //
    // let closestIndex = 0;
    // let closestDistance = 1000;
    // for (let i = 0; i < collision_positions.length; i++) {
    //   let distance = vec3.squaredDistance(ray.startPosition, collision_positions[i]);
    //   if (distance < closestDistance) {
    //     closestIndex = i;
    //     closestDistance = distance;
    //   }
    // }
    // console.log(colliding_objects);


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

    for (let object of this._objects) {
      object.bvh.createBVH(object.triangles);
    }

    this._bvh = new BVH();
    //this._bvh.createBVH(this._triangles);
  }

  buildSceneTextures() {
    let textureData = {
      objects: new Float32Array(512 * 512 * 3),
      object_count: this._intersectables.length,
      objects_bvh: new Float32Array(2048 * 2048 * 3),
      triangles: new Float32Array(2048 * 2048 * 3),
      triangle_count: 0,
      bvh: this._bvh.bvhTexture,
      //triangle_indices: this._bvh.triangleIndexTexture,
      triangle_indices: new Float32Array(1024 * 1024 * 3),
      materials: new Float32Array(512 * 512 * 3),
      material_count: 0,
      spheres: new Float32Array(512 * 512 * 3),
      sphere_count: 0,
      light_triangles: new Float32Array(128 * 128 * 3),
      light_count: 0,
    };

    // Build sphere data
    let sphereData = [];
    let sphereIndex = 0;
    for (let sphere of this._spheres) {
      sphere.sphereIndex = sphereIndex;
      sphereIndex++;

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
    for (let i = 0; i < sphereData.length; i++) {
      textureData.spheres[i] = sphereData[i];
    }

    // Build object data
    let objectData = [];
    let bvhCount = 0;
    let triangleCount = 0;
    for (let obj_idx = 0; obj_idx < this._intersectables.length; obj_idx++) {
      let intersectable = this._intersectables[obj_idx];

      if (intersectable.type == Intersectable.TRIANLGES) {
        let object = intersectable as Object3d;
        let bvh_start_index = bvhCount;

        for (let obj_bvh_idx = 0; obj_bvh_idx < object.bvh.bvhArray.length ; obj_bvh_idx++) {
          textureData.objects_bvh[bvhCount] = object.bvh.bvhTexture[obj_bvh_idx];
          //console.log(object.bvh.bvhTexture[obj_bvh_idx]);
          bvhCount++;
        }

        let triangle_start_index = triangleCount / 3;
        let bvh_end_index = bvhCount;

        for (let tri_idx = 0; tri_idx < object.bvh.triangleCount; tri_idx++) {
          textureData.triangle_indices[triangleCount] = object.bvh.triangleIndexTexture[tri_idx];
          triangleCount++;
        }

        // Bounding box bottom
        objectData.push(object.boundingBox.bottom[0]);
        objectData.push(object.boundingBox.bottom[1]);
        objectData.push(object.boundingBox.bottom[2]);

        // Bounding box bottom
        objectData.push(object.boundingBox.top[0]);
        objectData.push(object.boundingBox.top[1]);
        objectData.push(object.boundingBox.top[2]);

        // Set indices for bvh texture
        objectData.push(bvh_start_index / 9); // BVH start index
        objectData.push(triangle_start_index);
        objectData.push(0);
      }
    }


    for (let i = 0; i < objectData.length; i++) {
      textureData.objects[i] = objectData[i];
    }

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
      console.log(material.material_type);
      materialData.push(material.material_type);
      materialData.push(material.emission_rate);
      materialData.push(0);
    }

    textureData.material_count = this._materials.length;
    for (let i = 0; i < materialData.length; i++) {
      textureData.materials[i] = materialData[i];
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

        // edge1
        triangleData.push(triangle.edge1[0]);
        triangleData.push(triangle.edge1[1]);
        triangleData.push(triangle.edge1[2]);

        // edge2
        triangleData.push(triangle.edge2[0]);
        triangleData.push(triangle.edge2[1]);
        triangleData.push(triangle.edge2[2]);

        // n0
        triangleData.push(triangle.n0[0]);
        triangleData.push(triangle.n0[1]);
        triangleData.push(triangle.n0[2]);

        // n1
        triangleData.push(triangle.n1[0]);
        triangleData.push(triangle.n1[1]);
        triangleData.push(triangle.n1[2]);

        // n2
        triangleData.push(triangle.n2[0]);
        triangleData.push(triangle.n2[1]);
        triangleData.push(triangle.n2[2]);

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
          lightData.push(triangle.edge1[0]);
          lightData.push(triangle.edge1[1]);
          lightData.push(triangle.edge1[2]);

          // Edge 2
          lightData.push(triangle.edge2[0]);
          lightData.push(triangle.edge2[1]);
          lightData.push(triangle.edge2[2]);

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
        {fileName: './assets/models/test.obj', material: this._materials[7] },
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

  public createDefaultScene(callback: any) {
    let red_material = new Material(vec3.fromValues(1,1,1), MATERIAL_TYPES.lambertian);
    let green_material = new Material(vec3.fromValues(0,1,0), MATERIAL_TYPES.oren_nayar);
    let blue_material = new Material(vec3.fromValues(0,0,1), MATERIAL_TYPES.oren_nayar);
    let white_material = new Material(vec3.fromValues(1,1,1), MATERIAL_TYPES.oren_nayar);
    let green_glass = new Material(vec3.fromValues(0.5,1,0.5), MATERIAL_TYPES.transmission);
    let glossy_red_material = new Material(vec3.fromValues(1,0.5,0.5), MATERIAL_TYPES.glossy);
    let glossy_blue_material = new Material(vec3.fromValues(0.5,0.5,1.0), MATERIAL_TYPES.glossy);
    let gold_material = new Material(vec3.fromValues(1.0,0.8,0.3), MATERIAL_TYPES.glossy);
    let silver_material = new Material(vec3.fromValues(0.8,0.8,0.8), MATERIAL_TYPES.glossy);

    let emission_material = new Material(vec3.fromValues(1,1,1), MATERIAL_TYPES.emission);
    emission_material.emission_rate = 10.0;
    let emission_red_material = new Material(vec3.fromValues(1,0.7,0.7), MATERIAL_TYPES.emission);
    emission_red_material.emission_rate = 20.0;
    let light_emission_material = new Material(vec3.fromValues(0, 1.0, 1.0), MATERIAL_TYPES.emission);
    light_emission_material.emission_rate = 0.3;

    this.materials.push(red_material);
    this.materials.push(green_material);
    this.materials.push(blue_material);
    this.materials.push(white_material);
    this.materials.push(green_glass);
    this.materials.push(glossy_red_material);
    this.materials.push(emission_material);
    this.materials.push(emission_red_material);
    this.materials.push(glossy_blue_material);
    this.materials.push(light_emission_material);
    this.materials.push(gold_material);
    this.materials.push(silver_material);

    // Load objects from .obj files
    LoadObjects([
        // {fileName: './assets/models/light_plane1.obj', material: emission_material },
        // {fileName: './assets/models/light_plane2.obj', material: emission_material },
        //{ fileName: './assets/models/bottom_disc.obj', material: white_material, smooth_shading: false },
       // { fileName: './assets/models/torus.obj', material: glossy_red_material, smooth_shading: true },
        { fileName: './assets/models/cylinder.obj', material: glossy_blue_material, smooth_shading: true },
        { fileName: './assets/models/teapot5.obj', material: silver_material, smooth_shading: true },
        { fileName: './assets/models/bunny.obj', material: gold_material, smooth_shading: true },
        { fileName: './assets/models/light_plane4.obj', material: emission_material, smooth_shading: false },
        { fileName: './assets/models/light_plane5.obj', material: emission_red_material, smooth_shading: false },
        { fileName: './assets/models/box.obj', material: white_material, smooth_shading: false }
      ], (objects) => {
        for (let object of objects) {
          this.objects.push(object);
          this._intersectables.push(object);
        }
      },
      () => {});

    let sphere1 = new Sphere(vec3.fromValues(5.0, 0.5, 3.5), 0.5, emission_red_material);
    let sphere2 = new Sphere(vec3.fromValues(0.0, 1.8, 0.0), 1.8, green_glass);
    let sphere3 = new Sphere(vec3.fromValues(-4.0, 1.8, 5.0), 1.8, glossy_red_material);

    this.spheres.push(sphere1);
    this.spheres.push(sphere2);
    this.spheres.push(sphere3);
    //
    // this._intersectables.push(sphere1);
    // this._intersectables.push(sphere2);
    // this._intersectables.push(sphere3);

    callback(this);
  }

  set objects(objects: Array<Object3d>) { this._objects = objects;}
  get objects(): Array<Object3d> { return this._objects; }
  get spheres(): Array<Sphere> { return this._spheres; }
  set spheres(value: Array<Sphere>) { this._spheres = value; }
  get materials(): Array<Material> { return this._materials; }
  set materials(value: Array<Material>) { this._materials = value;}
  set sceneListener(value: SceneListener) { this._sceneListener = value; }
  get bvh(): BVH { return this._bvh; }
}

export interface SceneListener {
  sceneUpdated();
}

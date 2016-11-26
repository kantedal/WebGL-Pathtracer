import { LoadObjects } from "./loader";
import { Ray } from "./ray.model";
import { MATERIAL_TYPES, Material } from "./material.model";
import { Object3d } from "./primitives/object3d.model";
import { Triangle } from "./primitives/triangle.model";
import { buildScene } from './scene-builder.model';

export class Scene {
  private _sceneListener: SceneListener;
  private _intersectables: Array<Object3d>;
  private _triangles: Array<Triangle>;
  private _materials: Array<Material>;

  constructor() {
    this._intersectables = [];
    this._triangles = [];
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
          colliding_objects.push(this._intersectables[triangle.objectIndex]);
        }
      }
    }
  }

  public sceneIntersection(ray: Ray): Object3d {
    let colliding_objects = [];
    let collision_positions = [];
    for (let object of this._intersectables) {
      if(object.boundingBox.rayIntersection(ray)) {
        if (object.rayIntersection(ray, vec3.create())) {
          colliding_objects.push(object);
          break;
        }
      }
    }

    return colliding_objects[0];
  }

  buildScene() {
    console.log("BUILD SCENE");
    for (let obj_idx = 0; obj_idx < this._intersectables.length; obj_idx++) {
      let object = this._intersectables[obj_idx];
      for (let triangle of object.triangles) {
        triangle.objectIndex = obj_idx;
        this._triangles.push(triangle);
      }
    }

    for (let tri_idx = 0; tri_idx < this._triangles.length; tri_idx++) {
      this._triangles[tri_idx].triangleIndex = tri_idx;
    }

    console.log(this._intersectables);
    for (let object of this._intersectables) {
      object.bvh.createBVH(object.triangles);
    }
  }

  buildSceneTextures() {
    return buildScene(this);
  }

  public loadObj() {
    LoadObjects([
        {fileName: './assets/models/test.obj', material: this._materials[7] },
      ], (objects) => {
        for (let object of objects) {
          this._intersectables.splice(0, 0, object);
        }

        if (this._sceneListener != null)
          this._sceneListener.sceneUpdated();
      },
      () => {});
  }

  public saveSceneToFile() {
    let objects = [];
    for (let object of this._intersectables) {
      objects.push(object.toJSON());
    }

    let materials = [];
    for (let material of this._materials) {
      materials.push(material.toJSON());
    }

    let dataStr = JSON.stringify({
      objects: objects,
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
    let green_material = new Material(vec3.fromValues(0,1,0), MATERIAL_TYPES.diffuse);
    let blue_material = new Material(vec3.fromValues(0,0,1), MATERIAL_TYPES.diffuse);
    let white_material = new Material(vec3.fromValues(1,1,1), MATERIAL_TYPES.diffuse);
    let green_glass = new Material(vec3.fromValues(0.5,1,0.5), MATERIAL_TYPES.transmission);
    let glossy_red_material = new Material(vec3.fromValues(1,0.5,0.5), MATERIAL_TYPES.glossy);
    let glossy_blue_material = new Material(vec3.fromValues(0.5,0.5,1.0), MATERIAL_TYPES.glossy);
    let gold_material = new Material(vec3.fromValues(1.0,0.8,0.3), MATERIAL_TYPES.glossy);
    let silver_material = new Material(vec3.fromValues(0.8,0.8,0.8), MATERIAL_TYPES.glossy);

    let emission_material = new Material(vec3.fromValues(1,1,1), MATERIAL_TYPES.diffuse);
    emission_material.emission_rate = 10.0;
    let emission_red_material = new Material(vec3.fromValues(1,0.7,0.7), MATERIAL_TYPES.diffuse);
    emission_red_material.emission_rate = 20.0;
    let light_emission_material = new Material(vec3.fromValues(0, 1.0, 1.0), MATERIAL_TYPES.diffuse);
    light_emission_material.emission_rate = 0.3;

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
        { fileName: './assets/models/cylinder.obj', material: glossy_blue_material, smooth_shading: true },
        { fileName: './assets/models/teapot5.obj', material: silver_material, smooth_shading: true },
        { fileName: './assets/models/bunny.obj', material: gold_material, smooth_shading: true },
        // { fileName: './assets/models/dragon.obj', material: gold_material, smooth_shading: true },
        { fileName: './assets/models/light_plane4.obj', material: emission_material, smooth_shading: false },
        { fileName: './assets/models/light_plane5.obj', material: emission_red_material, smooth_shading: false },
        { fileName: './assets/models/box.obj', material: white_material, smooth_shading: false }
      ], (objects) => {
        for (let object of objects) {
          this._intersectables.push(object);
        }
        callback(this);
      },
      () => {});
  }

  get materials(): Array<Material> { return this._materials; }
  set materials(value: Array<Material>) { this._materials = value;}
  set sceneListener(value: SceneListener) { this._sceneListener = value; }
  get intersectables(): Array<Object3d> { return this._intersectables; }
  set intersectables(value: Array<Object3d>) { this._intersectables = value; }
}

export interface SceneListener {
  sceneUpdated();
}

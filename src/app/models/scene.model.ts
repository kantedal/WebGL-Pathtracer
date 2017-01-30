import { LoadObjects } from "./loader";
import { Ray } from "./ray.model";
import { Material } from "./materials/material.model";
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
    let closest_colliding_object;
    let closest_distance = 100000;

    for (let object of this._intersectables) {
      if(object.boundingBox.rayIntersection(ray)) {
        let colliding_pos = vec3.create();
        if (object.rayIntersection(ray, colliding_pos)) {
          let distance = vec3.distance(ray.startPosition, colliding_pos);
          // console.log(distance);
          // console.log(object.material.color);
          // console.log('----');
          if (distance < closest_distance) {
            closest_colliding_object = object;
          }
        }
      }
    }

    return closest_colliding_object;
  }

  buildScene() {
    this._triangles = [];
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


  get materials(): Array<Material> { return this._materials; }
  set materials(value: Array<Material>) { this._materials = value;}
  set sceneListener(value: SceneListener) { this._sceneListener = value; }
  get intersectables(): Array<Object3d> { return this._intersectables; }
  set intersectables(value: Array<Object3d>) { this._intersectables = value; }
}

export interface SceneListener {
  sceneUpdated();
}

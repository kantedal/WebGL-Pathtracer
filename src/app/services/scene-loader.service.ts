/**
 * Created by fille on 09/11/16.
 */
import { Injectable } from '@angular/core';
import { Object3d } from "../models/primitives/object3d.model";
import { Scene } from "../models/scene.model";
import { Material } from "../models/material.model";
import { Triangle } from "../models/primitives/triangle.model";

@Injectable()
export class SceneLoaderService {

  constructor() {}

  public roundVerticeValue(input: number): number {
    return Math.round(input * 100000) / 100000;
  }

  public loadScene(filename: string, callback: any) {
    // jQuery.get(filename, (sceneJSON) => {
    //   let scene = new Scene();
    //
    //   let materials = Array<Material>();
    //   for (let materialJSON of sceneJSON.materials) {
    //     materials.push(new Material(
    //       vec3.fromValues(materialJSON.color[0], materialJSON.color[1], materialJSON.color[2]),
    //       materialJSON.material_type,
    //       materialJSON.emission_rate
    //     ));
    //   }
    //   scene.materials = materials;
    //
    //   let scene_triangles = [];
    //   let objects = [];
    //   for (let objectJSON of sceneJSON.objects) {
    //     let triangles = Array<Triangle>();
    //     for (let triangleJSON of objectJSON.triangles) {
    //       let triangle = new Triangle(
    //         vec3.fromValues(this.roundVerticeValue(triangleJSON[0][0]), this.roundVerticeValue(triangleJSON[0][1]), this.roundVerticeValue(triangleJSON[0][2])),
    //         vec3.fromValues(this.roundVerticeValue(triangleJSON[1][0]), this.roundVerticeValue(triangleJSON[1][1]), this.roundVerticeValue(triangleJSON[1][2])),
    //         vec3.fromValues(this.roundVerticeValue(triangleJSON[2][0]), this.roundVerticeValue(triangleJSON[2][1]), this.roundVerticeValue(triangleJSON[2][2])),
    //         vec3.create(), vec3.create(), vec3.create()
    //       );
    //       triangles.push(triangle);
    //       scene_triangles.push(triangle);
    //     }
    //     objects.push(new Object3d(triangles, scene.materials[objectJSON.material_index]));
    //   }
    //   scene.intersectables = objects;
    //
    //   callback(scene);
    // });
  }
}

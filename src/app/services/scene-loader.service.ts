/**
 * Created by fille on 09/11/16.
 */
import { Injectable } from '@angular/core';
import { Triangle, Object3d } from "../models/object3d.model";
import { Scene } from "../models/scene.model";
import { Material } from "../models/material.model";
import { Sphere } from "../models/sphere.model";

@Injectable()
export class SceneLoaderService {

  constructor() {}

  public loadScene(filename: string, callback: any) {
    jQuery.get(filename, (sceneJSON) => {
      let scene = new Scene();

      let materials = Array<Material>();
      for (let materialJSON of sceneJSON.materials) {
        materials.push(new Material(
          vec3.fromValues(materialJSON.color[0], materialJSON.color[1], materialJSON.color[2]),
          materialJSON.material_type,
          materialJSON.emission_rate
        ));
      }
      scene.materials = materials;

      let objects = new Array<Object3d>();
      for (let objectJSON of sceneJSON.objects) {
        let triangles = Array<Triangle>();
        for (let triangleJSON of objectJSON.triangles) {
          triangles.push(new Triangle(
            vec3.fromValues(triangleJSON[0][0], triangleJSON[0][1], triangleJSON[0][2]),
            vec3.fromValues(triangleJSON[1][0], triangleJSON[1][1], triangleJSON[1][2]),
            vec3.fromValues(triangleJSON[2][0], triangleJSON[2][1], triangleJSON[2][2])
          ));
        }
        objects.push(new Object3d(triangles, scene.materials[objectJSON.material_index]));
      }
      scene.objects = objects;

      let spheres = new Array<Sphere>();
      for (let sphereJSON of sceneJSON.spheres) {
        spheres.push(new Sphere(
          vec3.fromValues(sphereJSON.position[0], sphereJSON.position[1], sphereJSON.position[2]),
          sphereJSON.radius,
          scene.materials[sphereJSON.material_index]
        ));
      }
      scene.spheres = spheres;

      callback(scene);
    });
  }
}

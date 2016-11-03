import { Material } from "./material.model";

class Triangle {
  private _v0: GLM.IArray;
  private _v1: GLM.IArray;
  private _v2: GLM.IArray;
  private _edge1: GLM.IArray;
  private _edge2: GLM.IArray;

  constructor(v0, v1, v2) {
    this._v0 = v0;
    this._v1 = v1;
    this._v2 = v2;

    this._edge1 = vec3.create();
    vec3.subtract(this._edge1, v0, v1);
    this._edge2 = vec3.create();
    vec3.subtract(this._edge2, v0, v2);
  }

  get v0() { return this._v0; }
  get v1() { return this._v1; }
  get v2() { return this._v2; }
  get edge1() { return this._edge1; }
  get edge2() { return this._edge2; }
}

export class Object3d {
  private _triangles: Array<Triangle>;
  private _material: Material;

  constructor(triangles, material) {
    this._triangles = triangles;
    this._material = material;
  }

  static LoadObj(objData, material) {
    let vertices = [];
    let triangles = [];

    let lines = objData.split('\n');
    for (let line of lines) {
      let components = line.split(' ');

      switch (components[0]) {
        // Vertex indices
        case 'f':
          triangles.push(new Triangle(vertices[components[1] - 1], vertices[components[2] - 1], vertices[components[3] - 1]));
          break;

        // Vertex positions
        case 'v':
          vertices.push(vec3.fromValues(components[1], components[2], components[3]));
          break;
      }
    }

    return new Object3d(triangles, material);
  }

  get triangles() { return this._triangles; }
  get material() { return this._material; }
}

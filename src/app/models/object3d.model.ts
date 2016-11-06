import { Material } from "./material.model";
import { Ray } from "./ray.model";

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
    vec3.subtract(this._edge1, v1, v0);
    this._edge2 = vec3.create();
    vec3.subtract(this._edge2, v2, v0);
  }

  get v0() { return this._v0; }
  get v1() { return this._v1; }
  get v2() { return this._v2; }
  get edge1() { return this._edge1; }
  get edge2() { return this._edge2; }

  public rayIntersection(ray: Ray, collision_pos: GLM.IArray): boolean {
    let EPS = 0.0001;

    //Begin calculating determinant - also used to calculate u parameter
    let P = vec3.fromValues(0,0,0);
    vec3.cross(P, ray.direction, this._edge2);
    let det = vec3.dot(this._edge1, P);

    if (det > -EPS && det < EPS) return false;
    let inv_det = 1.0 / det;

    //Distance from vertex1 to ray origin
    let T = vec3.fromValues(0,0,0);
    vec3.subtract(T, ray.startPosition, this._v0);
    let u = vec3.dot(T, P);
    if (u < 0.0 || u > det) return false;

    let Q = vec3.fromValues(0,0,0);
    vec3.cross(Q, T, this._edge1);

    let v = vec3.dot(ray.direction, Q);
    if(v < 0.0 || u+v > det) return false;

    let t = vec3.dot(this._edge2, Q);

    if(t > EPS) {
      let dir = vec3.fromValues(0,0,0);
      vec3.scale(dir, ray.direction, t * inv_det);
      vec3.add(collision_pos, ray.startPosition, T);
      return true;
    }

    return false;
  }
}

export class Object3d {
  private _triangles: Array<Triangle>;
  private _material: Material;

  constructor(triangles, material) {
    this._triangles = triangles;
    this._material = material;
  }

  public rayIntersection(ray: Ray, collision_pos: GLM.IArray): boolean {
    for(let triangle of this._triangles) {
      if (triangle.rayIntersection(ray, collision_pos)) {
        return true;
      }
    }

    return false;
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

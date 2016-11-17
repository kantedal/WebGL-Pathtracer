import { Material } from "./material.model";
import { Ray } from "./ray.model";

export class Triangle {
  // Verices
  private _v0: GLM.IArray;
  private _v1: GLM.IArray;
  private _v2: GLM.IArray;

  // Vertex normals
  private _n0: GLM.IArray;
  private _n1: GLM.IArray;
  private _n2: GLM.IArray;

  private _edge1: GLM.IArray;
  private _edge2: GLM.IArray;
  private _objectIndex: number;
  private _triangleIndex: number;

  constructor(v0, v1, v2, n0, n1, n2) {
    this._v0 = v0;
    this._v1 = v1;
    this._v2 = v2;

    this._n0 = n0;
    this._n1 = n1;
    this._n2 = n2;

    this._edge1 = vec3.create();
    vec3.subtract(this._edge1, v1, v0);
    this._edge2 = vec3.create();
    vec3.subtract(this._edge2, v2, v0);
  }

  get v0() { return this._v0; }
  get v1() { return this._v1; }
  get v2() { return this._v2; }
  get n2(): GLM.IArray { return this._n2;}
  get n1(): GLM.IArray { return this._n1; }
  get n0(): GLM.IArray { return this._n0; }
  get edge1() { return this._edge1; }
  get edge2() { return this._edge2; }
  get objectIndex(): number { return this._objectIndex; }
  set objectIndex(value: number) { this._objectIndex = value; }
  get triangleIndex(): number { return this._triangleIndex; }
  set triangleIndex(value: number) { this._triangleIndex = value; }

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
  private _position: GLM.IArray;
  private _rotation: GLM.IArray;
  private _scale: GLM.IArray;

  private _triangles: Array<Triangle>;
  private _material: Material;

  constructor(triangles, material) {
    this._position = vec3.fromValues(1, 0, 0);
    this._rotation = vec3.fromValues(0, 0, 0);
    this._scale = vec3.fromValues(0, 0, 0);

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

  public toJSON() {
    let triangles = [];
    for (let triangle of this._triangles) {
      triangles.push([
        [triangle.v0[0], triangle.v0[1], triangle.v0[2]],
        [triangle.v1[0], triangle.v1[1], triangle.v1[2]],
        [triangle.v2[0], triangle.v2[1], triangle.v2[2]],
      ]);
    }

    return {
      position: [this._position[0], this._position[1], this._position[2]],
      rotation: [this._position[0], this._position[1], this._position[2]],
      triangles: triangles,
      material_index: this._material.material_index
    };
  }

  static LoadObj(objData, material) {
    let vertices = [];
    let vertexNormals = [];
    let triangles = [];

    let lines = objData.split('\n');
    for (let line of lines) {
      let components = line.split(' ');

      switch (components[0]) {
        // Vertex indices
        case 'f':
          let indices1 = components[1].split('/');
          let indices2 = components[2].split('/');
          let indices3 = components[3].split('/');

          triangles.push(new Triangle(
              vertices[parseInt(indices1[0]) - 1], vertices[parseInt(indices2[0]) - 1], vertices[parseInt(indices3[0]) - 1],
              vertexNormals[parseInt(indices1[2]) - 1], vertexNormals[parseInt(indices2[2]) - 1], vertexNormals[parseInt(indices3[2]) - 1])
          );
          break;

        // Vertex positions
        case 'v':
          vertices.push(vec3.fromValues(components[1], components[2], components[3]));
          break;
        case 'vn':
          vertexNormals.push(vec3.fromValues(components[1], components[2], components[3]));
          break;
      }
    }

    return new Object3d(triangles, material);
  }

  get triangles() { return this._triangles; }
  get material() { return this._material; }
  get scale(): GLM.IArray { return this._scale; }
  get rotation(): GLM.IArray { return this._rotation; }
  get position(): GLM.IArray { return this._position; }
}

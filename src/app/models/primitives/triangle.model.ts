import {Ray} from "../ray.model";

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

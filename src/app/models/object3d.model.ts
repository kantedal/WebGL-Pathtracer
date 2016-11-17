import { Material } from "./material.model";
import { Ray } from "./ray.model";
import { Triangle } from "./triangle.model";
import { BVH } from "./bvh/bvh.model";
import { BoundingBox } from "./bvh/bounding-box.model";

export class Object3d {
  private _bvh: BVH;
  private _boundingBox: BoundingBox;
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

    this._boundingBox = new BoundingBox();
    this._boundingBox.calculateBoundingBox(this._triangles);
    console.log(this._boundingBox.bottom[0] + " " + this._boundingBox.bottom[1] + " " + this._boundingBox.bottom[2]);
    console.log(this._boundingBox.top[0] + " " + this._boundingBox.top[1] + " " + this._boundingBox.top[2]);

    this._bvh = new BVH();
    this._bvh.createBVH(this._triangles);
  }

  private recurseBBoxes(node: any, ray: Ray, colliding_positions: Array<any>) {
    console.log("Iteration");
    if (!node.isLeaf()) {
      if (node.left.rayIntersection(ray)) {
        this.recurseBBoxes(node.left, ray, colliding_positions);
      }

      if (node.right.rayIntersection(ray)) {
        this.recurseBBoxes(node.right, ray, colliding_positions);
      }
    }
    else {
      for (let triangle of node.triangles) {
        let collision_pos = vec3.create();
        if (triangle.rayIntersection(ray, collision_pos)) {
          colliding_positions.push(collision_pos);
        }
      }
    }
  }

  public rayIntersection(ray: Ray, collision_pos: GLM.IArray): boolean {
    let colliding_positions = [];
    let node = this._bvh.root;
    this.recurseBBoxes(node, ray, colliding_positions);

    if (colliding_positions.length != 0) {
      return true;
    }
    else {
      return false;
    }
    // for(let triangle of this._triangles) {
    //   if (triangle.rayIntersection(ray, collision_pos)) {
    //     return true;
    //   }
    // }
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
  get bvh(): BVH { return this._bvh; }
  get boundingBox(): BoundingBox { return this._boundingBox; }
}

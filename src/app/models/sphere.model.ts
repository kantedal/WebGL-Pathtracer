import {Material} from "./material.model";

export class Sphere {
  private _position: GLM.IArray;
  private _radius: number;
  private _material: Material;

  constructor(position: GLM.IArray, radius: number, material: Material) {
    this._position = position;
    this._radius = radius;
    this._material = material;
  }

  public toJSON() {
    return {
      position: [this._position[0], this._position[1], this._position[2]],
      radius: this._radius,
      material_index: this._material.material_index
    }
  }

  get position() { return this._position; }
  get radius() { return this._radius; }
  get material() { return this._material; }
}

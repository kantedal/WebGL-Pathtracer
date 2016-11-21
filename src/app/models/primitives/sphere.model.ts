import {Material} from "../material.model";
import {Intersectable} from "./intersectable.model";

export class Sphere extends Intersectable {
  private _radius: number;
  private _sphereIndex: number;

  constructor(position: GLM.IArray, radius: number, material: Material) {
    super(Intersectable.SPHERE, material);

    this.position = position;
    this._radius = radius;
    this.boundingBox.calculateBoundingBoxFromSphere(this.position, this._radius);

    // console.log("Position: " + this.position[0] + " " + this.position[1] + " " + this.position[2]);
    // console.log("Radius: " + this.radius);
    // console.log("BBOX: ");
    // console.log(this.boundingBox.bottom[0] + " " + this.boundingBox.bottom[1] + " " + this.boundingBox.bottom[2]);
    // console.log(this.boundingBox.top[0] + " " + this.boundingBox.top[1] + " " + this.boundingBox.top[2]);
  }

  public toJSON() {
    return {
      position: [this.position[0], this.position[1], this.position[2]],
      radius: this._radius,
      material_index: this.material.material_index
    }
  }

  get radius() { return this._radius; }
  get sphereIndex(): number { return this._sphereIndex; }
  set sphereIndex(value: number) { this._sphereIndex = value; }
}

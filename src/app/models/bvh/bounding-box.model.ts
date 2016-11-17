
import {Triangle} from "../triangle.model";
import {Ray} from "../ray.model";
export class BoundingBox {
  private _top: GLM.IArray;
  private _bottom: GLM.IArray;
  private _center: GLM.IArray;

  constructor() {
    this._top = vec3.fromValues(-10000, -10000, -10000);
    this._bottom = vec3.fromValues(10000, 10000, 10000);
    this._center = vec3.fromValues(0, 0, 0);
  }

  public calculateBoundingBox(triangles: Array<Triangle>) {
    this._bottom = vec3.fromValues(10000, 10000, 10000);
    this._top = vec3.fromValues(-10000, -10000, -10000);

    for (let triangle of triangles) {
      // Set bottom of bounding box
      vec3.min(this._bottom, this._bottom, triangle.v0);
      vec3.min(this._bottom, this._bottom, triangle.v1);
      vec3.min(this._bottom, this._bottom, triangle.v2);

      // Set top of bounding box
      vec3.max(this._top, this._top, triangle.v0);
      vec3.max(this._top, this._top, triangle.v1);
      vec3.max(this._top, this._top, triangle.v2);
    }
  }

  public rayIntersection(ray: Ray): boolean {
    // console.log(this.bottom[0] + " " + this.bottom[1] + " " + this.bottom[2]);
    // console.log(this.top[0] + " " + this.top[1] + " " + this.top[2]);
    console.log("Iteration");

    let tmin = (this._bottom[0] - ray.startPosition[0]) / ray.direction[0];
    let tmax = (this._top[0] - ray.startPosition[0]) / ray.direction[0];

    if (tmin > tmax) {
      let temp = tmin;
      tmin = tmax;
      tmax = temp;
    }

    let tymin = (this._bottom[1] - ray.startPosition[1]) / ray.direction[1];
    let tymax = (this._top[1] - ray.startPosition[1]) / ray.direction[1];

    if (tymin > tymax) {
      let temp = tymin;
      tymin = tymax;
      tymax = temp;
    }

    if ((tmin > tymax) || (tymin > tmax))
      return false;

    if (tymin > tmin)
      tmin = tymin;

    if (tymax < tmax)
      tmax = tymax;

    let tzmin = (this._bottom[2] - ray.startPosition[2]) / ray.direction[2];
    let tzmax = (this._top[2] - ray.startPosition[2]) / ray.direction[2];

    if (tzmin > tzmax) {
      let temp = tzmin;
      tzmin = tzmax;
      tzmax = temp;
    }

    if ((tmin > tzmax) || (tzmin > tmax))
      return false;

    return true;
  }

  get center(): GLM.IArray { return this._center; }
  set center(value: GLM.IArray) { this._center = value; }
  get bottom(): GLM.IArray { return this._bottom;}
  set bottom(value: GLM.IArray) { this._bottom = value; }
  get top(): GLM.IArray { return this._top; }
  set top(value: GLM.IArray) { this._top = value; }
}

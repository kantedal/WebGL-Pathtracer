import {Triangle} from "../object3d.model";
/**
 * Created by fille on 09/11/16.
 */

export class BoundingBox {
  private _triangles: Array<Triangle>;
  private _top: GLM.IArray;
  private _bottom: GLM.IArray;
  private _center: GLM.IArray;

  constructor() {
    this._triangles = [];
    this._top = vec3.fromValues(-10000, -10000, -10000);
    this._bottom = vec3.fromValues(-10000, -10000, -10000);
    this._center = vec3.fromValues(0, 0, 0);
  }

  get triangles(): Array<Triangle> { return this._triangles; }
  set triangles(value: Array<Triangle>) { this._triangles = value; }
  get center(): GLM.IArray { return this._center; }
  set center(value: GLM.IArray) { this._center = value; }
  get bottom(): GLM.IArray { return this._bottom;}
  set bottom(value: GLM.IArray) { this._bottom = value; }
  get top(): GLM.IArray { return this._top; }
  set top(value: GLM.IArray) { this._top = value; }
}

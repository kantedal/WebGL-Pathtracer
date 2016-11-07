/**
 * Created by fille on 02/11/16.
 */

export const MATERIAL_TYPES = {
  lambertian: 0,
  specular: 1,
  emission: 2,
  transmission: 3,
  oren_nayar: 4
}

export class Material {
  private _material_type: number;
  private _color: GLM.IArray;
  private _emission_rate: number;
  private _material_index: number;

  constructor(color, material_type) {
    this._material_type = material_type;
    this._color = color;
    this._emission_rate = material_type == 2 ? 10 : 0;
  }

  get material_type() { return this._material_type; }
  get color() { return this._color; }
  get emission_rate() { return this._emission_rate; }
  set emission_rate(rate) { this._emission_rate = rate; }

  get material_index(): number {
    return this._material_index;
  }

  set material_index(value: number) {
    this._material_index = value;
  }
}

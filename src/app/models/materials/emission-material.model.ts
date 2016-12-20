/**
 * Created by fille on 20/12/16.
 */
import {Material, MATERIAL_TYPES} from "./material.model";

export class EmissionMaterial extends Material {
  constructor(color: GLM.IArray) {
    super(color, MATERIAL_TYPES.emission, 5.0);
  }
}

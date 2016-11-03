/**
 * Created by fille on 02/11/16.
 */

export class Camera {
  private _position: GLM.IArray;
  private _look_at: GLM.IArray;
  private _direction: GLM.IArray;
  private _hasChanged: boolean;
  private _camera_right: GLM.IArray;
  private _camera_up: GLM.IArray;

  constructor(position: GLM.IArray, direction: GLM.IArray) {
    this._position = position;
    this._look_at = vec3.fromValues(5,0,0);
    this._direction = vec3.fromValues(0,0,0);
    this._hasChanged = false;
    this.update();
  }

  update() {
    let distance = vec3.distance(this._look_at, this._position);

    vec3.subtract(this._direction, this._look_at, this._position);
    vec3.normalize(this._direction, this._direction);

    let up_vector = vec3.fromValues(0,0,1);
    this._camera_right = vec3.fromValues(0,0,0);
    this._camera_up = vec3.fromValues(0,0,0);
    vec3.cross(this._camera_right, this._direction, up_vector);
    vec3.cross(this._camera_up, this._camera_right, this._direction);

    this._position = vec3.fromValues(this._look_at[0], this._look_at[1], this._look_at[2]);
    let negative_direction = vec3.fromValues(0,0,0);
    vec3.scale(negative_direction, this._direction, -distance);
    vec3.add(this._position, this._position, negative_direction);
  }

  get camera_up() { return this._camera_up; }
  get camera_right() { return this._camera_right; }
  get look_at() { return this._look_at; }
  get position() { return this._position; }
  get direction() { return this._direction; }
  get hasChanged() { return this._hasChanged; }

  set position(new_position) { this._position = new_position; }
  set hasChanged(changed) { this._hasChanged = changed; }
  set look_at(look_at) { this._look_at = look_at; }
}

/**
 * Created by fille on 02/11/16.
 */


export class DataTexture {
  public _texture: WebGLTexture;
  private _textureData: Float32Array;
  private _width: number;
  private _height: number;
  public _location: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext,
    width: number,
    height: number,
    data: Float32Array,
    name: string,
    program: any,
    textureLocation: number,
    type: any
  ) {
    this._texture = gl.createTexture();
    this._textureData = data;
    this._width = width;
    this._height = height;

    switch (textureLocation) {
      case 0:
        gl.activeTexture(gl.TEXTURE0);
        break;
      case 1:
        gl.activeTexture(gl.TEXTURE1);
        break;
      case 2:
        gl.activeTexture(gl.TEXTURE2);
        break;
      case 3:
        gl.activeTexture(gl.TEXTURE3);
        break;
      case 4:
        gl.activeTexture(gl.TEXTURE4);
        break;
      case 5:
        gl.activeTexture(gl.TEXTURE5);
        break;
      case 6:
        gl.activeTexture(gl.TEXTURE6);
        break;
      case 7:
        gl.activeTexture(gl.TEXTURE7);
        break;
      case 8:
        gl.activeTexture(gl.TEXTURE8);
        break;
      case 9:
        gl.activeTexture(gl.TEXTURE9);
        break;
      case 10:
        gl.activeTexture(gl.TEXTURE10);
        break;
    }

    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.FLOAT, data);
    this._location = gl.getUniformLocation(program, name);
  }


  get texture() { return this._texture; }
  get textureData() { return this._textureData; }
  set textureData(value: Float32Array) { this._textureData = value; }
  get location() { return this._location; }
  get width(): number { return this._width; }
  get height(): number { return this._height; }
}

/**
 * Created by fille on 02/11/16.
 */


export class DataTexture {
  public _texture: WebGLTexture;
  private _textureData: Float32Array;
  private _width: number;
  private _height: number;
  private _type: number;
  private _program: WebGLProgram;
  private _textureLocation: number;
  private _name: string;
  public _location: WebGLUniformLocation;
  private _gl: WebGLRenderingContext;

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
    this._gl = gl;
    this._texture = gl.createTexture();
    this._textureData = data;
    this._width = width;
    this._height = height;
    this._type = type;
    this._textureLocation = textureLocation;
    this._program = program;
    this._name = name;

    this.updateTexture();
  }

  public updateTexture() {
    switch (this._textureLocation) {
      case 0:
        this._gl.activeTexture(this._gl.TEXTURE0);
        break;
      case 1:
        this._gl.activeTexture(this._gl.TEXTURE1);
        break;
      case 2:
        this._gl.activeTexture(this._gl.TEXTURE2);
        break;
      case 3:
        this._gl.activeTexture(this._gl.TEXTURE3);
        break;
      case 4:
        this._gl.activeTexture(this._gl.TEXTURE4);
        break;
      case 5:
        this._gl.activeTexture(this._gl.TEXTURE5);
        break;
      case 6:
        this._gl.activeTexture(this._gl.TEXTURE6);
        break;
      case 7:
        this._gl.activeTexture(this._gl.TEXTURE7);
        break;
      case 8:
        this._gl.activeTexture(this._gl.TEXTURE8);
        break;
      case 9:
        this._gl.activeTexture(this._gl.TEXTURE9);
        break;
      case 10:
        this._gl.activeTexture(this._gl.TEXTURE10);
        break;
    }

    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);

    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._type, this._width, this._height, 0, this._type, this._gl.FLOAT, this._textureData);
    this._location = this._gl.getUniformLocation(this._program, this._name);
  }


  get texture() { return this._texture; }
  get textureData() { return this._textureData; }
  set textureData(value: Float32Array) {
    this._textureData = value;
  }
  get location() { return this._location; }
  get width(): number { return this._width; }
  get height(): number { return this._height; }
}

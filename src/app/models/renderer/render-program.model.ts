import {createProgram, getShaderSource} from "./gl-helper";

export class RenderProgram {
  private _gl: any;
  private _program: any;
  private _vertexAttribute: any;
  private _vertexBuffer;
  private _frameBuffer;
  private _samplesLocation: any;
  private _bloomEnabledLocation: any;
  private _bloomAlphaLocation: any;
  private _texture: any;

  constructor(gl: WebGLRenderingContext, vertexBuffer, frameBuffer) {
    this._gl = gl;
    this._vertexBuffer = vertexBuffer;
    this._frameBuffer = frameBuffer;

    let vertices = [-1, -1, -1, 1, 1, -1, 1, 1];
    this._gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);

    // create render shader
    this._program = createProgram(this._gl, getShaderSource('vs_render2'), getShaderSource('fs_render2'));

    let texCoords = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]);
    let vertexTexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let vertexTexLocation = 1; // set with GLSL layout qualifier
    gl.enableVertexAttribArray(vertexTexLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexBuffer);
    gl.vertexAttribPointer(vertexTexLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // this._vertexAttribute = gl.getAttribLocation(this._program, 'vertex');
    // gl.enableVertexAttribArray(this._vertexAttribute);

    this._gl.useProgram(this._program);
    let buffer_location = this._gl.getUniformLocation(this._program, "u_buffer_texture");
    let bloom_location = this._gl.getUniformLocation(this._program, "u_bloom_texture");
    this._gl.uniform1i(buffer_location, 0);
    this._gl.uniform1i(bloom_location, 1);

    this._samplesLocation = gl.getUniformLocation( this._program, 'samples' );
    this._bloomEnabledLocation = gl.getUniformLocation( this._program, 'bloomEnabled' );
    this._bloomAlphaLocation = gl.getUniformLocation( this._program, 'bloomAlpha' );

    this._texture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);

    let data = new Float32Array(512 * 512 * 3);
    for (let i = 0; i < 512 * 512; i++) {
      data[i] = 255.0;
      data[i] = 0;
      data[i] = 0;
    }
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGB32F, 512, 512, 0, this._gl.RGB, this._gl.FLOAT, data);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public update(bufferTexture, bloomTexture, samples: number, bloomEnabled, bloomAlpha: number) {
    this._gl.useProgram(this._program);

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.vertexAttribPointer(this._vertexAttribute, 2, this._gl.FLOAT, false, 0, 0);

    this._gl.uniform1f( this._samplesLocation, samples );
    this._gl.uniform1f( this._bloomEnabledLocation, bloomEnabled );
    this._gl.uniform1f( this._bloomAlphaLocation, bloomAlpha );

    this._gl.uniform1i(this._gl.getUniformLocation(this._program, "u_buffer_texture"), 0);
    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);

    this._gl.activeTexture(this._gl.TEXTURE1);
    this._gl.bindTexture(this._gl.TEXTURE_2D, bloomTexture);

    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
  }
}

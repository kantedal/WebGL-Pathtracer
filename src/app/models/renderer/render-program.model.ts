import { createProgram } from "./gl-helper";

export class RenderProgram {
  private _gl: WebGLRenderingContext;
  private _program: any;
  private _vertexAttribute: any;
  private _vertexBuffer;
  private _frameBuffer;
  private _samplesLocation: any;
  private _bloomEnabledLocation: any;

  constructor(gl: WebGLRenderingContext, vertexBuffer, frameBuffer) {
    this._gl = gl;
    this._vertexBuffer = vertexBuffer;
    this._frameBuffer = frameBuffer;

    let vertices = [-1, -1, -1, 1, 1, -1, 1, 1];
    this._gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);

    // create render shader
    let render_vertex_shader = document.getElementById('vs_render').textContent;
    let render_fragment_shader = document.getElementById('fs_render').textContent;
    console.log(render_fragment_shader)
    this._program = createProgram(this._gl, render_vertex_shader, render_fragment_shader);

    // this._vertexAttribute = gl.getAttribLocation(this._program, 'vertex');
    // gl.enableVertexAttribArray(this._vertexAttribute);

    this._gl.useProgram(this._program);
    let buffer_location = this._gl.getUniformLocation(this._program, "u_buffer_texture");
    let bloom_location = this._gl.getUniformLocation(this._program, "u_bloom_texture");
    this._gl.uniform1i(buffer_location, 0);
    this._gl.uniform1i(bloom_location, 1);

    this._samplesLocation = gl.getUniformLocation( this._program, 'samples' );
    this._bloomEnabledLocation = gl.getUniformLocation( this._program, 'bloomEnabled' );
  }

  public update(bufferTexture, bloomTexture, samples: number, bloomEnabled) {
    this._gl.useProgram(this._program);

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.vertexAttribPointer(this._vertexAttribute, 2, this._gl.FLOAT, false, 0, 0);

    this._gl.uniform1f( this._samplesLocation, samples );
    this._gl.uniform1f( this._bloomEnabledLocation, bloomEnabled );

    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, bufferTexture);

    this._gl.activeTexture(this._gl.TEXTURE1);
    this._gl.bindTexture(this._gl.TEXTURE_2D, bloomTexture);

    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
  }
}

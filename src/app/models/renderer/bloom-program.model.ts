
import { createProgram } from "./gl-helper";

export class BloomProgram {
  private _gl: WebGLRenderingContext;
  private _horizontalBlurProgram: WebGLProgram;
  private _verticalBlurProgram: WebGLProgram;
  private _vertexBuffer;
  private _frameBuffer;

  constructor(gl: WebGLRenderingContext, vertexBuffer, frameBuffer) {
    this._gl = gl;
    this._vertexBuffer = vertexBuffer;
    this._frameBuffer = frameBuffer;

    let render_vertex_shader = document.getElementById('vs_render').textContent;

    this._horizontalBlurProgram = createProgram(this._gl, render_vertex_shader, document.getElementById('horizontal-blur').textContent);
    this._gl.useProgram(this._horizontalBlurProgram);
    let accumulatedBufferLocationHor = gl.getUniformLocation(this._horizontalBlurProgram, "u_buffer_texture");
    this._gl.uniform1i(accumulatedBufferLocationHor, 0);

    this._verticalBlurProgram = createProgram(this._gl, render_vertex_shader, document.getElementById('vertical-blur').textContent);
    this._gl.useProgram(this._verticalBlurProgram);
    let accumulatedBufferLocationVert = gl.getUniformLocation(this._verticalBlurProgram, "u_buffer_texture");
    this._gl.uniform1i(accumulatedBufferLocationVert, 0);
  }

  public update(inputTexture: WebGLTexture, outputTexture: WebGLTexture) {
    this._gl.useProgram(this._horizontalBlurProgram);
    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, inputTexture);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, outputTexture, 0);
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

    this._gl.useProgram(this._verticalBlurProgram);
    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, outputTexture);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, inputTexture, 0);
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
  }
}

/**
 * Created by fille on 04/11/16.
 */
import {Camera} from "../camera.model";
import {createProgram} from "./gl-helper";
import {DataTexture} from "./data-texture.model";

export class CompositionProgram {
  private _gl: WebGLRenderingContext;
  private _program: WebGLProgram;
  private _vertexBuffer;
  private _frameBuffer;
  private _vertexAttribute;
  private accumulatedBufferLocation;
  private bloomBufferLocation;

  constructor(gl: WebGLRenderingContext, vertexBuffer, frameBuffer, bufferTexture, bloomTexture) {
    this._gl = gl;
    this._vertexBuffer = vertexBuffer;
    this._frameBuffer = frameBuffer;

    // Create Program
    this._program = createProgram( this._gl, document.getElementById('vs').textContent, document.getElementById('fs_combine').textContent);
    this._vertexAttribute = this._gl.getAttribLocation(this._program, 'vertex');
    this._gl.enableVertexAttribArray(this._vertexAttribute);

    this._gl.useProgram(this._program);
    this.accumulatedBufferLocation = gl.getUniformLocation(this._program, "u_buffer_texture");
    this.bloomBufferLocation = gl.getUniformLocation(this._program, "u_bloom_texture");

    this._gl.uniform1i(this.accumulatedBufferLocation, 0);
    this._gl.uniform1i(this.bloomBufferLocation, 1);

    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, bufferTexture);

    this._gl.activeTexture(this._gl.TEXTURE1);
    this._gl.bindTexture(this._gl.TEXTURE_2D, bloomTexture);

  }

  public update(bufferTexture: WebGLTexture, bloomTexture: WebGLTexture, outputTexture: WebGLTexture) {
    this._gl.useProgram(this._program);

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.vertexAttribPointer(this._vertexAttribute, 2, this._gl.FLOAT, false, 0, 0);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, outputTexture, 0);

    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, bufferTexture);

    this._gl.activeTexture(this._gl.TEXTURE1);
    this._gl.bindTexture(this._gl.TEXTURE_2D, bloomTexture);

    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
  }

}

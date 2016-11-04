import { createProgram } from "./gl-helper";

export class ThresholdProgram {
  private _gl: WebGLRenderingContext;
  private _thresholdProgram: WebGLProgram;
  private _vertexBuffer;
  private _frameBuffer;
  private _accumulatedBufferLocation: WebGLUniformLocation;
  private _samplesLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext, vertexBuffer, frameBuffer) {
    this._gl = gl;
    this._vertexBuffer = vertexBuffer;
    this._frameBuffer = frameBuffer;

    // Threshold program
    let render_vertex_shader = document.getElementById('vs_render').textContent;
    let render_fragment_shader = document.getElementById('threshold').textContent;
    this._thresholdProgram = createProgram(this._gl, render_vertex_shader, render_fragment_shader);

    this._gl.useProgram(this._thresholdProgram);
    this._accumulatedBufferLocation = gl.getUniformLocation(this._thresholdProgram, "u_buffer_texture");
    this._gl.uniform1i(this._accumulatedBufferLocation, 0);
    this._samplesLocation = gl.getUniformLocation( this._thresholdProgram, 'samples' );
  }

  public update(inputTexture: WebGLTexture, outputTexture: WebGLTexture, samples: number) {
    this._gl.useProgram(this._thresholdProgram);

    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, inputTexture);
    
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, outputTexture, 0);
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

    this._gl.uniform1f( this._samplesLocation, samples );
  }
}

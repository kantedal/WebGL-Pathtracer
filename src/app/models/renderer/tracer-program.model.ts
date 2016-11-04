import {Camera} from "../camera.model";
import {createProgram} from "./gl-helper";
import {DataTexture} from "./data-texture.model";

export class TracerProgram {
  private _gl: WebGLRenderingContext;
  private _program: WebGLProgram;
  private _vertexBuffer;
  private _frameBuffer;
  private _callback: TracerProgramInterface;

  private _triangleTexture: DataTexture;
  private _lightTexture: DataTexture;
  private _sphereTexture: DataTexture;
  private _materialTexture: DataTexture;
  private _vertexAttribute;

  private timeLocation: WebGLUniformLocation;
  private resolutionLocation: WebGLUniformLocation;

  private accumulatedBufferLocation;

  constructor(gl: WebGLRenderingContext, kernelData, vertexBuffer, frameBuffer, callback: TracerProgramInterface) {
    this._gl = gl;
    this._vertexBuffer = vertexBuffer;
    this._frameBuffer = frameBuffer;
    this._callback = callback;

    // Create Program
    this._program = createProgram( this._gl, document.getElementById('vs').textContent, kernelData);
    this._vertexAttribute = this._gl.getAttribLocation(this._program, 'vertex');
    this._gl.enableVertexAttribArray(this._vertexAttribute);

    this.accumulatedBufferLocation = gl.getUniformLocation(this._program, "u_buffer_texture");
    this.timeLocation = gl.getUniformLocation( this._program, 'time' );
    this.resolutionLocation = gl.getUniformLocation( this._program, 'resolution' );
  }

  public update(time, width, height, bufferTextures: Array<any>, camera: Camera) {
    this._gl.useProgram(this._program);

    this.updateCamera(camera);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
    this._gl.vertexAttribPointer(this._vertexAttribute, 2, this._gl.FLOAT, false, 0, 0);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, bufferTextures[1], 0);

    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, bufferTextures[0]);

    this._gl.activeTexture(this._gl.TEXTURE1);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._triangleTexture.texture);

    this._gl.activeTexture(this._gl.TEXTURE2);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._lightTexture.texture);

    this._gl.activeTexture(this._gl.TEXTURE3);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._sphereTexture.texture);

    this._gl.activeTexture(this._gl.TEXTURE4);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._materialTexture.texture);

    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

    this._gl.uniform1f( this.timeLocation, time );
    this._gl.uniform2f( this.resolutionLocation, width, height );
  }

  private updateCamera(camera: Camera) {
    if (camera != null) {
      this._gl.uniform3f(this._gl.getUniformLocation( this._program, 'camera_right'), camera.camera_right[0], camera.camera_right[1], camera.camera_right[2] );
      this._gl.uniform3f(this._gl.getUniformLocation( this._program, 'camera_up'), camera.camera_up[0], camera.camera_up[1], camera.camera_up[2] );
      this._gl.uniform3f(this._gl.getUniformLocation( this._program, 'camera_position'), camera.position[0], camera.position[1], camera.position[2] );
      this._gl.uniform3f(this._gl.getUniformLocation( this._program, 'camera_direction'), camera.direction[0], camera.direction[1], camera.direction[2] );

      if (camera.hasChanged) {
        this._callback.resetBufferTextures();
        camera.hasChanged = false;
      }
    }
  }

  public addSceneTextures(textureData) {
    this._triangleTexture = new DataTexture(this._gl, 1024, 1024, textureData.triangles, "u_triangle_texture", this._program, 1);
    this._lightTexture = new DataTexture(this._gl, 128, 128, textureData.light_triangles, "u_light_texture", this._program, 2);
    this._sphereTexture = new DataTexture(this._gl, 512, 512, textureData.spheres, "u_sphere_texture", this._program, 3);
    this._materialTexture = new DataTexture(this._gl, 512, 512, textureData.materials, "u_material_texture", this._program, 4);

    this._gl.useProgram(this._program);
    this._gl.uniform1i(this.accumulatedBufferLocation, 0);
    this._gl.uniform1i(this._triangleTexture.location, 1);
    this._gl.uniform1i(this._lightTexture.location, 2);
    this._gl.uniform1i(this._sphereTexture.location, 3);
    this._gl.uniform1i(this._materialTexture.location, 4);

    this._gl.uniform1i(this._gl.getUniformLocation( this._program, 'triangle_count'), textureData.triangle_count );
    this._gl.uniform1i(this._gl.getUniformLocation( this._program, 'sphere_count'), textureData.sphere_count );
  }
}


export interface TracerProgramInterface {
  resetBufferTextures();
}

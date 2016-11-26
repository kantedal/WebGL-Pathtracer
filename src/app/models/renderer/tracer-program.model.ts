import {Camera} from "../camera.model";
import {createProgram} from "./gl-helper";
import {DataTexture} from "./data-texture.model";
import {Material} from "../material.model";
import {RenderService} from "../../services/render.service";

export class TracerProgram {
  private _renderService: RenderService;
  private _gl: WebGLRenderingContext;
  private _program: WebGLProgram;
  private _vertexBuffer;
  private _frameBuffer;
  private _callback: TracerProgramInterface;

  private _triangleTexture: DataTexture;
  private _lightTexture: DataTexture;
  private _materialTexture: DataTexture;
  private _bvhTexture: DataTexture;
  private _objectsTexture: DataTexture;
  private _objectsBVHTexture: DataTexture;
  private _triangleIndexTexture: DataTexture;

  private _lightSphereTexture: WebGLTexture;
  private _lightSphereLocation: WebGLUniformLocation;
  private _objectCountLocation: WebGLUniformLocation;
  private _traceDepthLocation: WebGLUniformLocation;
  private timeLocation: WebGLUniformLocation;
  private resolutionLocation: WebGLUniformLocation;

  private _vertexAttribute;

  private accumulatedBufferLocation;

  constructor(renderService: RenderService, gl: WebGLRenderingContext, kernelData, vertexBuffer, frameBuffer, callback: TracerProgramInterface) {
    this._renderService = renderService;
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
    this._traceDepthLocation = gl.getUniformLocation( this._program, 'trace_depth' );
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
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._materialTexture.texture);

    this._gl.activeTexture(this._gl.TEXTURE4);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._triangleIndexTexture.texture);

    this._gl.activeTexture(this._gl.TEXTURE5);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._bvhTexture.texture);

    // this._gl.activeTexture(this._gl.TEXTURE7);
    // this._gl.bindTexture(this._gl.TEXTURE_2D, this._lightSphereTexture);

    this._gl.activeTexture(this._gl.TEXTURE6);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._objectsBVHTexture.texture);

    this._gl.activeTexture(this._gl.TEXTURE7);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._objectsTexture.texture);

    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

    this._gl.uniform1f( this.timeLocation, time );
    this._gl.uniform2f( this.resolutionLocation, width, height );
    this._gl.uniform1i( this._traceDepthLocation, this._renderService.traceDepth );
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

  public updateMaterialTexture(material: Material) {
    let material_index = material.material_index;

    this._materialTexture.textureData[material_index * 6 + 0] = material.color[0];
    this._materialTexture.textureData[material_index * 6 + 1] = material.color[1];
    this._materialTexture.textureData[material_index * 6 + 2] = material.color[2];
    this._materialTexture.textureData[material_index * 6 + 3] = material.material_type;
    this._materialTexture.textureData[material_index * 6 + 4] = material.emission_rate;
    this._materialTexture.textureData[material_index * 6 + 5] = 0;

    this._gl.bindTexture(this._gl.TEXTURE_2D, this._materialTexture.texture);
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGB, this._materialTexture.width, this._materialTexture.height, 0, this._gl.RGB, this._gl.FLOAT, this._materialTexture.textureData);
  }

  public addSceneTextures(textureData) {
    this._triangleTexture = new DataTexture(this._gl, 2048, 2048, textureData.triangles, "u_triangle_texture", this._program, 1, this._gl.RGB);
    this._lightTexture = new DataTexture(this._gl, 128, 128, textureData.light_triangles, "u_light_texture", this._program, 2, this._gl.RGB);
    this._materialTexture = new DataTexture(this._gl, 512, 512, textureData.materials, "u_material_texture", this._program, 3, this._gl.RGB);
    this._triangleIndexTexture = new DataTexture(this._gl, 1024, 1024, textureData.triangle_indices, "u_triangle_index_texture", this._program, 4, this._gl.RGB);
    this._bvhTexture = new DataTexture(this._gl, 2048, 2048, textureData.bvh, "u_bvh_texture", this._program, 5, this._gl.RGB);
    this._objectsBVHTexture = new DataTexture(this._gl, 2048, 2048, textureData.objects_bvh, "u_objects_bvh_texture", this._program, 6, this._gl.RGB);
    this._objectsTexture = new DataTexture(this._gl, 512, 512, textureData.objects, "u_objects_texture", this._program, 7, this._gl.RGB);

    // this._lightSphereTexture = this._gl.createTexture();
    // this._lightSphereLocation = this._gl.getUniformLocation(this._program, "u_light_sphere_texture");
    // this._gl.uniform1i(this._lightSphereLocation, 7);

    // let lightSphereImage = new Image();
    // lightSphereImage.onload = () => {
    //   this._gl.bindTexture(this._gl.TEXTURE_2D, this._lightSphereTexture);
    //   this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, lightSphereImage);
    //   this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    //   this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    //   this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
    //   this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
    //   this._gl.bindTexture(this._gl.TEXTURE_2D, null);
    //
    // };
    // lightSphereImage.src = "./assets/sky.jpg";

    this._gl.useProgram(this._program);
    this._gl.uniform1i(this.accumulatedBufferLocation, 0);
    this._gl.uniform1i(this._triangleTexture.location, 1);
    this._gl.uniform1i(this._lightTexture.location, 2);
    this._gl.uniform1i(this._materialTexture.location, 3);
    this._gl.uniform1i(this._triangleIndexTexture.location, 4);
    this._gl.uniform1i(this._bvhTexture.location, 5);
    this._gl.uniform1i(this._objectsBVHTexture.location, 6);
    this._gl.uniform1i(this._objectsTexture.location, 7);

    this._gl.uniform1i(this._gl.getUniformLocation( this._program, 'triangle_count'), textureData.triangle_count );
    this._gl.uniform1i(this._gl.getUniformLocation( this._program, 'object_count'), textureData.object_count );
  }
}


export interface TracerProgramInterface {
  resetBufferTextures();
}

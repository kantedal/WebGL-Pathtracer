/**
 * Created by fille on 02/11/16.
 */

import { Camera } from "../camera.model";
import { LoadShaders } from "../loader";
import { TracerProgram, TracerProgramInterface } from "./tracer-program.model";
import { RenderProgram } from "./render-program.model";
import { BloomProgram } from "./bloom-program.model";
import { ThresholdProgram } from "./threshold-program.model";

export class Renderer implements TracerProgramInterface {
  private _camera: Camera;
  private _gl: WebGLRenderingContext;
  private _canvas;
  private _buffer: WebGLBuffer;
  private _vertexBuffer: WebGLBuffer;
  private _frameBuffer: WebGLBuffer;
  private _textures: Array<WebGLTexture>;
  private _bloomTextures: Array<WebGLTexture>;
  private _renderTexture: WebGLTexture;

  private _tracerProgram: TracerProgram;
  private _thresholdProgram: ThresholdProgram;
  private _bloomProgram: BloomProgram;
  private _renderProgram: RenderProgram;

  private _startTime: number;
  private _time: number;
  private _samples: number;
  private _maxSamples: number = 5000;
  private _shouldRender: boolean = false;
  private _bloomEnabled: boolean = true;

  constructor(camera: Camera) {
    this._camera = camera;
    this.init();
  }

  public init() {
    LoadShaders([
        './assets/kernels/header.glsl',
        './assets/kernels/Ray.glsl',
        './assets/kernels/Collision.glsl',
        './assets/kernels/Material.glsl',
        './assets/kernels/Triangle.glsl',
        './assets/kernels/Sphere.glsl',
        './assets/kernels/Scene.glsl',
        './assets/kernels/RayTracer.glsl',
        './assets/kernels/main.glsl',
      ], (kernelData) => {
        this._startTime = new Date().getTime();
        this._time = 0;
        this._samples = 0;
        this._canvas = document.querySelector('canvas');
        this._canvas.width = 512;
        this._canvas.height = 512;

        this._textures = [];
        this._bloomTextures = [];

        // Initialise WebGL
        this._gl = this._canvas.getContext('experimental-webgl');
        this._gl.getExtension('OES_texture_float');
        this._gl.viewport( 0, 0, this._canvas.width, this._canvas.height );

        this._vertexBuffer = this._gl.createBuffer();
        this._frameBuffer = this._gl.createFramebuffer();

        // Create Vertex buffer (2 triangles)
        this._buffer = this._gl.createBuffer();
        this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._buffer );
        this._gl.bufferData( this._gl.ARRAY_BUFFER, new Float32Array( [ -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), this._gl.STATIC_DRAW );
        this.resetBufferTextures();

        // Create Program
        this._thresholdProgram = new ThresholdProgram(this._gl, this._vertexBuffer, this._frameBuffer);
        this._bloomProgram = new BloomProgram(this._gl, this._vertexBuffer, this._frameBuffer);
        this._tracerProgram = new TracerProgram(this._gl, kernelData, this._vertexBuffer, this._frameBuffer, this);
        this._renderProgram = new RenderProgram(this._gl, this._vertexBuffer, this._frameBuffer);


        this.animate();
      },
      () => {});
  }

  public addSceneTextures(textureData) {
    this._tracerProgram.addSceneTextures(textureData);

    this._shouldRender = true;
  }

  private animate = () => {
    if (this._shouldRender && this._samples < this._maxSamples) {

      this._tracerProgram.update(this._time, this._canvas.width, this._canvas.height, this._textures, this._camera);
      this._textures.reverse();

      // Run threshold and bloom shader if enabled
      if (this._bloomEnabled) {
        this._thresholdProgram.update(this._textures[0], this._bloomTextures[0], this._samples);
        for (let bloomIteration = 0; bloomIteration < 10; bloomIteration++)
          this._bloomProgram.update(this._bloomTextures[0], this._bloomTextures[1]);
      }

      //this._bloomTextures.reverse();
      this._renderProgram.update(this._textures[0], this._bloomTextures[0], this._samples, this._bloomEnabled);

      this._time = (new Date().getTime() - this._startTime) / 10000;
      this._samples += 1;

      this.calculateSPS();
    }
    requestAnimationFrame( this.animate );
  }

  // Calcuate samples per second
  private _elapsedTime = 0;
  private _frameCount = 0;
  private _lastTime = new Date().getTime();
  private _fps = 0;
  private calculateSPS() {
    let now = new Date().getTime();
    this._frameCount++;
    this._elapsedTime += (now - this._lastTime);
    this._lastTime = now;

    if(this._elapsedTime >= 1000) {
      this._fps = this._frameCount;
      this._frameCount = 0;
      this._elapsedTime -= 1000;
    }
  }

  public resetBufferTextures() {
    for(var i = 0; i < 2; i++) {
      this._textures[i] = this._gl.createTexture();
      this._gl.bindTexture(this._gl.TEXTURE_2D, this._textures[i]);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
      this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGB, 512, 512, 0, this._gl.RGB, this._gl.FLOAT, null);

      let data = new Float32Array(512 * 512 * 3);
      for (let i = 0; i < 512 * 512 * 3; i++) {
        data[i] = 1.0;
      }

      this._bloomTextures[i] = this._gl.createTexture();
      this._gl.bindTexture(this._gl.TEXTURE_2D, this._bloomTextures[i]);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
      this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGB, 512, 512, 0, this._gl.RGB, this._gl.FLOAT, data);
    }

    this._renderTexture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._renderTexture);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGB, 512, 512, 0, this._gl.RGB, this._gl.FLOAT, null);

    this._gl.bindTexture(this._gl.TEXTURE_2D, null);
    this._samples = 1;
  }

  get samples(): number {
    return this._samples;
  }

  get fps(): number {
    return this._fps;
  }

  set shouldRender(value: boolean) {
    this._shouldRender = value;
  }

  get bloomEnabled(): boolean {
    return this._bloomEnabled;
  }

  set bloomEnabled(value: boolean) {
    this._bloomEnabled = value;
  }
}

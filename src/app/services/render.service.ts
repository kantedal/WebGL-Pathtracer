/**
 * Created by fille on 02/11/16.
 */

import { Injectable } from '@angular/core';
import { Camera } from "../models/camera.model";
import { Scene } from "../models/scene.model";
import { Navigator } from "../models/navigator.model";
import { Renderer } from "../models/renderer/renderer.model";

@Injectable()
export class RenderService {
  public maxSamples = 5000;
  public renderCompletion = 0;
  public renderSamples = 0;
  public samplesPerSecond = 0;

  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private navigator: Navigator;

  constructor() {}

  public init() {
    this.scene = new Scene();
    this.camera = new Camera(vec3.fromValues(-1,0,0), vec3.fromValues(1,0,0));
    this.renderer = new Renderer(this.camera);
    this.navigator = new Navigator(this.camera);

    setTimeout(() => this.renderer.addSceneTextures(this.scene.BuildSceneTextures()), 100);

    setInterval(() => this.update(), 100);
  }

  public pause() {
    this.renderer.shouldRender = false;
  }

  public start() {
    this.renderer.shouldRender = true;
  }

  public restart() {
    this.renderer.resetBufferTextures();
  }

  private update() {
    this.renderSamples = this.renderer.samples;
    this.renderCompletion = this.renderer.samples / 5000;
    this.samplesPerSecond = this.renderer.fps;
  }
}

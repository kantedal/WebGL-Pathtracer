/**
 * Created by fille on 02/11/16.
 */

import { Injectable } from '@angular/core';
import { Camera } from "../models/camera.model";
import {Scene, SceneListener} from "../models/scene.model";
import { Renderer } from "../models/renderer/renderer.model";
import { NavigatorService } from "./navigator.service";
import { Material } from "../models/material.model";
import {SceneLoaderService} from "./scene-loader.service";

@Injectable()
export class RenderService implements SceneListener {
  public maxSamples = 5000;
  public renderCompletion = 0;
  public renderSamples = 0;
  public samplesPerSecond = 0;

  public bloomIterations = 20;
  public bloomAlpha = 0.7;

  private _scene: Scene;
  private camera: Camera;
  private renderer: Renderer;

  constructor(
    private _navigatorService: NavigatorService,
    private _sceneLoaderService: SceneLoaderService
  ) {}

  public init() {
    //this._sceneLoaderService.loadScene('./assets/scene6.json', (scene: Scene) => {
    this._scene = new Scene();
    this._scene.createDefaultScene(() => {
      this._scene.sceneListener = this;

      this.camera = new Camera(vec3.fromValues(-10,3,0), vec3.fromValues(1,0,0));
      this.renderer = new Renderer(this.camera, this);
      this._navigatorService.init(this.camera, this._scene);

      setTimeout(() => this.sceneUpdated(), 100);
      setInterval(() => this.update(), 100);
    });
  }

  public updateMaterialTexture(material: Material) {
    this.renderer.updateMaterialTexture(material);
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

  public bloom(enabled: boolean) {
    this.renderer.bloomEnabled = enabled;
  }

  private update() {
    this.renderSamples = this.renderer.samples;
    this.renderCompletion = this.renderer.samples / 5000;
    this.samplesPerSecond = this.renderer.fps;
  }

  public sceneUpdated() {
    this._scene.buildScene();
    this.renderer.addSceneTextures(this._scene.buildSceneTextures())
  }

  get bloomEnabled() { return this.renderer.bloomEnabled; }
  get scene(): Scene { return this._scene; }
}

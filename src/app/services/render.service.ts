/**
 * Created by fille on 02/11/16.
 */

import { Injectable } from '@angular/core';
import { Camera } from "../models/camera.model";
import {Scene, SceneListener} from "../models/scene.model";
import { Renderer } from "../models/renderer/renderer.model";
import { NavigatorService } from "./navigator.service";
import { Material } from "../models/materials/material.model";
import {SceneLoaderService} from "./scene-loader.service";
import {Object3d} from "../models/primitives/object3d.model";

@Injectable()
export class RenderService implements SceneListener {
  public maxSamples = 10000;
  public traceDepth = 3;
  public renderCompletion = 0;
  public renderSamples = 0;
  public samplesPerSecond = 0;
  public BVHModeEnabled = false;
  public globalLightningEnabled: boolean = false;

  public bloomIterations = 20;
  public bloomAlpha = 0.7;

  private _scene: Scene;
  private _camera: Camera;
  private _renderer: Renderer;

  constructor(
    private _navigatorService: NavigatorService,
    private _sceneLoaderService: SceneLoaderService
  ) {}

  public init() {
    this._scene = new Scene();
    this._camera = new Camera(vec3.fromValues(10.90, 3.51, 4.00), vec3.fromValues(1.59, 3.79, 2.27));
    this._navigatorService.init(this._camera, this._scene);

    this._renderer = new Renderer(this._camera, this);
    this._renderer.init(() => {
      this._scene.createDefaultScene(() => {
        this._scene.sceneListener = this;
        this.sceneUpdated();
        setInterval(() => this.update(), 50);
      });
    });

  }

  public updateMaterialTexture(material: Material) {
    this._renderer.updateMaterialTexture(material);
  }

  public pause() {
    this._renderer.shouldRender = false;
  }

  public start() {
    this._renderer.shouldRender = true;
  }

  public restart() {
    this._renderer.resetBufferTextures();
  }

  public enableBVHMode(enable: boolean) {
    this.BVHModeEnabled = enable;
  }

  public bloom(enabled: boolean) {
    this._renderer.bloomEnabled = enabled;
  }

  private update() {
    this.renderSamples = this._renderer.samples;
    this.renderCompletion = this._renderer.samples / this.maxSamples;
    this.samplesPerSecond = this._renderer.fps;
  }

  public sceneUpdated() {
    this._scene.buildScene();
    this._renderer.addSceneTextures(this._scene.buildSceneTextures(), this._scene);
  }

  public updateObjectTexture(object: Object3d) {
    this._renderer.tracerProgram.updateObjectTexture(object);
  }

  get bloomEnabled() { return this._renderer.bloomEnabled; }
  get scene(): Scene { return this._scene; }
  get renderer(): Renderer { return this._renderer; }
  get camera(): Camera { return this._camera; }
}

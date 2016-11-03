import {Scene} from "./scene.model";
import {Camera} from "./camera.model";
import {Renderer} from "./renderer/renderer.model";
import {Navigator} from "./navigator.model";

export class PathTracer {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private navigator: Navigator;

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera(vec3.fromValues(-1,0,0), vec3.fromValues(1,0,0));
    this.renderer = new Renderer(this.camera);
    this.navigator = new Navigator(this.camera);

    setTimeout(() => this.renderer.addSceneTextures(this.scene.BuildSceneTextures()), 100);
  }
}

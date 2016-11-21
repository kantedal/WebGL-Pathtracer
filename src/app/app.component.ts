import 'hammerjs';
import {Component, AfterViewInit} from '@angular/core';
import {RenderService} from "./services/render.service";
import {NavigatorService} from "./services/navigator.service";
import {Object3d} from "./models/primitives/object3d.model";
import {SceneLoaderService} from "./services/scene-loader.service";

declare var ProgressBar: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public static RENDER_SETTINGS = 0;
  public static POST_EFFECTS = 1;
  public static OBJECTS = 2;
  public static MATERIALS = 3;
  private _selctedPane = 0;

  private selectedObject: Object3d = null;
  private progressBar: any;

  constructor(
    private renderService: RenderService,
    private navigatorService: NavigatorService,
    private sceneLoaderService: SceneLoaderService
  ) {
    // let v1 = vec3.fromValues(-1, 1, 0);
    // let v2 = vec3.fromValues(1, -1, 2);
    // let v3 = vec3.create();
    // vec3.min(v3, v1, v2);
    // console.log(v3[0] + " " + v3[1] + " " + v3[2]);
  }

  public changePane(paneId: number) {
    this._selctedPane = paneId;
  }


  ngAfterViewInit() {
    this.renderService.init();
    this.progressBar = new ProgressBar.Circle('#render-progress-container', {
      color: '#aaa',
      strokeWidth: 7,
      trailWidth: 7,
      easing: 'easeInOut',
      duration: 100,
      text: {
        autoStyleContainer: false
      },
      from: { color: '#ff4081', width: 7 },
      to: { color: '#ff4081', width: 7 },
      step: (state, circle) => {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value === 0) {
          circle.setText('0%');
        } else {
          circle.setText(value + '%');
        }

      }
    });
    this.progressBar.text.style.fontFamily = '"Roboto", Helvetica, sans-serif';
    this.progressBar.text.style.fontWeight = '200';
    this.progressBar.text.style.fontSize = '12pt';

    setInterval(() => {
      this.progressBar.animate(this.renderService.renderCompletion)
    }, 100);

    this.setupListeners();
  }

  private setupListeners() {
    this.navigatorService.on(NavigatorService.OBJECT_SELECTED).subscribe(message => {
      this.selectedObject = message;
    });
  }
}

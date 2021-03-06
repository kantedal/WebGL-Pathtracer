import 'hammerjs';
import {Component, AfterViewInit, ViewContainerRef} from '@angular/core';
import {RenderService} from "./services/render.service";
import {NavigatorService} from "./services/navigator.service";
import {Object3d} from "./models/primitives/object3d.model";
import {SceneLoaderService} from "./services/scene-loader.service";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {LoaderDialog} from "./components/loader.component";

declare var ProgressBar: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public static RENDER_SETTINGS = 0;
  public static LIGHTNING_SETTINGS = 1;
  public static POST_EFFECTS = 2;
  public static OBJECTS = 3;
  public static MATERIALS = 4;
  private _selctedPane = 0;

  private selectedObject: Object3d = null;
  private progressBar: any;
  private dialogRef: MdDialogRef<LoaderDialog>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private renderService: RenderService,
    private navigatorService: NavigatorService,
    private sceneLoaderService: SceneLoaderService,
    private loaderDialog: MdDialog
  ) {}

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

    setTimeout(() => {
      let config = new MdDialogConfig();
      config.viewContainerRef = this.viewContainerRef;
      this.dialogRef = this.loaderDialog.open(LoaderDialog, config);
    }, 200);

    setTimeout(() => {
      this.dialogRef.close();
    }, 5000);

    this.setupListeners();
  }

  private setupListeners() {
    this.navigatorService.on(NavigatorService.OBJECT_SELECTED).subscribe(message => {
      this.selectedObject = message;
    });
  }
}

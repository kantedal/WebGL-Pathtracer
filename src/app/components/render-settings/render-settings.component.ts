/**
 * Created by fille on 08/11/16.
 */
import {Component, Input, OnChanges, ViewContainerRef} from "@angular/core";
import { Object3d } from "../../models/primitives/object3d.model";
import { RenderService } from "../../services/render.service";
import {createDefaultScene1, createDefaultScene2, createDefaultScene3, createDefaultScene4} from "../../models/default-scenes/default-scenes";
import {MdDialog, MdDialogConfig, MdDialogRef} from "@angular/material";
import {LoaderDialog} from "../loader.component";

@Component({
  selector: 'render-settings',
  templateUrl: './render-settings.html',
  styleUrls: ['./render-settings.css']
})
export class RenderSettingsComponent {
  private dialogRef: MdDialogRef<LoaderDialog>;

  constructor(
    private _renderService: RenderService,
    private loaderDialog: MdDialog,
    private viewContainerRef: ViewContainerRef,
  ) {}

  public loadObj() {
    // $("#load_obj").trigger('click');
    this._renderService.scene.loadObj();
  }

  public onBVHModeSwitch($event) {
    this._renderService.enableBVHMode($event.checked);
  }

  public onMaxSamplesChange(event) {
    this._renderService.maxSamples = parseFloat((<HTMLInputElement>event.target).value);
    console.log(this._renderService.maxSamples);
  }

  public onTraceDepthChange(event) {
    this._renderService.traceDepth = parseFloat((<HTMLInputElement>event.target).value);
    this._renderService.restart();
  }

  public sceneLoaded() {

  }

  private load() {
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;
    this.dialogRef = this.loaderDialog.open(LoaderDialog, config);

    setTimeout(() => {
      this.dialogRef.close();
    }, 5000);
  }

  public createDefaultScene1() {
    this.load();
    createDefaultScene1(this._renderService.scene, () => {
      this._renderService.sceneUpdated();
      setInterval(() => this._renderService.update(), 50);
    })
  }

  public createDefaultScene2() {
    this.load();

    createDefaultScene2(this._renderService.scene, () => {
      this._renderService.sceneUpdated();
      setInterval(() => this._renderService.update(), 50);
    })
  }

  public createDefaultScene3() {
    this.load();

    createDefaultScene3(this._renderService.scene, () => {
      this._renderService.sceneUpdated();
      setInterval(() => this._renderService.update(), 50);
    })
  }

  public createDefaultScene4() {
    this.load();

    createDefaultScene4(this._renderService.scene, () => {
      this._renderService.sceneUpdated();
      setInterval(() => this._renderService.update(), 50);
    })
  }
}

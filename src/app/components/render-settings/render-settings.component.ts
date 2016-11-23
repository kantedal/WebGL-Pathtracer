/**
 * Created by fille on 08/11/16.
 */
import { Component, Input, OnChanges } from "@angular/core";
import { Object3d } from "../../models/primitives/object3d.model";
import { RenderService } from "../../services/render.service";

@Component({
  selector: 'render-settings',
  templateUrl: './render-settings.html',
  styleUrls: ['./render-settings.css']
})
export class RenderSettingsComponent {

  constructor(private _renderService: RenderService) {}

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
}

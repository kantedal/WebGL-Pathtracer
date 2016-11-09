/**
 * Created by fille on 08/11/16.
 */
import { Component, Input, OnChanges } from "@angular/core";
import { Object3d } from "../../models/object3d.model";
import { RenderService } from "../../services/render.service";

@Component({
  selector: 'render-settings',
  templateUrl: './render-settings.html',
  styleUrls: ['./render-settings.css']
})
export class RenderSettingsComponent {

  constructor(private _renderService: RenderService) {}

  public onMaxSamplesChange($event) {
    this._renderService.bloom($event.checked);
  }
}

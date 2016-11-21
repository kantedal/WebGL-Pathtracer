import {Component, Input, OnChanges} from "@angular/core";
import { Object3d } from "../../models/primitives/object3d.model";
import {RenderService} from "../../services/render.service";

@Component({
  selector: 'post-effects-pane',
  templateUrl: './post-effects.html',
  styleUrls: ['./post-effects.css']
})
export class PostEffectsPaneComponent {
  constructor(private _renderService: RenderService) {}

  public onBloomSwitch($event) {
    this._renderService.bloom($event.checked);
  }

  public bloomIterationsChanged(event) {
    this._renderService.bloomIterations = parseFloat((<HTMLInputElement>event.target).value);
  }

  public onBloomAlphaChange(event) {
    this._renderService.bloomAlpha = parseFloat((<HTMLInputElement>event.target).value);
  }
}

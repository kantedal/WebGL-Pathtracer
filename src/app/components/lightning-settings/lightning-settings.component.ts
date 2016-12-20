import {Component, Input, OnChanges} from "@angular/core";
import { Object3d } from "../../models/primitives/object3d.model";
import {RenderService} from "../../services/render.service";
import {NavigatorService} from "../../services/navigator.service";

@Component({
  selector: 'lightning-settings',
  templateUrl: './lightning-settings.component.html',
  styleUrls: ['./lightning-settings.component.css']
})
export class LightningSettingsComponent implements OnChanges {
  private selectedObject: Object3d;

  constructor(
    private _renderService: RenderService,
    private _navigatorService: NavigatorService
  ) {
    this._navigatorService.on(NavigatorService.OBJECT_SELECTED).subscribe(object => {
      this.selectedObject = object;
    });
  }

  public onGlobalLightningSwitch($event) {
    this._renderService.globalLightningEnabled = $event.checked;
    this._renderService.restart();
  }


  ngOnChanges() {

  }
}

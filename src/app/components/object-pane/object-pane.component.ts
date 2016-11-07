import {Component, Input, OnChanges} from "@angular/core";
import { Object3d } from "../../models/object3d.model";
import {RenderService} from "../../services/render.service";

@Component({
  selector: 'object-pane',
  templateUrl: './object-pane.component.html',
  styleUrls: ['./object-pane.component.css']
})
export class ObjectPaneComponent implements OnChanges {
  @Input() selectedObject: Object3d = new Object3d([], []);

  constructor(
    private _renderService: RenderService
  ) {
    console.log(this.selectedObject.position);
  }

  public emissionRateChanged(event) {
    let new_emission_rate = parseFloat((<HTMLInputElement>event.target).value);
    if (new_emission_rate >= 0 && new_emission_rate <= 100){
      this.selectedObject.material.emission_rate = new_emission_rate;
    }
    else {
      this.selectedObject.material.emission_rate = 0;
    }

    this._renderService.updateMaterialTexture(this.selectedObject.material);
  }

  public redChannelChanged(event) {
    let new_red = parseFloat((<HTMLInputElement>event.target).value);
    if (new_red >= 0.0 && new_red <= 1.0)
      this.selectedObject.material.color[0] = new_red;
    else 
      this.selectedObject.material.emission_rate = 0;

    this._renderService.updateMaterialTexture(this.selectedObject.material);
  }

  public greenChannelChanged(event) {
    let new_red = parseFloat((<HTMLInputElement>event.target).value);
    if (new_red >= 0.0 && new_red <= 1.0)
      this.selectedObject.material.color[1] = new_red;
    else
      this.selectedObject.material.emission_rate = 0;

    this._renderService.updateMaterialTexture(this.selectedObject.material);
  }

  public blueChannelChanged(event) {
    let new_red = parseFloat((<HTMLInputElement>event.target).value);
    if (new_red >= 0.0 && new_red <= 1.0)
      this.selectedObject.material.color[2] = new_red;
    else
      this.selectedObject.material.emission_rate = 0;

    this._renderService.updateMaterialTexture(this.selectedObject.material);
  }


  ngOnChanges() {

  }
}

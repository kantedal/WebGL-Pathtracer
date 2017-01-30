import { Component, Input, OnChanges } from "@angular/core";
import { Object3d } from "../../models/primitives/object3d.model";
import { RenderService } from "../../services/render.service";
import { NavigatorService } from "../../services/navigator.service";
import {MATERIAL_TYPES} from "../../models/materials/material.model";
import {GlossyMaterial} from "../../models/materials/glossy-material.model";
import {DiffuseMaterial} from "../../models/materials/diffuse-material.model";

@Component({
  selector: 'object-pane',
  templateUrl: './object-pane.component.html',
  styleUrls: ['./object-pane.component.css']
})
export class ObjectPaneComponent implements OnChanges {
  private selectedObject: Object3d;
  private _position: any;
  private _scale: any;
  private _color: any;
  private _materialProperties: any;
  private _materialType: number;
  private _materialTitle: string;


  constructor(
    private _renderService: RenderService,
    private _navigatorService: NavigatorService
  ) {
    this._position = {x: '0.0', y: '0.0', z: '0.0'};
    this._scale = {x: '1.0', y: '1.0', z: '1.0'};
    this._color = {red: '0.0', green: '0.0', blue: '0.0'};
    this._materialProperties = {albedo: '0.0', roughness: '0.0', shininess: '0.0'};
    this._materialType = -1;
    this._materialTitle = 'Selected material';

    this._navigatorService.on(NavigatorService.OBJECT_SELECTED).subscribe(object => {
      this.selectedObject = object;
      if (this.selectedObject != null) {
        this._position = {x: this.selectedObject.position[0].toFixed(2), y: this.selectedObject.position[1].toFixed(2), z: this.selectedObject.position[2].toFixed(2)};
        //this._scale = {x: this.selectedObject.scale[0].toFixed(2), y: this.selectedObject.scale[1].toFixed(2), z: this.selectedObject.scale[2].toFixed(2)};
        this._color = {red: this.selectedObject.material.color[0].toFixed(2), green: this.selectedObject.material.color[1].toFixed(2), blue: this.selectedObject.material.color[2].toFixed(2)};
        this._materialType = this.selectedObject.material.material_type;

        if (this._materialType == MATERIAL_TYPES.diffuse) {
          this._materialTitle = 'Diffuse material';
          let material = <DiffuseMaterial> this.selectedObject.material;
          this._materialProperties.albedo = material.albedo;
          this._materialProperties.roughness = material.roughness;
        }
        else if (this._materialType == MATERIAL_TYPES.emission) {
          this._materialTitle = 'Emission material';
        }
        else if (this._materialType == MATERIAL_TYPES.glossy) {
          this._materialTitle = 'Glossy material';
          let material = <GlossyMaterial> this.selectedObject.material;
          this._materialProperties.shininess = material.shininess;
        }
        else if (this._materialType == MATERIAL_TYPES.transmission) {
          this._materialTitle = 'Transmission material';
        }
        else if (this._materialType == MATERIAL_TYPES.specular) {
          this._materialTitle = 'Specular material';
        }
      }
    });
  }

  public emissionRateChanged(event) {
    let new_emission_rate = parseFloat((<HTMLInputElement>event.target).value);
    this.selectedObject.material.emission_rate = new_emission_rate;

    this._renderService.updateMaterialTexture(this.selectedObject.material);
  }

  public redChannelChanged(event) {
    let new_red = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_red)) {
      this.selectedObject.material.color[0] = Math.max(0.0, Math.min(1.0, new_red));
      this._color.red = Math.max(0.0, Math.min(1.0, new_red));
      this._renderService.updateMaterialTexture(this.selectedObject.material);
      this._renderService.restart();
    }
  }

  public greenChannelChanged(event) {
    let new_green = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_green)) {
      this.selectedObject.material.color[1] = Math.max(0.0, Math.min(1.0, new_green));
      this._color.green = Math.max(0.0, Math.min(1.0, new_green));
      this._renderService.updateMaterialTexture(this.selectedObject.material);
      this._renderService.restart();
    }
  }

  public blueChannelChanged(event) {
    let new_blue = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_blue)) {
      this.selectedObject.material.color[2] = Math.max(0.0, Math.min(1.0, new_blue));
      this._color.blue = Math.max(0.0, Math.min(1.0, new_blue));
      this._renderService.updateMaterialTexture(this.selectedObject.material);
      this._renderService.restart();
    }
  }

  public positionXChanged(event) {
    let new_x = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_x)) {
      this.selectedObject.position[0] = new_x;
      this._position.x = new_x;
      this._renderService.updateObjectTexture(this.selectedObject);
      this._renderService.restart();
    }
  }

  public positionYChanged(event) {
    let new_y = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_y)) {
      this.selectedObject.position[1] = new_y;
      this._position.y = new_y;
      this._renderService.updateObjectTexture(this.selectedObject);
      this._renderService.restart();
    }
  }

  public positionZChanged(event) {
    let new_z = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_z)) {
      this.selectedObject.position[2] = new_z;
      this._position.z = new_z;
      this._renderService.updateObjectTexture(this.selectedObject);
      this._renderService.restart();
    }
  }

  public scaleXChanged(event) {
    let new_x = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_x)) {
      this.selectedObject.scale[0] = new_x;
      this._scale.x = new_x;
      this._renderService.updateObjectTexture(this.selectedObject);
      this._renderService.restart();
    }
  }

  public scaleYChanged(event) {
    let new_y = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_y)) {
      this.selectedObject.scale[1] = new_y;
      this._scale.y = new_y;
      this._renderService.updateObjectTexture(this.selectedObject);
      this._renderService.restart();
    }
  }

  public scaleZChanged(event) {
    let new_z = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_z)) {
      this.selectedObject.scale[2] = new_z;
      this._scale.z = new_z;
      this._renderService.updateObjectTexture(this.selectedObject);
      this._renderService.restart();
    }
  }

  public shininessChanged(event) {
    let new_shininess = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_shininess)) {
      let material = <GlossyMaterial> this.selectedObject.material;
      material.shininess = new_shininess;
      this._materialProperties.shininess = new_shininess;
      this._renderService.updateMaterialTexture(this.selectedObject.material);
      this._renderService.restart();
    }
  }

  public roughnessChanged(event) {
    let new_roughness = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_roughness)) {
      let material = <DiffuseMaterial> this.selectedObject.material;
      material.roughness = new_roughness;
      this._materialProperties.roughness = new_roughness;
      this._renderService.updateMaterialTexture(this.selectedObject.material);
      this._renderService.restart();
    }
  }

  public albedoChanged(event) {
    let new_albedo = parseFloat((<HTMLInputElement>event.target).value);
    if (!isNaN(new_albedo)) {
      let material = <DiffuseMaterial> this.selectedObject.material;
      material.albedo = new_albedo;
      this._materialProperties.albedo = new_albedo;
      this._renderService.updateMaterialTexture(this.selectedObject.material);
      this._renderService.restart();
    }
  }

  ngOnChanges() {

  }
}

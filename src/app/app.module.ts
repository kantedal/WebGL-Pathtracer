import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RenderService } from "./services/render.service";
import { MaterialModule } from "@angular/material";
import { ObjectPaneComponent } from "./components/object-pane/object-pane.component";
import { NavigatorService } from "./services/navigator.service";
import { PostEffectsPaneComponent } from "./components/post-effects-pane/post-effects-pane.component";
import { RenderSettingsComponent } from "./components/render-settings/render-settings.component";
import { SceneLoaderService } from "./services/scene-loader.service";
import { LightningSettingsComponent } from "./components/lightning-settings/lightning-settings.component";
import { LoaderDialog } from "./components/loader.component";

@NgModule({
  declarations: [
    AppComponent,
    ObjectPaneComponent,
    PostEffectsPaneComponent,
    RenderSettingsComponent,
    LightningSettingsComponent,
    LoaderDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [
    NavigatorService,
    RenderService,
    SceneLoaderService,
  ],
  entryComponents: [
    LoaderDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

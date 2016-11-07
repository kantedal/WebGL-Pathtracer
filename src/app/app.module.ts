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

@NgModule({
  declarations: [
    AppComponent,
    ObjectPaneComponent,
    PostEffectsPaneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [
    NavigatorService,
    RenderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

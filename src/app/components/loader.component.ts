import { Component } from "@angular/core";
import { MdDialogRef } from "@angular/material";

@Component({
  selector: 'loader-dialog',
  template: `
  <!--<h1 md-dialog-title>Would you like to order pizza?</h1>-->
    <div style='font-family: Roboto, "Helvetica Neue", sans-serif;'>Building scene</div>
    <md-spinner style="width:70px; margin-left: auto; margin-right: auto;"></md-spinner>
  `
})
export class LoaderDialog {
  constructor(public dialogRef: MdDialogRef<LoaderDialog>) { }
}

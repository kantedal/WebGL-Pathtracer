import 'hammerjs';
import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {PathTracer} from "./models/pathtracer.model";
import {RenderService} from "./services/render.service";

declare var ProgressBar: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  private progressBar: any;

  constructor(private renderService: RenderService) {
  }

  ngAfterViewInit() {
    this.renderService.init();
    this.progressBar = new ProgressBar.Circle('#render-progress-container', {
      color: '#aaa',
      strokeWidth: 7,
      trailWidth: 7,
      easing: 'easeInOut',
      duration: 100,
      text: {
        autoStyleContainer: false
      },
      from: { color: '#ff4081', width: 7 },
      to: { color: '#ff4081', width: 7 },
      step: (state, circle) => {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value === 0) {
          circle.setText('0%');
        } else {
          circle.setText(value + '%');
        }

      }
    });
    this.progressBar.text.style.fontFamily = '"Roboto", Helvetica, sans-serif';
    this.progressBar.text.style.fontWeight = '200';
    this.progressBar.text.style.fontSize = '12pt';

    setInterval(() => {
      this.progressBar.animate(this.renderService.renderCompletion)
    }, 100);
  }

  title = 'app works!';
}

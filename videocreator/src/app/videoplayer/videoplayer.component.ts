import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent {
  preload: string = 'auto';
  api: VgApiService = new VgApiService();

  onPlayerReady(sourse: VgApiService) {
    this.api = sourse;
    this.api
      .getDefaultMedia()
      .subscriptions.loadedData.subscribe(this.autoplay.bind(this));
  }

  autoplay() {
    this.api.play();
  }
}

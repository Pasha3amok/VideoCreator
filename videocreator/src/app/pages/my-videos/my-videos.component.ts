import { Component } from '@angular/core';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.scss',
})
export class MyVideosComponent {
  videos = [
    { src: '../assets/video/vid.mp4' },
    { src: '../assets/video/vid2.mp4' },
  ];

  // Поточне вибране відео
  selectedVideo: { src: string } | null = null;

  // Індекс активного відео
  activeIndex: number | null = null;

  // Метод вибору відео
  selectVideo(video: { src: string }, index: number): void {
    this.selectedVideo = video;
    this.activeIndex = index;
  }
}

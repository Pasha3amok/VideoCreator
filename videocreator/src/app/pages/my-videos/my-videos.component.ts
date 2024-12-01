import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { VideosModel } from '../../model/Interfaces';
import { map } from 'rxjs';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.scss',
})
export class MyVideosComponent implements OnInit {
  masterService = inject(MasterService);
  videoObj: VideosModel[] = [];
  videos = [{ src: '' }];

  // Поточне вибране відео
  selectedVideo: { src: string } | null = null;

  // Індекс активного відео
  activeIndex: number | null = null;

  ngOnInit(): void {
    this.loadVideosByAuthorId(0);
  }

  loadVideosByAuthorId(authorId: number): void {
    // Фільтруємо API за автором
    this.masterService
      .getAllVideos()
      .pipe(
        map((res: VideosModel[]) => {
          this.videoObj = res.filter(
            (item) => item.author_id === authorId && item.status === 'completed'
          );
        })
      )
      .subscribe((res) => {
        this.videos = this.videoObj.map((item) => ({
          src: `${this.masterService.apiUrl}video_file/${item.id}`,
        }));
      });
  }
  // Метод вибору відео
  selectVideo(video: { src: string }, index: number): void {
    this.selectedVideo = video;
    this.activeIndex = index;
  }
}

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { VideosModel, VideoStatusModel } from '../../model/Interfaces';
import { forkJoin, interval, map, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.scss',
})
export class MyVideosComponent implements OnInit, OnDestroy {
  masterService = inject(MasterService);
  videoObj: VideosModel[] = [];
  incompleteVideos: VideosModel[] = [];
  videos = [{ src: '' }];

  // Поточне вибране відео
  selectedVideo: { src: string } | null = null;

  // Індекс активного відео
  activeIndex: number | null = null;

  private incompleteVideosIntervalSubscription: Subscription =
    new Subscription();

  ngOnInit(): void {
    this.loadVideosByAuthorId(0);
  }
  ngOnDestroy(): void {
    this.incompleteVideosIntervalSubscription?.unsubscribe();
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
  private checkIncompleteVideos(): void {
    this.incompleteVideos = this.videoObj.filter(
      (video) => video.status !== 'completed'
    );

    if (!this.incompleteVideos.length) {
      this.incompleteVideosIntervalSubscription?.unsubscribe();
      return;
    }

    const incompleteVideosObservables = this.incompleteVideos.map((video) =>
      this.masterService.getVideoStatus(video.id)
    );

    this.incompleteVideosIntervalSubscription = interval(5000)
      .pipe(switchMap(() => forkJoin(incompleteVideosObservables)))
      .subscribe((videosStatuses: VideoStatusModel[]) => {
        this.incompleteVideos = this.incompleteVideos.filter((video, index) => {
          if (videosStatuses[index].status === 'completed') {
            const videoObjIndex = this.videoObj.findIndex(
              (v) => v.id === video.id
            );

            if (videoObjIndex !== -1) {
              this.videoObj[videoObjIndex] = { ...video, status: 'completed' };
              this.videos[videoObjIndex] = {
                src: `${this.masterService.apiUrl}video_file/${video.id}`,
              };
            }

            return false;
          }
          return true;
        });

        if (!this.incompleteVideos.length) {
          this.incompleteVideosIntervalSubscription?.unsubscribe();
        }
      });
  }
}

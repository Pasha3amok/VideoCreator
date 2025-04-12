import { User } from './../../model/Interfaces';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MasterService } from '../../service/master.service';
import {
  GenerateVideoModel,
  VideosModel,
  VideoStatusModel,
} from '../../model/Interfaces';
import { forkJoin, interval, map, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.scss',
})
export class MyVideosComponent implements OnInit, OnDestroy {
  masterService = inject(MasterService);
  router = inject(Router);
  videoObj: VideosModel[] = [];
  incompleteVideos: VideosModel[] = [];
  user: User = new User();
  videos = [{ src: '' }];
  loggedUserData: User = new User();

  selectedVideo: { src: string } | null = null;
  activeIndex: number | null = null;

  private incompleteVideosIntervalSubscription: Subscription =
    new Subscription();

  ngOnInit(): void {
    const isUser = localStorage.getItem('User');
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }
    this.loadVideosByAuthorId(this.getUserId());
  }
  ngOnDestroy(): void {
    this.incompleteVideosIntervalSubscription?.unsubscribe();
  }

  loadVideosByAuthorId(authorId: number): void {
    this.masterService
      .getVideosByAuthor(authorId)
      .subscribe((res: VideosModel[]) => {
        this.videoObj = res;
        this.videos = this.videoObj.map((item) => ({
          src: `${this.masterService.apiUrl}video_file/${item.id}`,
        }));
      });
  }
  getUserId(): number {
    const userId = this.loggedUserData.id;
    if (userId) {
      return userId;
    } else {
      alert('Ви не зареєстровані!');
      this.router.navigate(['/home']);
      return 0;
    }
  }

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

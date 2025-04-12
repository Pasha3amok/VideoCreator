import { CommonModule } from '@angular/common';
import {
  APIResponseModel,
  GenerateVideoModel,
  Settings,
  VideoInfoModel,
  VideosModel,
} from '../../model/Interfaces';
import { MasterService } from './../../service/master.service';
import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  interval,
  map,
  Observable,
  Subscription,
  switchMap,
  takeWhile,
} from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  masterService = inject(MasterService);
  videoSettings: GenerateVideoModel = new GenerateVideoModel();
  settingsData$: Observable<Settings> = new Observable<Settings>();
  subscriptionList: Subscription[] = [];
  videoId: string = '';
  videoUrl: string = '';
  authorId = 0;

  ngOnInit(): void {
    console.log(this.videoUrl);
    this.settingsData$ = this.masterService.getSettings();
  }

  onGenerate() {
    this.subscriptionList.push(
      this.masterService
        .generateVideo(this.videoSettings)
        .subscribe((res: APIResponseModel) => {
          if (res.status === 'accepted') {
            this.videoId = res.name;
            this.pollStatus();
            this.videoSettings.userId = this.authorId;
            alert(res.message);
          } else {
            alert(res.status);
          }
        })
    );
  }

  pollStatus(): void {
    interval(2000)
      .pipe(
        switchMap(() => this.masterService.getVideoStatus(this.videoId!)),
        takeWhile((res: APIResponseModel) => res.status !== 'completed', true)
      )
      .subscribe((res: APIResponseModel) => {
        if (res.status === 'completed') {
          this.videoUrl = `${this.masterService.apiUrl}video_file/${this.videoId}`;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub) => sub.unsubscribe());
  }
}

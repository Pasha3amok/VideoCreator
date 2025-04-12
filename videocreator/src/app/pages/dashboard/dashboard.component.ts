import { CommonModule } from '@angular/common';
import {
  APIResponseModel,
  GenerateVideoModel,
  Settings,
  User,
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  masterService = inject(MasterService);
  router = inject(Router);
  videoSettings: GenerateVideoModel = new GenerateVideoModel();
  settingsData$: Observable<Settings> = new Observable<Settings>();
  subscriptionList: Subscription[] = [];
  loggedUserData: User | null = null;
  videoId: string = '';
  videoUrl: string = '';

  ngOnInit(): void {
    const isUser = localStorage.getItem('User');
    if (isUser != null) {
      this.loggedUserData = JSON.parse(isUser);
    } else {
      alert('Будь ласка, увійдіть для генерації відео.');
    }
    this.settingsData$ = this.masterService.getSettings();
  }

  onGenerate() {
    if (!this.loggedUserData || !this.loggedUserData.id) {
      alert('Помилка: не вдалося визначити ID користувача.');
      return;
    }
    const currentUserId = this.loggedUserData.id;

    this.subscriptionList.push(
      this.masterService
        .generateVideo(this.videoSettings, currentUserId)
        .subscribe((res: APIResponseModel) => {
          if (res.status === 'accepted') {
            this.videoId = res.name;
            this.pollStatus();
            alert(res.message);
          } else {
            alert(res.status);
          }
        })
    );
  }

  onTextGenerate() {}

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

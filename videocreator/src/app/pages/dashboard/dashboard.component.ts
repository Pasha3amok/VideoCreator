import { CommonModule, JsonPipe } from '@angular/common';
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
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  interval,
  map,
  Observable,
  Subscription,
  switchMap,
  takeWhile,
} from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsForm } from '../../form/settings-form/settings-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardComponent implements OnInit {
  masterService = inject(MasterService);
  router = inject(Router);
  videoSettings: SettingsForm = new SettingsForm();
  settingsData$: Observable<Settings> = new Observable<Settings>();
  subscriptionList: Subscription[] = [];
  loggedUserData: User | null = null;
  videoId = signal<string>('');
  videoUrl = signal<string>('');

  @ViewChild('videoElem') videoElem: ElementRef | undefined;

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
        .generateVideo(this.videoSettings.value, currentUserId)
        .subscribe((res: APIResponseModel) => {
          if (res.status === 'accepted') {
            this.videoId.set(res.name);
            this.pollStatus();
            alert(res.message);
          } else {
            alert(res.status);
          }
        })
    );
  }

  onGenerateText() {
    var language = this.videoSettings.controls.language;
    if (language.value == 'uk') {
      language.setValue('ua');
    }
    if (!language) {
      alert('Вкажіть мову в налаштуваннях');
      return;
    }
    this.subscriptionList.push(
      this.masterService
        .getText(
          this.videoSettings.controls.text.value!,
          this.videoSettings.controls.language.value!
        )
        .subscribe((res: string) => {
          this.videoSettings.controls.text.setValue(res);
        })
    );
  }

  pollStatus(): void {
    interval(2000)
      .pipe(
        switchMap(() => this.masterService.getVideoStatus(this.videoId()!)),
        takeWhile((res: APIResponseModel) => res.status !== 'completed', true)
      )
      .subscribe((res: APIResponseModel) => {
        if (res.status === 'completed') {
          this.videoUrl.set(
            `${this.masterService.apiUrl}video_file/${this.videoId()}`
          );
        } else {
          return;
        }
      });
  }
  public get currentVideoStyles(): { [key: string]: string } {
    const orientation = this.videoSettings.controls.orientation.value;

    if (orientation === 'landscape') {
      return {
        width: '70%',
        height: '70%',
      };
    } else if (orientation === 'portrait') {
      return {
        width: '25%',
        height: '70%',
      };
    } else {

      return {
        width: 'auto',
        height: 'auto',
      };
    }
  }

  toggleOrientationLand() {
    this.videoSettings.controls.orientation.setValue('landscape');
  }

  toggleOrientationPort() {
    this.videoSettings.controls.orientation.setValue('portrait');
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub) => sub.unsubscribe());
  }
}

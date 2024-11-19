import { CommonModule } from '@angular/common';
import { APIResponseModel, GenerateVideoModel, Video } from '../../model/Video';
import { MasterService } from './../../service/master.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { VideoplayerComponent } from '../../videoplayer/videoplayer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, VideoplayerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  masterService = inject(MasterService);
  video = signal<Video[]>([]);
  videoList$: Observable<Video[]> = new Observable<Video[]>();
  videoSettings: GenerateVideoModel = new GenerateVideoModel();

  ngOnInit(): void {}

  generateVideo(paramsOfVideo: GenerateVideoModel) {
    this.masterService.generateVideo(paramsOfVideo).subscribe({
      next: (data) => {
        console.log('Video generation started:', data);
        console.log('Video ID:', data.videoId);
      },
    });
  }

  getVideoById(id: string) {
    debugger;
    this.masterService.getVideoById(id).subscribe((result: Video) => {
      console.log(JSON.stringify(result.data));
    });
  }

  onGenerate() {
    debugger;
    this.masterService
      .generateVideo(this.videoSettings)
      .subscribe((res: APIResponseModel) => {
        if (res.status === 'accepted') {
          alert('Genirationration Success');
        } else {
          alert(res.status);
        }
      });
  }
}

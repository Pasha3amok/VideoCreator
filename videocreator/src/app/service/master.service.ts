import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponseModel, GenerateVideoModel, Video } from '../model/Video';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  apiUrl: string = 'http://178.74.202.86:54108/';
  http = inject(HttpClient);

  constructor() {}

  generateVideo(
    paramsOfVideo: GenerateVideoModel
  ): Observable<APIResponseModel> {
    const url = `${this.apiUrl}generate_video`;
    return this.http.post<APIResponseModel>(url, paramsOfVideo);
  }

  getVideoById(videoId: string): Observable<Video> {
    const url = `${this.apiUrl}videos/${videoId}`;
    return this.http.get<Video>(url);
  }
}

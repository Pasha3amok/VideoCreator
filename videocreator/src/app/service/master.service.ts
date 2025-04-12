import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIResponseModel,
  GenerateVideoModel,
  LoginModel,
  LoginResponse,
  Settings,
  User,
  VideoInfoModel,
  VideosModel,
  VideoStatusModel,
} from '../model/Interfaces';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  // apiUrl: string = 'http://178.74.202.86:54108/';
  apiUrl: string = 'http://127.0.0.1:8000/';
  http = inject(HttpClient);

  constructor() {}

  generateVideo(
    paramsOfVideo: GenerateVideoModel,
    authorId: number
  ): Observable<APIResponseModel> {
    const url = `${this.apiUrl}generate_video/${authorId}`;
    return this.http.post<APIResponseModel>(url, paramsOfVideo);
  }
  // getText(): Observable<VideoStatusModel> {
  //   const url = `${this.apiUrl}video_status/${viseoId}`;
  //   return this.http.get<VideoStatusModel>(url);
  // }
  getSettings(): Observable<Settings> {
    const url = `${this.apiUrl}settings`;
    return this.http.get<Settings>(url);
  }
  getVideoStatus(viseoId: string): Observable<VideoStatusModel> {
    const url = `${this.apiUrl}video_status/${viseoId}`;
    return this.http.get<VideoStatusModel>(url);
  }
  getVideoInfo(viseoId: string): Observable<VideoInfoModel> {
    const url = `${this.apiUrl}video_info/${viseoId}`;
    return this.http.get<VideoInfoModel>(url);
  }
  getAllVideos(): Observable<VideosModel[]> {
    const url = `${this.apiUrl}all_videos?include_with_error_status=false`;
    return this.http.get<VideosModel[]>(url);
  }
  getVideosByAuthor(authorId: number): Observable<VideosModel[]> {
    const url = `${this.apiUrl}get_videos_by_author/${authorId}?include_with_error_status=false`;
    return this.http.get<VideosModel[]>(url);
  }
  registerNewUser(obj: User): Observable<User> {
    const url = `${this.apiUrl}register_user?name=${obj.name}&email=${obj.email}&password=${obj.password}`;
    return this.http.post<User>(url, obj);
  }
  loginUser(obj: LoginModel): Observable<LoginResponse> {
    const url = `${this.apiUrl}login_user?email=${obj.email}&password=${obj.password}`;
    return this.http.post<LoginResponse>(url, obj);
  }
}

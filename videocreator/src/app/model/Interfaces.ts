export interface APIResponseModel {
  status: string;
  name: string;
  message?: string;
}

export class User {
  name: string;
  email: string;
  password: string;
  id?: number;

  constructor() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.id = undefined;
  }
}

export class LoginModel {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}

export interface VideoStatusModel {
  status: string;
  name: string;
  message?: string;
}
export interface VideoInfoModel {
  status: string;
  id: string;
  author_id: number;
  details: {};
}

export class GenerateVideoModel {
  text?: string;
  language: string;
  speaker: string;
  quality: string;
  orientation: string;
  volume: number;

  constructor() {
    this.text = '';
    this.language = '';
    this.speaker = '';
    this.quality = '';
    this.orientation = '';
    this.volume = 0.1;
  }
}

export interface Settings {
  language: string[];
  speaker: string[];
  volume: number[];
}

export interface VideosModel {
  details: any;
  author_id: number;
  id: string;
  status: string;
}

export interface LoginResponse {
  password: string;
  id: number;
  name: string;
  email: string;
}

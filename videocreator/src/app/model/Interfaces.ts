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

  /**
   *
   */
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

  /**
   *
   */
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

export class GenerateVideoModel {
  userId: number;
  text?: string;
  language: string;
  speaker_wav: string;
  volume: number;

  constructor() {
    this.userId = 0;
    this.text = '';
    this.language = '';
    this.speaker_wav = '';
    this.volume = 0.1;
  }
}

export interface Settings {
  language: string[];
  speaker_wav: string[];
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

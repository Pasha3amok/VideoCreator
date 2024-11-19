export interface APIResponseModel {
  status: string;
  videoId: number;
  massage: string;
}

export interface Video {
  videoId: string;
  data: any;
}
export class GenerateVideoModel {
  text: string;
  language: string;
  speaker_wav: string;
  volume: number;

  constructor() {
    this.text = '';
    this.language = '';
    this.speaker_wav = '';
    this.volume = 0;
  }
}

export interface VideoStatus {
  videoId: number;
  status: string;
}

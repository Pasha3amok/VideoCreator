import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  darkMode = signal<string>(
    localStorage.getItem('theme') ?? 'light'
  );

  updateDarkMode(){
    this.darkMode.update(value => (value === "dark" ? "light" : "dark"))
  }
  

  constructor() {
    effect(() =>{
      localStorage.setItem('theme',JSON.stringify(this.darkMode()));
      document.documentElement.setAttribute('data-bs-theme', this.darkMode());
    });

    document.documentElement.setAttribute('data-bs-theme', this.darkMode());

   }
}

import { MasterService } from './service/master.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import {
  LoginModel,
  LoginResponse,
  User,
  VideosModel,
} from './model/Interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'videocreator';
  masterService = inject(MasterService);
  registerObj: User = new User();
  loginObj: LoginModel = new LoginModel();
  loggedUserData: User = new User();

  @ViewChild('registerModal') registerModal: ElementRef | undefined;
  @ViewChild('loginModal') loginModal: ElementRef | undefined;

  ngOnInit(): void {
    const isUser = localStorage.getItem('User');
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }
  }
  openRegisterModel() {
    this.closeLoginModel();
    if (this.registerModal) {
      this.registerModal.nativeElement.style.display = 'block';
    }
  }
  closeRegisterModel() {
    if (this.registerModal) {
      this.registerModal.nativeElement.style.display = 'none';
    }
  }
  openLoginModel() {
    this.closeRegisterModel();
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = 'block';
    }
  }
  closeLoginModel() {
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = 'none';
    }
  }
  onRegister() {
    this.masterService.registerNewUser(this.registerObj).subscribe();
    this.closeRegisterModel();
  }
  onLogin() {
    this.masterService
      .loginUser(this.loginObj)
      .subscribe((res: LoginResponse) => {
        localStorage.setItem('User', JSON.stringify(res));
        this.closeLoginModel();
      });
  }
  logOut() {
    localStorage.removeItem('User');
    this.loggedUserData = new User();
  }
}

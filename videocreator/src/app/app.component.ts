import { MasterService } from './service/master.service';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {
  GenerateVideoModel,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'videocreator';
  masterService = inject(MasterService);
  router = inject(Router);
  registerObj: User = new User();
  loginObj: LoginModel = new LoginModel();
  loggedUserData: User = new User();

  @ViewChild('registerModal') registerModal: ElementRef | undefined;
  @ViewChild('loginModal') loginModal: ElementRef | undefined;

  ngOnInit(): void {
    this.checkIsUser();
  }
  checkIsUser() {
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
    this.masterService
      .registerNewUser(this.registerObj)
      .subscribe((res: User) => {
        localStorage.setItem('User', JSON.stringify(res));
        this.checkIsUser();
        this.closeRegisterModel();
      });
    this.router.navigate(['/home']);
  }
  onLogin() {
    this.masterService
      .loginUser(this.loginObj)
      .subscribe((res: LoginResponse) => {
        localStorage.setItem('User', JSON.stringify(res));
        this.checkIsUser();
        this.closeLoginModel();
      });
    this.router.navigate(['/home']);
  }
  logOut() {
    localStorage.removeItem('User');
    this.loggedUserData = new User();
  }
}

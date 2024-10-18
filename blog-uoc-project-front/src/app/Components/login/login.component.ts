import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { HeaderMenus } from 'src/app/Models/header-menus.dto'; 
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: any = {}; 
  loginForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    // Inicializar el formulario con validaciones
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    });
  }

  ngOnInit(): void {}

  async login(): Promise<void> {
    let responseOK: boolean = false;
    let errorResponse: any;

    // Asignar valores a loginUser
    this.loginUser.email = this.loginForm.get('email')?.value;
    this.loginUser.password = this.loginForm.get('password')?.value;

    try {
      const authToken = await this.authService.login(this.loginUser);
      responseOK = true;
      this.loginUser.user_id = authToken.user_id;
      this.loginUser.access_token = authToken.access_token;

      // Guardar token en localStorage
      this.localStorageService.set('user_id', this.loginUser.user_id);
      this.localStorageService.set('access_token', this.loginUser.access_token);
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;

      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);

      this.sharedService.errorLog(error.error);
    }

    await this.sharedService.managementToast('loginFeedback', responseOK, errorResponse);

    if (responseOK) {
      const headerInfo: HeaderMenus = {
        showAuthSection: true,
        showNoAuthSection: false,
      };
      this.headerMenusService.headerManagement.next(headerInfo);
      this.router.navigateByUrl('home');
    }
  }
}

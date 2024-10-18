import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { formatDate } from '@angular/common';

export interface UserDTO {
  name: string;
  surname_1: string;
  surname_2: string; 
  alias: string;
  birth_date: Date;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerUser: UserDTO;
  isValidForm: boolean | null;
  registerForm: FormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private router: Router
  ) {
    // Inicializando variables
    this.registerUser = {} as UserDTO; // Inicializa registerUser
    this.isValidForm = null; // Inicializa isValidForm

    // Definiendo el formulario reactivo
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
      surname_1: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
      surname_2: ['', [Validators.minLength(5), Validators.maxLength(25)]], // Opcional
      alias: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
      birth_date: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    });
  }

  ngOnInit(): void {}

  async register(): Promise<void> {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;

    try {
      await this.userService.register(this.registerUser);
      responseOK = true;
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;

      const headerInfo = {
        showAuthSection: false,
        showNoAuthSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);
      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'registerFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      // Reset the form
      this.registerForm.reset();
      birth_date: new Date(this.registerForm.value.birth_date), 
            this.router.navigateByUrl('home');
    }
  }
}

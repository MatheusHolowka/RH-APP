import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TenantService } from '../../../tenant/services/tenant.service';
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { switchMap } from 'rxjs';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ThemeToggleComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // Injeção de Serviços
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  // Formulários
  loginForm: FormGroup;
  registerForm: FormGroup;

  // Estado da Animação
  isToggled = false;
  isGx = false;

  // Mensagens de Erro
  loginError: string | null = null;
  registerError: string | null = null;

  constructor() {
    // Formulário de Login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });

    // Formulário de Registro
    this.registerForm = this.fb.group({
      nomeEmpresa: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Lógica de Animação
  changeForm() {
    this.isToggled = !this.isToggled;
    this.isGx = true;
    setTimeout(() => {
      this.isGx = false;
    }, 1500);
  }

  // Lógica de Login
  onLogin() {
    if (this.loginForm.invalid) return;
    this.loginError = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loginError = err.error.message || 'Falha no login';
      },
    });
  }

  // Lógica de Registro (Multi-Tenant)
  onRegister() {
    if (this.registerForm.invalid) return;
    this.registerError = null;

    const { nomeEmpresa, nome, email, senha } = this.registerForm.value;

    // 1. Cria o Tenant
    this.tenantService
      .create({ nomeEmpresa })
      .pipe(
        // 2. Usa o ID do novo Tenant para registrar o Usuário Admin
        switchMap((tenant) => {
          const tenantId = tenant.id;
          
          // --- ALTERAÇÃO AQUI: Usamos .register() (rota pública) ---
          return this.usuarioService.register({
            nome,
            email,
            senha,
            tenantId,
            role: 'ADMIN_TENANT',
          });
        })
      )
      .subscribe({
        next: () => {
          // 3. Sucesso! Faz o login automático
          this.authService.login({ email, senha }).subscribe({
            next: () => this.router.navigate(['/home']),
          });
        },
        error: (err) => {
          this.registerError = err.error.message || 'Falha ao criar conta';
        },
      });
  }
}
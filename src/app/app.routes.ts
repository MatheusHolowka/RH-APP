import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './core/components/home/home.component';
import { authGuard } from './auth/guards/auth.guard';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { TemplateListComponent } from './template/components/template-list/template-list.component';
import { TemplateDetailComponent } from './template/components/template-detail/template-detail.component';
import { UsuarioListComponent } from './usuario/components/usuario-list/usuario-list.component';
// 1. IMPORTE O COMPONENTE AQUI
import { MyTasksComponent } from './core/components/my-tasks/my-tasks.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'templates',
        component: TemplateListComponent,
      },
      {
        path: 'templates/:id',
        component: TemplateDetailComponent,
      },
      {
        path: 'usuarios',
        component: UsuarioListComponent,
      },
      // 2. ADICIONE A NOVA ROTA AQUI
      {
        path: 'minhas-tarefas',
        component: MyTasksComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];
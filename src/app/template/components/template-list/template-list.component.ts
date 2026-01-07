import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router'; // 1. IMPORTE O RouterLink AQUI
import { TemplateChecklistService } from '../../services/template-checklist.service';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  Validators 
} from '@angular/forms';

@Component({
  selector: 'app-template-list',
  standalone: true,
  // 2. ADICIONE O RouterLink AQUI
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss'
})
export class TemplateListComponent implements OnInit {
  // Serviços
  private templateService = inject(TemplateChecklistService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Signals de Estado
  public isLoading = signal(true);
  public templates = signal<any[]>([]);
  public createError = signal<string | null>(null);

  // Formulário de Criação
  public templateForm = this.fb.group({
    titulo: ['', Validators.required],
    descricao: ['']
  });

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading.set(true);
    this.templateService.getTemplates().subscribe({
      next: (data) => {
        this.templates.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar templates', err);
        this.isLoading.set(false);
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.templateForm.invalid) {
      return;
    }
    
    this.createError.set(null);
    const formData = this.templateForm.value as { titulo: string, descricao?: string };

    this.templateService.createTemplate(formData).subscribe({
      next: (newTemplate) => {
        // Adiciona o novo template à lista (UI otimista)
        this.templates.update(current => [newTemplate, ...current]);
        this.templateForm.reset(); // Limpa o formulário
      },
      error: (err) => {
        this.createError.set(err.error.message || 'Erro ao criar template');
      }
    });
  }

  onDelete(id: string): void {
    if (!confirm('Tem certeza que deseja deletar este template?')) {
      return;
    }

    this.templateService.deleteTemplate(id).subscribe({
      next: () => {
        // Remove o template da lista (UI otimista)
        this.templates.update(current => 
          current.filter(template => template.id !== id)
        );
      },
      error: (err) => {
        alert(err.error.message || 'Erro ao deletar template');
      }
    });
  }
}
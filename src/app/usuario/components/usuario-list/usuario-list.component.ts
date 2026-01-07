import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { TemplateChecklistService } from '../../../template/services/template-checklist.service';
import { ProcessoService } from '../../../processo/services/processo.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss',
})
export class UsuarioListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private templateService = inject(TemplateChecklistService);
  private processoService = inject(ProcessoService);
  private fb = inject(FormBuilder);

  public isLoading = signal(true);
  public usuarios = signal<any[]>([]);
  public errorMsg = signal<string | null>(null);

  // Signals para o Modal e Dropdown
  public showModal = signal(false);
  public selectedUserId = signal<string | null>(null);
  public templates = signal<any[]>([]);
  public selectedTemplateId = signal<string>('');

  // --- NOVO: Signal para controlar visibilidade do dropdown customizado ---
  public isDropdownOpen = signal(false);

  public userForm = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    role: ['MEMBRO', Validators.required],
  });

  // --- NOVO: Getter para exibir o nome do template selecionado ---
  get selectedTemplateLabel(): string {
    const id = this.selectedTemplateId();
    if (!id) return 'Selecione um modelo...';

    const template = this.templates().find((t) => t.id === id);
    return template ? template.titulo : 'Selecione um modelo...';
  }

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.isLoading.set(true);
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    this.errorMsg.set(null);

    this.usuarioService.create(this.userForm.value).subscribe({
      next: (newUser) => {
        this.usuarios.update((list) => [newUser, ...list]);
        this.userForm.reset({ role: 'MEMBRO' });
      },
      error: (err: any) => {
        this.errorMsg.set(err.error.message || 'Erro ao criar usuário');
      },
    });
  }

  onDelete(id: string) {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;

    this.usuarioService.delete(id).subscribe({
      next: () => {
        this.usuarios.update((list) => list.filter((u) => u.id !== id));
      },
      error: (err: any) => alert('Erro ao deletar usuário'),
    });
  }

  openAssignModal(userId: string) {
    this.selectedUserId.set(userId);
    this.selectedTemplateId.set('');
    this.isDropdownOpen.set(false); // Garante que começa fechado
    this.showModal.set(true);

    if (this.templates().length === 0) {
      this.templateService.getTemplates().subscribe({
        next: (data) => this.templates.set(data),
        error: () => alert('Erro ao carregar templates'),
      });
    }
  }

  // --- NOVOS MÉTODOS PARA O SELECT CUSTOMIZADO ---

  toggleDropdown() {
    this.isDropdownOpen.update((val) => !val);
  }

  selectTemplate(id: string) {
    this.selectedTemplateId.set(id);
    this.isDropdownOpen.set(false); // Fecha ao selecionar
  }

  // -----------------------------------------------

  assignProcess() {
    const templateId = this.selectedTemplateId();
    const userId = this.selectedUserId();

    if (!templateId || !userId) return;

    const template = this.templates().find((t) => t.id === templateId);
    if (!template) return;

    this.processoService
      .create({
        titulo: `Onboarding - ${template.titulo}`,
        templateId: templateId,
        responsavelId: userId,
      })
      .subscribe({
        next: () => {
          alert('Processo iniciado e tarefas atribuídas com sucesso!');
          this.showModal.set(false);
        },
        error: (err: any) => {
          console.error(err);
          alert('Erro ao iniciar processo.');
        },
      });
  }
}

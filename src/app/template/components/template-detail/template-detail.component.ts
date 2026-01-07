import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // 1. Importe ActivatedRoute e RouterLink
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'; // 2. Importe Forms
import { TemplateChecklistService } from '../../services/template-checklist.service';
import { TemplateItemService } from '../../services/template-item.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // 3. Adicione os imports
  templateUrl: './template-detail.component.html',
  styleUrl: './template-detail.component.scss'
})
export class TemplateDetailComponent implements OnInit {
  // Serviços
  private route = inject(ActivatedRoute);
  private templateService = inject(TemplateChecklistService);
  private itemService = inject(TemplateItemService);
  private fb = inject(FormBuilder);

  // Estado
  public template = signal<any>(null);
  public items = signal<any[]>([]);
  public isLoading = signal(true);
  public createError = signal<string | null>(null);
  private templateId: string = '';

  // Formulário de Criação de Item
  public itemForm = this.fb.group({
    tituloTarefa: ['', Validators.required],
    descricao: [''],
    ordem: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    // 1. Pega o ID da URL
    this.templateId = this.route.snapshot.paramMap.get('id')!;
    if (!this.templateId) {
      // (Opcional: redirecionar se não tiver ID)
      return;
    }
    
    // 2. Carrega tudo
    this.loadTemplateDetails();
    this.loadItems();
  }

  loadTemplateDetails(): void {
    this.templateService.getTemplateById(this.templateId).subscribe({
      next: (data) => this.template.set(data),
      error: (err) => console.error('Erro ao buscar template', err)
    });
  }

  loadItems(): void {
    this.isLoading.set(true);
    this.itemService.getItems(this.templateId).subscribe({
      next: (data) => {
        this.items.set(data);
        this.isLoading.set(false);
        // Seta a 'ordem' do próximo item
        this.itemForm.patchValue({ ordem: data.length });
      },
      error: (err) => {
        console.error('Erro ao buscar itens', err);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) return;
    this.createError.set(null);

    const formData = this.itemForm.value as { tituloTarefa: string, descricao?: string, ordem: number };

    this.itemService.createItem(this.templateId, formData).subscribe({
      next: (newItem) => {
        // Adiciona o novo item na lista
        this.items.update(current => [...current, newItem]);
        // Limpa o form e incrementa a 'ordem'
        this.itemForm.reset({ ordem: this.items().length, tituloTarefa: '', descricao: '' });
      },
      error: (err) => {
        this.createError.set(err.error.message || 'Erro ao criar item');
      }
    });
  }

  onDeleteItem(id: string): void {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    // Passa o this.templateId (que pegamos no ngOnInit) e o id do item
    this.itemService.deleteItem(this.templateId, id).subscribe({ // <-- CORRIGIDO
      next: () => {
        // Remove da lista
        this.items.update(current => current.filter(item => item.id !== id));
        // Reajusta a 'ordem' no form
        this.itemForm.patchValue({ ordem: this.items().length });
      },
      error: (err) => alert('Erro ao deletar item')
    });
  }
}
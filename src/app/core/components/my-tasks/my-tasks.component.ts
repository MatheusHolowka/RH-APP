import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importe o serviço que acabamos de criar
import { ProcessoItemService } from '../../../processo-item/services/processo-item.service';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss'
})
export class MyTasksComponent implements OnInit {
  private itemService = inject(ProcessoItemService);
  
  public tasks = signal<any[]>([]);
  public isLoading = signal(true);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading.set(true);
    this.itemService.getMyTasks().subscribe({
      next: (data: any) => { // <-- Adicionado tipo : any
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => { // <-- Adicionado tipo : any
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  completeTask(id: string) {
    this.itemService.complete(id).subscribe(() => {
      this.loadTasks(); // Recarrega a lista após completar
    });
  }
}
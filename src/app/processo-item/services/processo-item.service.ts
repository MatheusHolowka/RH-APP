import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessoItemService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/processo-item'; 

  // Busca as tarefas do usuário logado
  getMyTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/meus-itens`);
  }

  // Marca uma tarefa como concluída
  complete(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, {});
  }
}
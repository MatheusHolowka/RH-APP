import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateItemService {
  private http = inject(HttpClient);
  
  // URL base do backend
  private baseUrl = 'http://localhost:3000'; 

  /**
   * Busca os itens de um template específico
   */
  getItems(templateId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/template-checklist/${templateId}/item`);
  }

  /**
   * Cria um novo item (tarefa) dentro de um template
   */
  createItem(templateId: string, data: { tituloTarefa: string, descricao?: string, ordem: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/template-checklist/${templateId}/item`, data);
  }

  /**
   * Deleta um item (tarefa)
   */
  deleteItem(templateId: string, itemId: string): Observable<any> {
    // Constrói a URL aninhada correta que o backend espera
    return this.http.delete(`${this.baseUrl}/template-checklist/${templateId}/item/${itemId}`);
  }
}
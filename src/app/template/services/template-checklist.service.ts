import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateChecklistService {
  private http = inject(HttpClient);
  
  // URL da nossa API NestJS
  private apiUrl = 'http://localhost:3000/template-checklist'; 

  /**
   * Busca todos os templates do tenant logado.
   */
  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Cria um novo template.
   * @param data - { titulo: string, descricao?: string }
   */
  createTemplate(data: { titulo: string, descricao?: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  /**
   * Deleta um template pelo ID.
   */
  deleteTemplate(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getTemplateById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
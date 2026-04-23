import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ApiService } from '../core/api.service';

export interface ChatMessage {
  id: number;
  family_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  text: string;
  created_at: string;
}

export interface OnlineMember {
  user_id: number;
  first_name: string;
  last_name: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = inject(ApiService);
  private socket: Socket | null = null;

  getMessages(familyId: number): Observable<{ messages: ChatMessage[] }> {
    return this.api.get<{ messages: ChatMessage[] }>(`/families/${familyId}/chat/messages`);
  }

  connect(familyId: number): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const baseUrl = this.resolveBaseUrl();

    this.socket = io(`${baseUrl}/chat`, {
      transports: ['websocket'],
      withCredentials: true,
      query: { family_id: String(familyId) },
    });

    return this.socket;
  }

  sendMessage(text: string): void {
    this.socket?.emit('send_message', { text });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  private resolveBaseUrl(): string {
    if (typeof window !== 'undefined' && window.__env?.API_URL) {
      return window.__env.API_URL.replace(/\/api$/, '');
    }
    return '';
  }
}

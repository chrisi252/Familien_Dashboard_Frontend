import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPaperAirplane } from '@ng-icons/heroicons/outline';
import { switchMap } from 'rxjs';
import { ChatService } from '../../services/chat-service';
import { ChatMessage, OnlineMember } from '../../interfaces/chat';
import { UserStateService } from '../../services/user-state-service';
import { LoadingStateComponent } from '../../shared/loading-state/loading-state.component';

@Component({
  selector: 'app-chat-widget',
  imports: [NgIcon, LoadingStateComponent],
  viewProviders: [provideIcons({ heroPaperAirplane })],
  templateUrl: './chat-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWidget implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private userState = inject(UserStateService);
  private destroyRef = inject(DestroyRef);

  widgetId = input<number>(0);
  canEdit = input<boolean>(false);

  private _messages = signal<ChatMessage[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  private familyId: number | null = null;

  private currentUserId = computed(() => this.userState.currentUser()?.id ?? null);

  messages = computed(() => {
    const uid = this.currentUserId();
    return this._messages().map(msg => ({ ...msg, isOwn: msg.user_id === uid }));
  });

  @ViewChild('messageList') private messageList?: ElementRef<HTMLElement>;
  @ViewChild('input') private inputRef?: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      if (this.messages().length) {
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }

  ngOnInit() {
    this.userState
      .resolveCurrentFamilyId$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((id) => {
          this.familyId = id;
          this.connectSocket(id);
          return this.chatService.getMessages(id);
        }),
      )
      .subscribe({
        next: (res) => {
          this._messages.set(res.messages);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Nachrichten konnten nicht geladen werden.');
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !this.familyId) return;
    this.chatService.sendMessage(trimmed);
    if (this.inputRef) {
      this.inputRef.nativeElement.value = '';
    }
  }

  formatTime(isoString: string): string {
    // Backend sends UTC timestamps without timezone suffix; appending 'Z' forces
    // the browser to parse as UTC instead of local time.
    const hasTimezone = /Z$|[+-]\d{2}:?\d{2}$/.test(isoString);
    const normalized = hasTimezone ? isoString : isoString.replace(' ', 'T') + 'Z';
    const date = new Date(normalized);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private connectSocket(familyId: number) {
    const socket = this.chatService.connect(familyId);

    socket.on('new_message', (msg: ChatMessage) => {
      this._messages.update((msgs) => {
        const updated = [...msgs, msg];
        return updated.slice(-10);
      });
    });

    // keep listener to avoid unhandled event warnings, but don't use data
    socket.on('online_members', (_members: OnlineMember[]) => {});
  }

  private scrollToBottom() {
    if (this.messageList) {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    }
  }
}

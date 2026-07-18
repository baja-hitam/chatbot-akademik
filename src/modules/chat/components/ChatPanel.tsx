import { useEffect, useRef } from 'react';
import { Eraser, Menu, PanelsRightBottom } from 'lucide-react';
import type { ChatMessage } from '../../../types/domain';
import { Button } from '../../../components/atoms/Button';
import { ChatBubble } from './ChatBubble';
import { ChatComposer } from './ChatComposer';

interface ChatPanelProps {
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onOpenSidebar?: () => void;
  onOpenWidgetPanel?: () => void;
  isLoadingMessages?: boolean;
}

export function ChatPanel({
  messages,
  isSending,
  onSendMessage,
  onClearChat,
  onOpenSidebar,
  onOpenWidgetPanel,
  isLoadingMessages = false,
}: ChatPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages list changes or sending state changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  return (
    <section className="flex min-w-0 flex-1 flex-col h-full bg-white dark:bg-slate-950">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Buka sidebar"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Chatbot Akademik</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 xl:hidden"
            onClick={onOpenWidgetPanel}
            aria-label="Buka panel informasi"
          >
            <PanelsRightBottom size={18} />
          </button>
          <Button variant="ghost" onClick={onClearChat}>
            <Eraser size={16} /> Bersihkan Chat
          </Button>
        </div>
      </header>

      {/* Main chat history list */}
      <div
        ref={containerRef}
        className="flex-1 space-y-4 overflow-y-auto no-scrollbar bg-white dark:bg-slate-950 px-4 py-5 sm:px-6 scroll-smooth"
      >
        {isLoadingMessages ? (
          <div className="space-y-6">
            {/* User message skeleton */}
            <div className="flex justify-end animate-pulse">
              <div className="max-w-[70%] rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3">
                <div className="h-4 w-36 rounded bg-indigo-500/25"></div>
              </div>
            </div>
            {/* Assistant message skeleton */}
            <div className="flex items-start gap-3 animate-pulse">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-300/30 border border-indigo-500/20 shrink-0">
                AI
              </div>
              <div className="max-w-[85%] rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 flex-1">
                <div className="h-4 w-48 rounded bg-slate-100 dark:bg-slate-800"></div>
                <div className="h-3 w-full max-w-[28rem] rounded bg-slate-100 dark:bg-slate-800"></div>
                <div className="h-3 w-full max-w-[20rem] rounded bg-slate-100 dark:bg-slate-800"></div>
              </div>
            </div>
            {/* User message skeleton */}
            <div className="flex justify-end animate-pulse">
              <div className="max-w-[70%] rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3">
                <div className="h-4 w-48 rounded bg-indigo-500/25"></div>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Mulai chat baru untuk bertanya soal KRS, KKP, TA, yudisium, atau jadwal akademik.
          </div>
        ) : (
          messages.map((message) => <ChatBubble key={message.id} message={message} />)
        )}

        {/* AI Typing/Thinking Indicator */}
        {isSending && (
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-semibold text-indigo-100 shrink-0">
              AI
            </div>
            <div className="max-w-[85%] rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 shadow-sm">
              <div className="flex items-center gap-1.5 py-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatComposer isSending={isSending} onSend={onSendMessage} />
    </section>
  );
}

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
  onOpenSidebar: () => void;
  onOpenWidgetPanel: () => void;
}

export function ChatPanel({
  messages,
  isSending,
  onSendMessage,
  onClearChat,
  onOpenSidebar,
  onOpenWidgetPanel,
}: ChatPanelProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Buka sidebar"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-sm font-semibold text-slate-100">AI Chatbot Akademik</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 xl:hidden"
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

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-950/20 px-4 py-5 sm:px-6">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm leading-6 text-slate-400">
            Mulai chat baru untuk bertanya soal KRS, KKP, TA, yudisium, atau jadwal akademik.
          </div>
        ) : (
          messages.map((message) => <ChatBubble key={message.id} message={message} />)
        )}
      </div>

      <ChatComposer isSending={isSending} onSend={onSendMessage} />
    </section>
  );
}

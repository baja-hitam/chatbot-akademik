import { useQuery } from '@tanstack/react-query';
import { getSessionMessagesHistory } from '../services/chatHistoryService';
import { Bot, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';

export function ChatHistoryDetailPage() {
  const { sessionId } = useParams({ strict: false }) as { sessionId: string };

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chat-history-messages', sessionId],
    queryFn: () => getSessionMessagesHistory(sessionId),
    enabled: !!sessionId,
  });

  return (
    <div className="p-4 md:p-8 flex flex-col h-[calc(100dvh-73px)] lg:h-dvh">
      <div className="mb-6 flex items-center gap-4 shrink-0">
        <Link
          to="/admin/chat-history"
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors focus:outline-none"
          title="Kembali ke Riwayat"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Detail Percakapan</h1>
          <p className="mt-1 text-sm text-slate-400">ID Sesi: {sessionId}</p>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 p-4 md:p-6 flex flex-col min-h-0 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-y-auto pr-2 space-y-4">
          {isLoading ? (
            <div className="text-center text-slate-500 py-10 flex-1 flex items-center justify-center">Memuat detail percakapan...</div>
          ) : !messages || messages.length === 0 ? (
            <div className="text-center text-slate-500 py-10 flex-1 flex items-center justify-center">Belum ada pesan di sesi ini.</div>
          ) : (
            messages.map((msg) => {
              const isBot = msg.sender_role === 'bot' || msg.sender_role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`flex max-w-[85%] md:max-w-[70%] gap-3 rounded-2xl p-4 shadow-sm ${
                      isBot
                        ? 'bg-slate-800 text-slate-200 rounded-tl-sm'
                        : 'bg-indigo-600 text-white rounded-tr-sm'
                    }`}
                  >
                    {isBot && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700">
                        <Bot size={18} className="text-indigo-400" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <span className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </span>
                      <span className={`text-[10px] mt-1 ${isBot ? 'text-slate-400' : 'text-indigo-200'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!isBot && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/50">
                        <UserIcon size={18} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

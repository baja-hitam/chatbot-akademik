import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../../../types/domain';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={['flex items-start gap-3', isAssistant ? '' : 'justify-end'].join(' ')}>
      {isAssistant ? (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-semibold text-indigo-100">
          AI
        </div>
      ) : null}
      <div
        className={[
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm',
          isAssistant ? 'bg-slate-800 text-slate-100' : 'bg-indigo-500 text-white',
        ].join(' ')}
      >
        {isAssistant ? (
          <div className="space-y-2 leading-6 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_table]:w-full [&_table]:border-collapse [&_table]:mt-3 [&_table]:text-sm [&_th]:border [&_th]:border-slate-700 [&_th]:p-2 [&_th]:bg-slate-700/50 [&_td]:border [&_td]:border-slate-700 [&_td]:p-2 [&_th]:text-left">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

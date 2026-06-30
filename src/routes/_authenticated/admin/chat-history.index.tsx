import { createFileRoute } from '@tanstack/react-router';
import { ChatHistoryPage } from '../../../modules/admin/chat-history/pages/ChatHistoryPage';

export const Route = createFileRoute('/_authenticated/admin/chat-history/')({
  component: ChatHistoryPage,
});

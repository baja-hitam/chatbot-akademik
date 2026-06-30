import { createFileRoute } from '@tanstack/react-router';
import { ChatHistoryDetailPage } from '../../../modules/admin/chat-history/pages/ChatHistoryDetailPage';

export const Route = createFileRoute('/_authenticated/admin/chat-history/$sessionId')({
  component: ChatHistoryDetailPage,
});

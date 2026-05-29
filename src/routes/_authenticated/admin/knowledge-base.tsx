import { createFileRoute } from '@tanstack/react-router';
import { KnowledgeBasePage } from '../../../modules/admin/knowledge-base/pages/KnowledgeBasePage';

export const Route = createFileRoute('/_authenticated/admin/knowledge-base')({
  component: KnowledgeBasePage,
});

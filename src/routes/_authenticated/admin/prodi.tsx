import { createFileRoute } from '@tanstack/react-router';
import { ProdiPage } from '../../../modules/admin/prodi/pages/ProdiPage';

export const Route = createFileRoute('/_authenticated/admin/prodi')({
  component: ProdiPage,
});

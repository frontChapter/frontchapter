import { getRegularPage } from '@lib/contentParser';
import NotFound from '../layouts/404';

export default async function NotFoundPage() {
  const notFoundData = await getRegularPage('404');
  return <NotFound data={notFoundData} />;
}

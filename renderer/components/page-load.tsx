import { Loader2 } from 'lucide-react';
import Header from './header';

export default function PageLoader() {
  return (
    <div>
      <Header />
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Loader2 className='animate-spin size-12' />
      </div>
    </div>
  );
}

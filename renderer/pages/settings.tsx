import Header from '../components/header';
import { Button } from '../components/ui/button';

export default function Connect() {
  return (
    <div className='mt-20'>
      <Header />

      <div className='flex flex-col items-center mt-10'>
        <h1 className='text-2xl'>Connect to your reMarkable</h1>
        <p className='text-gray-400 mt-2'>
          Connect to your reMarkable device to start using rePlace.
        </p>
        <Button className='mt-4'>Connect</Button>
      </div>
    </div>
  );
}

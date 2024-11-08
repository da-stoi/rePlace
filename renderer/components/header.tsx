export default function Header() {
  return (
    <div className='titlebar fixed top-0 pt-4 w-full flex justify-center'>
      <div className='space-x-1'>
        <div className='inline-flex bg-foreground size-8 rounded-md items-center justify-center'>
          <h1 className='text-background font-bold text-xl text-center'>rP</h1>
        </div>
        <h1 className='inline text-2xl h-8'>rePlace</h1>
      </div>
    </div>
  );
}

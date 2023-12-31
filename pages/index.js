import Link from 'next/link';
import React from 'react';
import { BsDownload } from 'react-icons/bs';
import FileSaver from 'file-saver';
import Spinner from '@/components/Spinner';

const IMAGE_SIZES = [
  { value: '256x256', label: '256 X 256' },
  { value: '512x512', label: '512 X 512' },
  { value: '1024x1024', label: '1024 X 1024' },
];

const ImageCard = ({ url }) => {
  const [loading, setLoading] = React.useState(false);

  const downloadImage = async (url) => {
    setLoading(true);
    let response = await fetch('/api/download', {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      FileSaver.saveAs(blob, 'image.png');
    } else {
      console.error('some error');
    }
    setLoading(false);
  };

  return (
    <div className={'p-1 group bg-transparent relative mb-5 w-full shadow-md'}>
      <div className={'h-auto hover:opacity-75'}>
        <img src={url} height={'auto'} width={'100%'} className={'rounded-md object-contain'} />
      </div>
      <div className={'absolute right-4 top-4 text-white'}>
        {loading ? (
          <Spinner />
        ) : (
          <button
            onClick={() => downloadImage(url)}
            className={'hidden group-hover:block p-2 rounded-full bg-white group-hover:bg-primary-light'}
          >
            <BsDownload size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [prompt, setPrompt] = React.useState('');
  const [size, setSize] = React.useState(IMAGE_SIZES[0].value);
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, size }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (response.ok) {
      response = await response.json();
      setImages(response.data);
    } else {
      console.log(response.error);
    }
    setLoading(false);
  };

  return (
    <main>
      <div className={'max-w-5xl mx-auto px-5 lg:px-0'}>
        <h1
          className={
            'inline-block text-transparent bg-clip-text py-4 text-6xl font-bold bg-gradient-to-r from-[#009FFF] to-[#ec2F4B] font-squarePeg'
          }
        >
          imageAI
        </h1>
      </div>
      <div className={'max-w-5xl mx-auto px-5 lg:px-0 min-h-[calc(100vh-170px)]'}>
        <form className={'mt-4 '} onSubmit={handleSubmit}>
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
            <div className={''}>
              <label htmlFor={'prompt'} className={'block text-sm font-medium text-primary-main leading-6'}>
                Хүссэн зурагныхаа тайлбарыг бичээрэй:
              </label>
              <textarea
                onChange={(e) => setPrompt(e.target.value)}
                className={
                  'mt-2 block w-full px-2 py-1 rounded-md text-primary-main shadow-sm resize-none placeholder:text-primary-light border border-primary-main outline-primary-main text-md'
                }
                id={'prompt'}
                placeholder={'Generate a white furry cat sitting on a chair'}
                rows={2}
              />
              <span className={'mt-1 text-xs leading-6 text-primary-main'}>
                дэлгэрэнгүй мэдээлэл бичих шаардлагатай
              </span>
            </div>
            <div className={''}>
              <div className={'w-full'}>
                <label htmlFor={'size'} className={'block text-sm font-medium leading-6 text-primary-main'}>
                  Зурагны хэмжээ сонгох
                </label>
                <select
                  id={'size'}
                  onChange={(e) => setSize(e.target.value)}
                  className={
                    'mt-2 w-full px-2 py-3 rounded-md shadow-sm border border-primary-main text-md text-primary-main'
                  }
                >
                  {IMAGE_SIZES.map(({ value, label }, index) => (
                    <option key={index} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className={'mt-5 text-right'}>
                  <button
                    type={'submit'}
                    disabled={loading}
                    className={
                      'rounded-md bg-primary-main px-3 py-2 hover:bg-primary-dark text-primary-contrastText font-semibold shadow-sm disabled:bg-primary-light disabled:cursor-not-allowed'
                    }
                  >
                    {loading ? 'Боловсруулж байна ...' : 'Боловсруулах'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className={'mt-4 pt-4 border-t'}>
          {loading ? (
            <div className={'h-100 flex flex-col justify-center items-center'}>
              <p className={'text-md text-primary-main font-bold my-10'}>Зураг боловсруулж байна ...</p>{' '}
              <img src={'/no-data.svg'} alt={'no data image'} className={'w-1/3 sm:w-1/5 h-auto'} />
            </div>
          ) : images.length > 0 ? (
            <div className={'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'}>
              {images.map(({ url }, index) => (
                <ImageCard url={url} key={index} />
              ))}
            </div>
          ) : (
            <div className={'h-100 flex flex-col justify-center items-center'}>
              <p className={'text-md text-primary-main font-bold my-10'}>Дэлгэцэнд үзүүлэх өгөгдөл байхгүй байна.</p>{' '}
              <img src={'/no-data.svg'} alt={'no data image'} className={'w-1/3 sm:w-1/5 h-auto'} />
            </div>
          )}
        </div>
      </div>

      <div className={'flex justify-between items-center py-4 max-w-5xl mx-auto border-t px-5 lg:px-0'}>
        <div className={'text-sm uppercase text-primary-main'}>d.3.v.3.1.0.p.3.r</div>
        <Link href={'#'} target={'_blank'}>
          <img src={'/github-mark.svg'} alt={'github-repo'} className={'h-7 w-7'} />
        </Link>
      </div>
    </main>
  );
}

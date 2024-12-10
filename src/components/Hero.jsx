import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { TiLocationArrow } from 'react-icons/ti';
import { useEffect, useRef, useState } from 'react';
import { VideoPreview } from './VideoPreview';

import Button from './Button';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const [currentIndexBackup, setcurrentIndexBackup] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const totalVideos = 4;

  const nextVdRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos(prev => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos) {
      setLoading(false);
      const firstVideo = document.getElementById('next-video');
      if (firstVideo) {
        firstVideo.play().catch(err => {
          console.warn('Autoplay was prevented:', err);
        });
      }
    }
  }, [loadedVideos]);

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex(prevIndex => (prevIndex % totalVideos) + 1);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set('#next-video', { visibility: 'visible' });
        gsap.to('#next-video', {
          transformOrigin: 'center center',
          scale: 1,
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'power1.inOut',
          onStart: () => nextVdRef.current.play(),
        });

        gsap.from('#current-video', {
          transformOrigin: 'center center',
          scale: 0,
          duration: 1.5,
          ease: 'power1.inOut',
        });

        setTimeout(() => {
          setcurrentIndexBackup(currentIndex);
        }, '2600');
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    },
  );

  useGSAP(() => {
    gsap.set('#video-frame', {
      clipPath: 'polygon(14% 0, 72% 0, 88% 90%, 0 95%)',
      borderRadius: '0% 0% 40% 10%',
    });
    gsap.from('#video-frame', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      borderRadius: '0% 0% 0% 0%',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#video-frame',
        start: 'center center',
        end: 'bottom center',
        scrub: true,
      },
    });

    // setIsTriggered(true);
  });

  const getVideoSrc = index =>
    `https://res.cloudinary.com/do0xfwvhx/video/upload/f_auto:video,q_auto/hero-${index}`;

  useEffect(() => {
    // Preload videos (to make sure they're ready)
    const preloadVideos = () => {
      const videoPreloads = [];
      for (let i = 1; i <= totalVideos; i++) {
        const video = document.createElement('video');
        video.src = getVideoSrc(i);
        video.preload = 'auto';
        video.oncanplaythrough = handleVideoLoad; // This will ensure the video is ready
        videoPreloads.push(video);
      }
    };

    preloadVideos(); // Preload videos when the component mounts
  }, []);

  return (
    <div
      className="relative h-dvh w-screen overflow-x-hidden"
      onClick={() => {
        const videoElement = document.getElementById('next-video');
        if (videoElement) {
          videoElement.play();
        }
      }}
    >
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                <video
                  ref={nextVdRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)}
                  loop
                  muted
                  id="current-video"
                  className="size-64 origin-center scale-150 object-cover object-center"
                  onLoadedData={handleVideoLoad}
                  playsInline
                />
              </div>
            </VideoPreview>
          </div>

          <video
            playsInline
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
            onError={e => console.error('Video failed to load:', e.target.src)}
          />
          <video
            playsInline
            src={getVideoSrc(currentIndexBackup) || '/public/videos/hero-1.mp4'}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
            onError={e => console.error('Video failed to load:', e.target.src)}
          />
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>A</b>MING
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              title="Watch trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>A</b>MING
      </h1>
    </div>
  );
};

export default Hero;

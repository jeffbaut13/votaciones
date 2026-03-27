import { AnimatePresence, motion } from "framer-motion";
import { Icono } from "@/components/ui/Icono";
import { usePopOpenStore } from "@/store/video-pop-store";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export const VideoPop = () => {
  const { isOpen, closePop, url, play, openVideo, closeVideo, setPlayState } =
    usePopOpenStore();
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVideoMeta, setShowVideoMeta] = useState(true);
  const hideMetaTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const srcVideo =
    url === "legado"
      ? "/video/prueba.mp4"
      : url === "evolucion"
        ? "/video/prueba2.mp4"
        : "/video/prueba.mp4";
  const videoTitle = url === "evolucion" ? "La Evolucion" : "El Legado";
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${secs}`;
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!play && !video.paused) {
      video.pause();
    }
  }, [play, openVideo]);

  useEffect(() => {
    if (!openVideo) {
      setShowVideoMeta(true);
      return undefined;
    }

    if (!play) {
      setShowVideoMeta(true);
      return undefined;
    }

    hideMetaTimeoutRef.current = window.setTimeout(() => {
      setShowVideoMeta(false);
    }, 900);

    return () => {
      if (hideMetaTimeoutRef.current) {
        window.clearTimeout(hideMetaTimeoutRef.current);
        hideMetaTimeoutRef.current = null;
      }
    };
  }, [openVideo, play]);

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setCurrentTime(0);
    setDuration(0);
    setShowVideoMeta(true);
    closeVideo();
  };

  const HandleVotacion = () => {
    handleCloseVideo();
    setTimeout(() => {
      closePop();
    }, 50);
    setTimeout(() => {
      navigate("/votacion");
    }, 100);
  };

  const handleVideoToggle = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
      return;
    }

    video.pause();
  };

  const revealVideoMeta = () => {
    setShowVideoMeta(true);

    if (hideMetaTimeoutRef.current) {
      window.clearTimeout(hideMetaTimeoutRef.current);
      hideMetaTimeoutRef.current = null;
    }

    if (play) {
      hideMetaTimeoutRef.current = window.setTimeout(() => {
        setShowVideoMeta(false);
      }, 900);
    }
  };

  const hideVideoMetaIfPlaying = () => {
    if (hideMetaTimeoutRef.current) {
      window.clearTimeout(hideMetaTimeoutRef.current);
      hideMetaTimeoutRef.current = null;
    }

    setShowVideoMeta(!play);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed top-0 left-0 w-full h-dvh z-2">
          <div className="size-full flex relative">
            <Icono
              onClick={closePop}
              color="primary"
              customclass="absolute top-6 right-6 cursor-pointer transition"
              aria-label="Cerrar video"
              size="sm"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.4, ease: "circOut", duration: 1 }}
            >
              <X />
            </Icono>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="flex-1 h-full bg-brand-50"
              transition={{ ease: "circOut", duration: 1 }}
            >
              <Content
                title="legado"
                iconoLogo="/icons/logo-antiguo.svg"
                alt="Imagen del video"
                srcVideo={"/video/prueba.mp4"}
                color="secondary"
              />
            </motion.div>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="flex-1 h-full bg-brand-100"
              transition={{ delay: 0.1, ease: "circOut", duration: 1 }}
            >
              {" "}
              <Content
                title="evolucion"
                iconoLogo="/icons/logo-nuevo.svg"
                alt="Imagen del video"
                srcVideo="/video/prueba2.mp4"
                color="primary"
              />
            </motion.div>
          </div>

          <AnimatePresence>
            {openVideo && (
              <motion.div
                data-cursor={!play ? "play" : "pause"}
                data-cursor-icon={!play ? "play" : "pause"}
                data-cursor-size={"lg"}
                className="absolute inset-0 size-full z-3"
              >
                <motion.div
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  transition={{ ease: "circIn", duration: 0.5 }}
                  className="absolute z-10 inset-0 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 size-full w-full bg-black"
                    onMouseEnter={revealVideoMeta}
                    onMouseMove={revealVideoMeta}
                    onMouseLeave={hideVideoMetaIfPlaying}
                  >
                    <video
                      ref={videoRef}
                      onClick={handleVideoToggle}
                      src={srcVideo}
                      autoPlay
                      onLoadedMetadata={(event) => {
                        setDuration(event.currentTarget.duration || 0);
                      }}
                      onTimeUpdate={(event) => {
                        setCurrentTime(event.currentTarget.currentTime || 0);
                      }}
                      onEnded={() => setPlayState(false)}
                      onPlay={() => setPlayState(true)}
                      onPause={() => setPlayState(false)}
                      controls={false}
                      className="size-full object-contain"
                    />

                    {/* Aca un time lapse ubicando el tiempo una barra de progreso del video y un titulo este es dinamico de acuero d a legado o evolucion */}
                    <AnimatePresence initial={false}>
                      {showVideoMeta && (
                        <motion.div
                          key="video-meta"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{
                            duration: 0.2,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="w-full max-w-7xl mx-auto pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10 text-brand-50"
                        >
                          <p className="mb-4 text-4xl font-medium tracking-tight">
                            {videoTitle}
                          </p>
                          <div className="flex items-center gap-6">
                            <div className="h-px flex-1 overflow-hidden bg-cb">
                              <div
                                className="h-full bg-brand-50 transition-[width] duration-150 ease-out"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="min-w-24 text-right text-sm font-medium tabular-nums text-brand-50/90">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                          </div>
                        </motion.div>
                      )}
                      <div className="w-full max-w-7xl bottom-16 flex justify-between mx-auto absolute -translate-x-1/2 left-1/2 z-10">
                        <Button
                          aria-label="Cerrar la reproducción del video"
                          size="xl"
                          variant="third"
                          onClick={handleCloseVideo}
                        >
                          Volver
                        </Button>
                        <Button
                          aria-label="Iniciar votación"
                          size="xl"
                          variant="secondary"
                          onClick={HandleVotacion}
                        >
                          Votar
                        </Button>
                      </div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Content = ({ title, iconoLogo, alt, srcVideo, color = "primary" }) => {
  const { play, openSelectedVideo } = usePopOpenStore();
  const themeColor = color === "primary" ? "text-brand-50" : "text-brand-100";

  return (
    <div className="size-full flex flex-col items-center justify-evenly">
      <h2 className={`text-2xl font-medium ${themeColor}`}>
        {title === "legado" && "El Legado:"}
        {title === "evolucion" && "La Evolución:"}
      </h2>
      <div
        data-cursor={!play ? "play" : "pause"}
        data-cursor-icon={!play ? "play" : "pause"}
        data-cursor-size={"lg"}
        aria-label="Reproducir o pausar video"
        className="group relative w-180 min-h-103 flex items-center justify-center cursor-pointer"
      >
        <picture className="w-91 h-auto inline-flex">
          <img src={iconoLogo} alt={alt} />
        </picture>
        <video
          onClick={() => openSelectedVideo(title)}
          src={srcVideo}
          playsInline
          autoPlay
          loop
          muted
          className="scale-0 group-hover:scale-100 absolute size-full object-cover transition-all ease-out duration-1000"
          poster=""
        />
      </div>
      <div />
    </div>
  );
};

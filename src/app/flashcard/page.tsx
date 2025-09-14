"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Flashcards, { FlashcardsContent } from "@/components/Flashcards";
import PrefetchTranscripts from "@/components/PrefetchTranscripts";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

type BgLayer = { id: string; backgroundImage?: string };

export default function LandingPage() {
  const [showFlashcards, setShowFlashcards] = useState(true);
  const router = useRouter();
  const mountTimeRef = useRef<number>(0);
  const flashcardsKeyRef = useRef(0);

  const visualRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [currentBgImage, setCurrentBgImage] = useState<string>("");
  const [videoEndedMap, setVideoEndedMap] = useState<Record<string, boolean>>(
    {}
  );

  const flashcards = useMemo<FlashcardsContent[]>(
    () => [
      {
        id: "f1",
        type: "video",
        videoUrl: "/video-1.mp4",
        backgroundImage: "/video-1.mp4",
        groupId: "step1",
      },
      {
        id: "f2",
        type: "video",
        videoUrl: "/video-2.mp4",
        backgroundImage: "/video-2.mp4",
        groupId: "step2",
      },
      {
        id: "f3",
        type: "video",
        videoUrl: "/video-3.mp4",
        backgroundImage: "/video-3.mp4",
        groupId: "step3",
      },
    ],
    []
  );

  useEffect(() => {
    setCurrentBgImage(flashcards[0]?.backgroundImage || "/video-bg.png");
    videoRefs.current = {};
  }, [flashcards]);

  const audioUrls = useMemo(() => {
    return flashcards
      .filter((c): c is FlashcardsContent & { audioUrl: string } => {
        const maybe = c as unknown as Record<string, unknown>;
        return typeof maybe.audioUrl === "string";
      })
      .map((c) => c.audioUrl);
  }, [flashcards]);

  const isVideoSrc = (src?: string) => /\.mp4$|\.webm$|\.ogg$/i.test(src ?? "");

  const handleStart = () => {
    flashcardsKeyRef.current += 1;
    mountTimeRef.current = Date.now();
    setShowFlashcards(true);
    setCurrentBgImage(flashcards[0]?.backgroundImage || "/video-bg.png");
    setVideoEndedMap({});
  };

  const handleSlideChange = (index: number) => {
    if (mountTimeRef.current && Date.now() - mountTimeRef.current < 350) return;
    const card = flashcards[index];
    if (!card) return;

    const videoHasEnded = !!videoEndedMap[card.id];
    if (card.id === "f3" && videoHasEnded) {
      setCurrentBgImage("/static-bg.jpg");
    } else {
      const newBg = card.backgroundImage || "/video-bg.png";
      setCurrentBgImage(newBg);
    }
  };

  const handleVideoEnded = (cardId: string) => {
    setVideoEndedMap((prev) => ({ ...prev, [cardId]: true }));
    if (cardId === "f3") {
      setCurrentBgImage("/static-bg.jpg");
    }
  };

  const handleComplete = () => {
    setShowFlashcards(false);
    try {
      const prev = JSON.parse(localStorage.getItem("planProgress") || "{}");
      const merged = { ...prev, discover: "completed", train: "completed" };
      localStorage.setItem("planProgress", JSON.stringify(merged));
    } catch {
      localStorage.setItem(
        "planProgress",
        JSON.stringify({
          discover: "completed",
          train: "completed",
          execute: "available",
        })
      );
    }
    router.push("/modal-finish");
  };

  // типизированные слои фона
  const bgLayers: BgLayer[] = useMemo(
    () => [
      ...flashcards.map(({ id, backgroundImage }) => ({ id, backgroundImage })),
      { id: "static-bg", backgroundImage: "/static-bg.jpg" },
    ],
    [flashcards]
  );

  return (
    <div className="absolute inset-0">
      <PrefetchTranscripts urls={audioUrls} />

      {showFlashcards && (
        <div className="relative overflow-hidden h-screen">
          <div className="absolute inset-0">
            {bgLayers.map((layer) => {
              const src = layer.backgroundImage;
              if (!src) return null;

              const isVideo = isVideoSrc(src);
              const active = src === currentBgImage;
              const videoHasEnded = !!videoEndedMap[layer.id];
              const shouldBlur = layer.id === "f2" && videoHasEnded;

              return (
                <div
                  key={layer.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden
                >
                  {isVideo ? (
                    <>
                      <video
                        ref={(el) => {
                          if (layer.id) videoRefs.current[layer.id] = el;
                        }}
                        className={twMerge(
                          "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                          shouldBlur ? "filter blur-[10px]" : "filter-none"
                        )}
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[10px] bg-black/30"
                      style={{
                        backgroundImage: `url("${src}")`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative z-10 h-full">
            <Flashcards
              key={flashcardsKeyRef.current}
              cards={flashcards}
              onComplete={handleComplete}
              onSlideChange={handleSlideChange}
              onVideoEnded={handleVideoEnded}
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

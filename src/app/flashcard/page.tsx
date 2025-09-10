"use client";

import Flashcards, { FlashcardsContent } from "@/components/Flashcards";
import PrefetchTranscripts from "@/components/PrefetchTranscripts";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

// универсальный хелпер: проверка, что у объекта есть строковое поле K
function hasString<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, string> {
  return (
    !!obj &&
    typeof obj === "object" &&
    typeof (obj as Record<K, unknown>)[key] === "string"
  );
}

// type guard для аудио-карточек (без any)
function isAudioCard(
  c: FlashcardsContent
): c is FlashcardsContent & { type: "audio"; audioUrl: string } {
  return c.type === "audio" && hasString(c, "audioUrl");
}

export default function FlashcardPage() {
  const router = useRouter();

  // Делаем массив карточек стабильным (одна и та же ссылка между рендерами)
  const flashcards = useMemo<FlashcardsContent[]>(
    () => [
      {
        id: "f1",
        type: "video",
        content: "",
        videoUrl: "/video-1.mp4",
        backgroundImage: "/video-1.mp4",
      },

      {
        id: "f2",
        type: "video",
        content: "",
        videoUrl: "/video-2.mp4",
        backgroundImage: "/video-2.mp4",
      },
      {
        id: "f4",
        type: "video",
        videoUrl: "/video-3.mp4",
        backgroundImage: "/video-3.mp4",
      },

    ],
    []
  );

  // Инициализируем фон сразу из первой карточки — без useEffect
  const [currentBgImage, setCurrentBgImage] = useState<string>(
    flashcards[0]?.backgroundImage || "/video-bg.png"
  );

  const handleSlideChange = (index: number) => {
    const newBg = flashcards[index]?.backgroundImage || "/video-bg.png";
    setCurrentBgImage(newBg);
  };

  const handleComplete = () => {
    router.push("/modal-finish");
  };



  return (
    <div className='w-full h-full flex justify-center'>

      <div className='w-full min-h-screen max-w-md relative overflow-hidden'>
        <div className='absolute inset-0'>
          {flashcards.map((card) => (
            <div
              key={card.id}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${card.backgroundImage === currentBgImage
                ? "opacity-100"
                : "opacity-0"
                }`}
              style={{
                backgroundImage: `url("${card.backgroundImage || "/video-bg.png"
                  }")`,
              }}
            />
          ))}
        </div>

        <div className='z-10'>
          <div className='h-screen flex flex-col'>
            <Flashcards
              cards={flashcards}
              onComplete={handleComplete}
              onSlideChange={handleSlideChange}
              className='flex-1'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

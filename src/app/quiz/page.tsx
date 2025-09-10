"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";

export default function QuestionsPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>("");

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setCurrentSlide(2);
  };

  const handleLevelSelect = (level: number) => {
    if (level <= 3) {
      setSelectedLevel(level);
      setCurrentSlide(3);
    }
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      router.push('/score');
    }
  };

  const handleReasonSelect = (reason: string) => {
    if (reason === "I\'m feeling off or unmotivated.") {
      setSelectedReason(reason);
      // Navigate to modal after completing all questions
      router.push('/modal');
    }
  };

  const handleBack = () => {
    if (currentSlide === 1) {
      router.push('/notification');
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="min-h-screen max-w-md w-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/quiz-bg.png')` }}
        />

        <div className="relative z-10 h-dvh px-4 pt-[1rem] pb-[3.125rem]">
          <div className="h-full w-full flex flex-col">

            <div className='flex gap-[0.938rem] mb-[3.375rem] items-center'>
              <BackButton onClick={handleBack} />
              <span className='font-bold text-2xl'>Execute</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-[30px]">
              <div className="w-full h-[10px] bg-white/10 rounded-[12px] overflow-hidden">
                <div
                  className="h-full bg-white rounded-[12px] transition-all duration-300 ease-out"
                  style={{ width: `${(currentSlide / 2) * 100}%` }}
                />
              </div>
            </div>

            {/* Slide 1: Theme Selection */}
            {currentSlide === 1 && (
              <div className="flex-1 flex flex-col">
                <div className="mb-[30px] min-h-[44px]">
                  <h2 className="text-[20px] leading-[24px] font-medium text-white">True or False: Confidence only comes after everything goes perfectly.</h2>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <button
                    onClick={() => handleThemeSelect('True')}
                    className="w-full flex items-center justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="text-[18px] font-medium">True</span>
                  </button>

                  <button
                    onClick={() => handleThemeSelect('False')}
                    className="w-full flex items-center justify-center h-[60px] bg-[#FFFFFF0A] active:bg-[#FFFFFF26] border border-[#FFFFFF33] rounded-[30px] text-white transition-all"
                  >
                    <span className="text-[18px] font-medium">False</span>
                  </button>
                </div>
              </div>
            )}

            {/* Slide 2: High/Low Route Selection */}
            {currentSlide === 2 && (
              <div className="flex-1 flex flex-col relative">
                <div className="mb-[30px] min-h-[44px]">
                  <h2 className="text-[20px] leading-[24px] font-medium text-white">
                    Why does the way you respond after setbacks reveal your competitor identity?
                  </h2>
                </div>

                <div className="flex-1 flex flex-col">
                  <TextArea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="mb-4"
                  />
                </div>

                <Button
                  onClick={handleTextSubmit}
                  disabled={!textAnswer.trim()}
                  className="absolute bottom-0 left-0 right-0 w-full"
                >
                  Submit
                </Button>
              </div>
            )}





          </div>
        </div>
      </div>
    </div>
  );
}
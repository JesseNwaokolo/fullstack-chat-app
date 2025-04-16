import { CheckCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function SettingsPage() {
  const { theme, setTheme } = useChatStore();
  return (
    <div className="bg-primary-foreground transition-colors min-h-screen pt-30 ">
      <div className="flex justify-center gap-20">
        <div
          className="flex flex-col items-center relative cursor-pointer"
          onClick={() => setTheme("light")}
        >
          <div className="bg-white size-20 rounded-md border-blue-400 border" />
          <span className="text-sm">Light theme</span>

          {theme == "light" && (
            <CheckCircleIcon className="absolute text-green-300 right-[5px] top-[5px] size-5" />
          )}
        </div>

        <div
          className="flex flex-col items-center relative cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          <div className="bg-[#062964] size-20 rounded-md border-blue-400 border" />
          <span className="text-sm">Dark theme</span>
          {theme == "dark" && (
            <CheckCircleIcon className="absolute text-green-300 right-[5px] top-[5px] size-5" />
          )}
        </div>
      </div>

      <div className="mt-10 bg-red-50 mx-auto w-fit text-black">
        <p className="border-l-4 p-1 border-red-300 rounded-l text-xs font-mono italic">
          Please send images and update profile picture with images less than
          80kb else it won't work
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;

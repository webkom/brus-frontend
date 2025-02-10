import { useEffect, useState } from "react";

const FullscreenTrigger = () => {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const listener = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, []);

  return (
    <>
      {!fullscreen && (
        <button
          className="cursor-pointer absolute bottom-0 left-0 p-1 px-3 bg-amber-300 rounded-tr-xl hover:bg-amber-400"
          onClick={() => {
            document.documentElement.requestFullscreen();
          }}
        >
          Aktiver fullskjerm
        </button>
      )}
    </>
  );
};

export default FullscreenTrigger;

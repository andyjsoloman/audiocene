import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  //Listen to clicks outside & trigger handler
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) handler();
      }

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler]
  );

  return ref;
}

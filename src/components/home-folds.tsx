"use client";

import { useEffect } from "react";
import { openFold } from "./fold-link";

/** Opens the fold named in the address, such as /#log, on arrival and whenever the hash changes. */
export function HomeFolds() {
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) {
        openFold(id, "auto");
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return null;
}

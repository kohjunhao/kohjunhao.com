"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { site } from "@/lib/site";
import type { Book } from "@/sheet/tabs";
import { DownloadIcon, GridMark, LockIcon } from "./icons";

const NOTICE_MS = 4000;
const COPIED_MS = 2000;

type FrameApi = { notifyViewOnly: () => void; openShare: () => void };

export const FrameContext = createContext<FrameApi>({ notifyViewOnly: () => {}, openShare: () => {} });

const SHARE_LINKS = [
  { label: "Telegram", href: site.links.telegram },
  { label: "X", href: site.links.twitter },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
  { label: "Paragraph", href: site.links.paragraph },
];

export function Frame({ book, onDownload, children }: { book: Book; onDownload?: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState(0);

  const openShare = useCallback(() => {
    setNotice(0);
    dialog.current?.showModal();
  }, []);
  const notifyViewOnly = useCallback(() => setNotice((n) => n + 1), []);
  const api = useMemo(() => ({ notifyViewOnly, openShare }), [notifyViewOnly, openShare]);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = setTimeout(() => setNotice(0), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <FrameContext value={api}>
      <div className="app">
        <header className="titlebar">
          <GridMark className="mark" />
          <span className="docname">{site.name}</span>
          <span className="viewonly">
            <LockIcon />
            View only
          </span>
          <span className="spacer" />
          <span className="saved">Last edit {book.lastEdit}</span>
          {onDownload && (
            <button
              type="button"
              className="iconbtn csv"
              aria-label="Download this sheet as CSV"
              title="Download this sheet as CSV"
              onClick={onDownload}
            >
              <DownloadIcon />
            </button>
          )}
          <button type="button" className="btn" onClick={openShare}>
            Share
          </button>
        </header>

        {children}

        {notice > 0 && (
          <div className="notice" role="status">
            This sheet is view only.
            <button type="button" className="linkbtn" onClick={openShare}>
              Ask for edit access
            </button>
          </div>
        )}
      </div>
      <ShareDialog dialog={dialog} />
    </FrameContext>
  );
}

function ShareDialog({ dialog }: { dialog: React.RefObject<HTMLDialogElement | null> }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="share"
      aria-labelledby="share-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.close();
        }
      }}
    >
      <div className="share-body">
        <h2 id="share-title">Share &quot;{site.name}&quot;</h2>

        <h3>People with access</h3>
        <ul className="people">
          <li>
            <span>{site.name}</span>
            <span className="role">Owner</span>
          </li>
          <li>
            <span>Anyone on the internet</span>
            <span className="role">Viewer</span>
          </li>
        </ul>

        <h3>Ask for edit access</h3>
        <ul className="asks">
          {SHARE_LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="share-foot">
          <button type="button" className="btn ghost" onClick={copyLink}>
            {copied ? "Copied" : "Copy link"}
          </button>
          <button type="button" className="btn" onClick={() => dialog.current?.close()}>
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
}

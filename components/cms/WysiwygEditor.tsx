'use client';

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Quote, Link, Minus,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight,
  ImageIcon, Sparkles, Clock, FileText,
} from 'lucide-react';
import { calculateReadTime, countWords } from '@/lib/cms-journal-utils';

// ── Props ─────────────────────────────────────────────────────────────────────

interface WysiwygEditorProps {
  label?: string;
  value: string; // HTML string stored in bodyHtml
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface BubblePos { top: number; left: number }

const Divider = () => <div className="w-px h-5 bg-[#e4e5e5] mx-0.5 shrink-0" />;

const Btn: React.FC<{
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, active, disabled, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick(); }}
    disabled={disabled}
    className={[
      'flex items-center justify-center w-7 h-7 rounded transition-colors',
      active ? 'bg-[#18191b] text-white' : 'text-[#3e4143] hover:bg-[#e4e5e5]',
      disabled ? 'opacity-30 cursor-not-allowed' : '',
    ].join(' ')}
  >
    {children}
  </button>
);

// ── Image insertion modal ─────────────────────────────────────────────────────

const ImageDialog: React.FC<{
  onInsert: (url: string, caption: string) => void;
  onClose: () => void;
}> = ({ onInsert, onClose }) => {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <h4 className="font-serif-luxury text-lg text-[#18191b] uppercase tracking-wide">Insert In-Journal Image</h4>

        <div>
          <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1.5">Upload from device</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="w-full text-xs font-sans-clean file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-[#18191b] file:text-white file:text-xs file:font-sans-clean file:cursor-pointer cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1.5">or paste image URL</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] focus:outline-none focus:border-[#18191b]"
          />
        </div>

        {url && (
          <img src={url} alt="preview" className="w-full rounded-lg aspect-video object-cover border border-[#caccca]" />
        )}

        <div>
          <label className="block text-xs font-sans-clean font-medium text-[#18191b] mb-1.5">Caption</label>
          <input
            type="text"
            placeholder="e.g. STUDY IN VERNACULAR LIGHT AND THRESHOLD GEOMETRY. 35MM · F/4.0"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#caccca] focus:outline-none focus:border-[#18191b]"
          />
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-sans-clean border border-[#caccca] rounded-lg hover:bg-[#f7f8f8]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!url}
            onClick={() => { if (url) { onInsert(url, caption); onClose(); } }}
            className="px-4 py-2 text-xs font-sans-clean bg-[#18191b] text-white rounded-lg disabled:opacity-40 hover:bg-[#3e4143]"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main WYSIWYG Component ────────────────────────────────────────────────────

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Begin writing journal essay…',
  minHeight = '420px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  const [bubble, setBubble] = useState<BubblePos | null>(null);
  const [bubbleActive, setBubbleActive] = useState<Record<string, boolean>>({});
  const [showImageDialog, setShowImageDialog] = useState(false);

  // Live statistics
  const wordCount = countWords(value);
  const autoReadTime = calculateReadTime(value);

  // ── Sync value → DOM on external change only ────────────────────────────
  useEffect(() => {
    const el = editorRef.current;
    if (!el || isInternalChange.current) return;
    if (el.innerHTML !== value) el.innerHTML = value || '';
  }, [value]);

  // ── Emit to parent ───────────────────────────────────────────────────────
  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    isInternalChange.current = true;
    onChange(el.innerHTML);
    requestAnimationFrame(() => { isInternalChange.current = false; });
  }, [onChange]);

  // ── execCommand ──────────────────────────────────────────────────────────
  const exec = useCallback((cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    emitChange();
    updateActiveStates();
  }, [emitChange]);

  // ── Active state query ───────────────────────────────────────────────────
  const updateActiveStates = useCallback(() => {
    try {
      setBubbleActive({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
      });
    } catch {}
  }, []);

  // ── Selection bubble ─────────────────────────────────────────────────────
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) { setBubble(null); return; }
    const range = sel.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) { setBubble(null); return; }
    const rect = range.getBoundingClientRect();
    const edRect = editorRef.current!.getBoundingClientRect();
    setBubble({
      top: rect.top - edRect.top - 48,
      left: Math.max(0, rect.left - edRect.left + rect.width / 2 - 130),
    });
    updateActiveStates();
  }, [updateActiveStates]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); exec('bold'); break;
        case 'i': e.preventDefault(); exec('italic'); break;
        case 'u': e.preventDefault(); exec('underline'); break;
        case 'z': e.preventDefault(); exec(e.shiftKey ? 'redo' : 'undo'); break;
        case 'y': e.preventDefault(); exec('redo'); break;
      }
    }
  }, [exec]);

  // ── Insert link ──────────────────────────────────────────────────────────
  const handleLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  };

  // ── Insert inline framed image ───────────────────────────────────────────
  const insertImage = (url: string, caption: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();

    const figureHtml = `
      <figure data-journal-image="true" contenteditable="false"
        style="margin: 2.5rem 0; padding: 1rem; background: rgba(255, 255, 255, 0.85); border: 1px solid #caccca; border-radius: 1rem; box-shadow: 0 1px 6px rgba(0,0,0,0.06);">
        <img src="${url}" alt="${caption}" style="width: 100%; border-radius: 0.5rem; display: block; aspect-ratio: 16/10; object-fit: cover;" />
        ${caption ? `<figcaption contenteditable="true"
          style="margin-top: 0.75rem; text-align: center; font-size: 0.75rem; color: #8c8e90; letter-spacing: 0.12em; text-transform: uppercase; font-family: var(--font-sans-clean, sans-serif);"
        >${caption}</figcaption>` : ''}
      </figure><p><br></p>`;

    document.execCommand('insertHTML', false, figureHtml);
    emitChange();
  };

  // ── Insert Field Observation callout ─────────────────────────────────────
  const insertCallout = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const calloutHtml = `
      <div data-callout="true" contenteditable="true"
        style="margin: 2rem 0; padding: 1.25rem 1.5rem; background: #fdf8f2; border: 1px solid #c9966a; border-radius: 0.75rem;">
        <span style="font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #18191b; display: block; margin-bottom: 0.35rem; font-family: var(--font-sans-clean, sans-serif);">Field Observation</span>
        <span style="font-style: italic; font-size: 1.1rem; color: #3e4143; font-family: var(--font-serif-luxury, 'Playfair Display', Georgia, serif); line-height: 1.6;">Write field observation here…</span>
      </div><p><br></p>`;
    document.execCommand('insertHTML', false, calloutHtml);
    emitChange();
  };

  // ── Insert pull-quote ────────────────────────────────────────────────────
  const insertPullQuote = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    const selectedText = sel && !sel.isCollapsed ? sel.toString() : 'Write your pull quote here…';
    const quoteHtml = `
      <blockquote data-pullquote="true"
        style="margin: 2.5rem 0; padding: 1.5rem 1.75rem; background: rgba(255,255,255,0.65); border-left: 4px solid #18191b; border-radius: 0.75rem; font-style: italic; font-size: 1.2rem; line-height: 1.75; color: #18191b; box-shadow: 0 1px 4px rgba(0,0,0,0.04);"
      >&ldquo;${selectedText}&rdquo;</blockquote><p><br></p>`;
    document.execCommand('insertHTML', false, quoteHtml);
    emitChange();
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
            {label}
          </label>
          <div className="flex items-center gap-3 text-[11px] font-sans-clean text-[#8c8e90]">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {wordCount} words
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#18191b] font-medium">
              <Clock className="w-3 h-3 text-amber-700" />
              Auto read time: {autoReadTime}
            </span>
          </div>
        </div>
      )}

      {/* Editor Frame */}
      <div className="rounded-2xl border border-[#caccca] bg-white shadow-xs overflow-visible flex flex-col focus-within:border-[#18191b] transition-colors">

        {/* ── Visual Toolbar ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#f7f8f8] border-b border-[#caccca] rounded-t-2xl">

          <Btn title="Undo (Ctrl+Z)" onClick={() => exec('undo')}><Undo2 className="w-3.5 h-3.5" /></Btn>
          <Btn title="Redo (Ctrl+Y)" onClick={() => exec('redo')}><Redo2 className="w-3.5 h-3.5" /></Btn>

          <Divider />

          {/* Style Selector */}
          <select
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => { exec('formatBlock', e.target.value); e.target.value = ''; }}
            defaultValue=""
            className="text-[11px] font-sans-clean text-[#3e4143] bg-transparent border border-[#caccca] rounded px-1.5 py-1 h-7 focus:outline-none hover:bg-[#e4e5e5] cursor-pointer"
          >
            <option value="" disabled>Style</option>
            <option value="p">Paragraph</option>
            <option value="h2">Section Heading</option>
            <option value="h3">Subheading</option>
            <option value="h1">Large Title</option>
          </select>

          <Divider />

          {/* Inline formatting */}
          <Btn title="Bold (Ctrl+B)" onClick={() => exec('bold')} active={bubbleActive.bold}><Bold className="w-3.5 h-3.5" /></Btn>
          <Btn title="Italic (Ctrl+I)" onClick={() => exec('italic')} active={bubbleActive.italic}><Italic className="w-3.5 h-3.5" /></Btn>
          <Btn title="Underline (Ctrl+U)" onClick={() => exec('underline')} active={bubbleActive.underline}><Underline className="w-3.5 h-3.5" /></Btn>
          <Btn title="Strikethrough" onClick={() => exec('strikeThrough')} active={bubbleActive.strikeThrough}><Strikethrough className="w-3.5 h-3.5" /></Btn>

          <Divider />

          {/* Lists */}
          <Btn title="Bullet list" onClick={() => exec('insertUnorderedList')} active={bubbleActive.insertUnorderedList}><List className="w-3.5 h-3.5" /></Btn>
          <Btn title="Numbered list" onClick={() => exec('insertOrderedList')} active={bubbleActive.insertOrderedList}><ListOrdered className="w-3.5 h-3.5" /></Btn>

          <Divider />

          {/* Alignment */}
          <Btn title="Align left" onClick={() => exec('justifyLeft')} active={bubbleActive.justifyLeft}><AlignLeft className="w-3.5 h-3.5" /></Btn>
          <Btn title="Align centre" onClick={() => exec('justifyCenter')} active={bubbleActive.justifyCenter}><AlignCenter className="w-3.5 h-3.5" /></Btn>
          <Btn title="Align right" onClick={() => exec('justifyRight')} active={bubbleActive.justifyRight}><AlignRight className="w-3.5 h-3.5" /></Btn>

          <Divider />

          {/* Rich Content Blocks */}
          <Btn title="Insert In-Journal Image" onClick={() => setShowImageDialog(true)}><ImageIcon className="w-3.5 h-3.5" /></Btn>
          <Btn title="Insert Pull Quote" onClick={insertPullQuote}><Quote className="w-3.5 h-3.5" /></Btn>
          <Btn title="Insert Field Observation Callout" onClick={insertCallout}><Sparkles className="w-3.5 h-3.5" /></Btn>
          <Btn title="Insert Link" onClick={handleLink}><Link className="w-3.5 h-3.5" /></Btn>
          <Btn title="Section Divider" onClick={() => exec('insertHorizontalRule')}><Minus className="w-3.5 h-3.5" /></Btn>
        </div>

        {/* ── Editorial Paper Canvas ────────────────────────────────────── */}
        <div className="relative bg-[#f4f5f5] p-3 sm:p-6 rounded-b-2xl">

          {/* Floating selection bubble */}
          {bubble && (
            <div
              style={{ top: bubble.top, left: bubble.left }}
              className="absolute z-30 flex items-center gap-0.5 bg-[#18191b] text-white rounded-xl px-2 py-1.5 shadow-xl pointer-events-auto animate-in fade-in duration-100"
            >
              {[
                { cmd: 'bold', Icon: Bold, key: 'bold', title: 'Bold' },
                { cmd: 'italic', Icon: Italic, key: 'italic', title: 'Italic' },
                { cmd: 'underline', Icon: Underline, key: 'underline', title: 'Underline' },
              ].map(({ cmd, Icon, key, title }) => (
                <button
                  key={cmd}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
                  title={title}
                  className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${bubbleActive[key] ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  <Icon className="w-3 h-3" />
                </button>
              ))}
              <div className="w-px h-4 bg-white/20 mx-0.5" />
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); insertPullQuote(); }}
                title="Pull quote"
                className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 transition-colors"
              >
                <Quote className="w-3 h-3" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
                title="Link"
                className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 transition-colors"
              >
                <Link className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Paper Document matching max-w-[720px] JournalReadingView layout */}
          <div className="max-w-[720px] mx-auto bg-white rounded-xl shadow-xs border border-[#e4e5e5] px-6 sm:px-12 py-10 transition-all">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={emitChange}
              onKeyDown={handleKeyDown}
              onKeyUp={updateActiveStates}
              onMouseUp={updateActiveStates}
              data-placeholder={placeholder}
              style={{ minHeight }}
              className="focus:outline-none wysiwyg-journal-doc"
            />
          </div>

          {/* Status footer bar */}
          <div className="max-w-[720px] mx-auto mt-3 px-2 flex items-center justify-between text-[11px] font-sans-clean text-[#8c8e90]">
            <span>Tip: Select any text for quick bold/italic/quote shortcuts</span>
            <span>{wordCount} words · {autoReadTime}</span>
          </div>
        </div>
      </div>

      {/* Image Dialog Modal */}
      {showImageDialog && (
        <ImageDialog
          onInsert={insertImage}
          onClose={() => setShowImageDialog(false)}
        />
      )}

      {/* Scoped CSS styling matching live JournalReadingView output */}
      <style>{`
        .wysiwyg-journal-doc {
          font-family: var(--font-serif-luxury, 'Playfair Display', Georgia, serif);
          color: #3e4143;
          font-size: 1.15rem;
          line-height: 1.95;
          font-weight: 300;
        }
        .wysiwyg-journal-doc:empty:before {
          content: attr(data-placeholder);
          color: #8c8e90;
          font-style: italic;
          pointer-events: none;
        }
        .wysiwyg-journal-doc p {
          margin: 0 0 1.5rem;
          font-size: 1.15rem;
          line-height: 1.95;
          color: #3e4143;
          font-weight: 300;
        }
        .wysiwyg-journal-doc h1 {
          font-family: var(--font-serif-luxury, 'Playfair Display', Georgia, serif);
          font-size: 2.25rem;
          font-weight: 300;
          letter-spacing: 0.02em;
          color: #18191b;
          margin: 2.5rem 0 1rem;
          line-height: 1.25;
        }
        .wysiwyg-journal-doc h2 {
          font-family: var(--font-serif-luxury, 'Playfair Display', Georgia, serif);
          font-size: 1.75rem;
          font-weight: 300;
          letter-spacing: 0.02em;
          color: #18191b;
          margin: 2.5rem 0 0.85rem;
          line-height: 1.3;
        }
        .wysiwyg-journal-doc h3 {
          font-family: var(--font-serif-luxury, 'Playfair Display', Georgia, serif);
          font-size: 1.35rem;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: #18191b;
          margin: 2rem 0 0.75rem;
        }
        .wysiwyg-journal-doc b, .wysiwyg-journal-doc strong {
          font-weight: 700;
          color: #18191b;
        }
        .wysiwyg-journal-doc i, .wysiwyg-journal-doc em {
          font-style: italic;
        }
        .wysiwyg-journal-doc u {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .wysiwyg-journal-doc s {
          text-decoration: line-through;
        }
        .wysiwyg-journal-doc a {
          color: #18191b;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .wysiwyg-journal-doc ul {
          list-style: disc;
          padding-left: 1.75rem;
          margin: 1rem 0 1.5rem;
        }
        .wysiwyg-journal-doc ol {
          list-style: decimal;
          padding-left: 1.75rem;
          margin: 1rem 0 1.5rem;
        }
        .wysiwyg-journal-doc li {
          margin: 0.35rem 0;
          line-height: 1.8;
        }
        .wysiwyg-journal-doc hr {
          border: none;
          border-top: 1px solid #caccca;
          margin: 3rem 0;
        }

        /* Pull quote matching reading page */
        .wysiwyg-journal-doc blockquote {
          border-left: 4px solid #18191b;
          padding: 1.5rem 1.75rem;
          margin: 2.5rem 0;
          background: rgba(255, 255, 255, 0.65);
          border-radius: 0.75rem;
          font-style: italic;
          font-size: 1.2rem;
          line-height: 1.75;
          color: #18191b;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }

        /* Inline Framed Print Photo matching reading page */
        .wysiwyg-journal-doc figure[data-journal-image] {
          margin: 2.5rem 0;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid #caccca;
          border-radius: 1rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          user-select: none;
        }
        .wysiwyg-journal-doc figure[data-journal-image] img {
          width: 100%;
          border-radius: 0.5rem;
          display: block;
          aspect-ratio: 16 / 10;
          object-fit: cover;
        }
        .wysiwyg-journal-doc figure[data-journal-image] figcaption {
          margin-top: 0.75rem;
          text-align: center;
          font-size: 0.75rem;
          color: #8c8e90;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: var(--font-sans-clean, sans-serif);
        }
        .wysiwyg-journal-doc figure[data-journal-image] figcaption:focus {
          outline: none;
          color: #18191b;
        }

        /* Field Observation Callout matching reading page */
        .wysiwyg-journal-doc [data-callout] {
          margin: 2rem 0;
          padding: 1.25rem 1.5rem;
          background: #fdf8f2;
          border: 1px solid #c9966a;
          border-radius: 0.75rem;
          cursor: text;
        }
        .wysiwyg-journal-doc [data-callout] span:first-child {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #18191b;
          display: block;
          margin-bottom: 0.35rem;
          font-family: var(--font-sans-clean, sans-serif);
          font-style: normal;
        }
        .wysiwyg-journal-doc [data-callout] span:last-child {
          font-style: italic;
          font-size: 1.1rem;
          color: #3e4143;
          font-family: var(--font-serif-luxury, 'Playfair Display', Georgia, serif);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

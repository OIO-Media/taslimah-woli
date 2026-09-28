'use client';

import React, { useRef, useCallback, useState } from 'react';
import { Bold, Italic, Heading2, Quote, List, Undo2, Redo2 } from 'lucide-react';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  helperText?: string;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  helperText,
  placeholder = 'Write project narrative, statement, or journal paragraphs here...',
  minHeight = '240px',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── History stack ──────────────────────────────────────────────────────────
  const historyRef = useRef<string[]>([value]);
  const historyIndexRef = useRef<number>(0);
  // Tracks whether the last change came from undo/redo so we don't push duplicates
  const skipPushRef = useRef(false);

  const pushHistory = useCallback((newVal: string) => {
    if (skipPushRef.current) { skipPushRef.current = false; return; }
    const stack = historyRef.current.slice(0, historyIndexRef.current + 1);
    // Avoid consecutive identical entries
    if (stack[stack.length - 1] === newVal) return;
    stack.push(newVal);
    // Cap at 200 entries
    if (stack.length > 200) stack.shift();
    historyRef.current = stack;
    historyIndexRef.current = stack.length - 1;
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // Force re-render when history index changes so button disabled state updates
  const [, forceUpdate] = useState(0);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const prev = historyRef.current[historyIndexRef.current];
    skipPushRef.current = true;
    onChange(prev);
    forceUpdate(n => n + 1);
  }, [onChange]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const next = historyRef.current[historyIndexRef.current];
    skipPushRef.current = true;
    onChange(next);
    forceUpdate(n => n + 1);
  }, [onChange]);

  // ── Formatting helpers ─────────────────────────────────────────────────────
  const applyChange = useCallback((nextVal: string) => {
    pushHistory(nextVal);
    onChange(nextVal);
    forceUpdate(n => n + 1);
  }, [onChange, pushHistory]);

  const formatText = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const before = el.value.substring(0, start);
    const after = el.value.substring(end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const nextVal = `${before}${replacement}${after}`;
    applyChange(nextVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 10);
  };

  const insertParagraph = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const before = el.value.substring(0, start);
    const after = el.value.substring(start);
    applyChange(`${before}\n\n${after}`);
  };

  // Push to history on every native textarea change (typing)
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    pushHistory(e.target.value);
    onChange(e.target.value);
    forceUpdate(n => n + 1);
  };

  // Intercept Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z to use our own history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      handleRedo();
    }
  };

  const btnBase = 'p-1.5 rounded transition-colors';
  const btnActive = 'hover:bg-[#e4e5e5] text-[#18191b]';
  const btnDisabled = 'opacity-30 cursor-not-allowed text-[#8c8e90]';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#18191b]">
          {label}
        </label>
        {helperText && <span className="text-[11px] font-sans-clean text-[#8c8e90]">{helperText}</span>}
      </div>

      <div className="border border-[#caccca] rounded-xl overflow-hidden bg-white shadow-2xs focus-within:border-[#18191b] transition-colors">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-[#f7f8f8] border-b border-[#caccca] text-[#3e4143]">

          {/* Undo / Redo */}
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            onClick={handleUndo}
            disabled={!canUndo}
            className={`${btnBase} ${canUndo ? btnActive : btnDisabled}`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            onClick={handleRedo}
            disabled={!canRedo}
            className={`${btnBase} ${canRedo ? btnActive : btnDisabled}`}
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-[#caccca] mx-1" />

          {/* Formatting */}
          <button
            type="button"
            title="Bold"
            onClick={() => formatText('**', '**')}
            className={`${btnBase} ${btnActive}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => formatText('*', '*')}
            className={`${btnBase} ${btnActive}`}
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-[#caccca] mx-1" />

          <button
            type="button"
            title="Heading"
            onClick={() => formatText('\n## ', '\n')}
            className={`${btnBase} ${btnActive}`}
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Blockquote"
            onClick={() => formatText('\n> ', '\n')}
            className={`${btnBase} ${btnActive}`}
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Bullet point"
            onClick={() => formatText('\n• ', '\n')}
            className={`${btnBase} ${btnActive}`}
          >
            <List className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-[#caccca] mx-1" />

          <button
            type="button"
            title="New Paragraph"
            onClick={insertParagraph}
            className="px-2 py-1 text-[11px] font-sans-clean font-medium rounded hover:bg-[#e4e5e5] text-[#18191b] transition-colors"
          >
            Paragraph Break
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-4 font-sans-clean text-sm leading-relaxed text-[#18191b] placeholder:text-[#8c8e90] focus:outline-none resize-y"
        />
      </div>
    </div>
  );
};

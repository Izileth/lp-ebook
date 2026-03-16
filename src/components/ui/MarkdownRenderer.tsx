// src/components/ui/MarkdownRenderer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
  format?: 'markdown' | 'html' | 'json';
  className?: string;
}

/**
 * MarkdownRenderer - A senior-engineered component for content rendering.
 * It uses Tailwind Typography (prose) for journalism-grade aesthetics.
 */
export function MarkdownRenderer({ content, format = 'html', className = '' }: MarkdownRendererProps) {
  // If the format is explicitly 'html', we render it directly (sanitized or raw)
  // For journalism sites, we wrap it in a 'prose' container to ensure consistent styling.
  
  if (format === 'html') {
    return (
      <div 
        className={`prose prose-slate prose-invert max-w-none 
          prose-headings:font-serif prose-headings:text-white 
          prose-p:text-white/80 prose-p:leading-relaxed prose-p:text-lg
          prose-a:text-white prose-a:underline hover:prose-a:opacity-70
          prose-blockquote:border-white/20 prose-blockquote:text-white/50 prose-blockquote:italic
          prose-img:border prose-img:border-white/10
          ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Otherwise, we use react-markdown with GFM support
  return (
    <div className={`prose prose-slate prose-invert max-w-none 
      prose-headings:font-serif prose-headings:text-white 
      prose-p:text-white/80 prose-p:leading-relaxed prose-p:text-lg
      prose-a:text-white prose-a:underline hover:prose-a:opacity-70
      prose-blockquote:border-white/20 prose-blockquote:text-white/50 prose-blockquote:italic
      prose-img:border prose-img:border-white/10
      ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Support HTML inside Markdown strings
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

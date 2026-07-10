'use client';

import { useRef, useState, useCallback, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download, Share2, Instagram, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type ShareableImageProps = {
  trigger: React.ReactNode;
  type: 'message' | 'story';
  data: MessageImageData | StoryImageData;
};

export type MessageImageData = {
  content: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
};

export type StoryImageData = {
  username: string;
  displayName?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  profileUrl: string;
  messageCount?: number;
};

const MessageTemplate = forwardRef<HTMLDivElement, { data: MessageImageData }>(
  ({ data }, ref) => (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1080,
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 40%, #1e1b4b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent)', filter: 'blur(40px)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 60, zIndex: 1 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white' }}>
          S
        </div>
        <span style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>
          Sor<span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bakalım</span>
        </span>
      </div>

      <div style={{ fontSize: 120, lineHeight: 1, color: 'rgba(59,130,246,0.3)', marginBottom: 20, fontFamily: 'Georgia, serif', zIndex: 1 }}>"</div>

      <p style={{ fontSize: 42, lineHeight: 1.5, color: '#f1f5f9', textAlign: 'center', maxWidth: 800, fontWeight: 500, wordBreak: 'break-word', marginBottom: 60, zIndex: 1 }}>
        {data.content}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
        {data.avatarUrl ? (
          <img src={data.avatarUrl} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#93c5fd' }}>
            {data.username.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p style={{ fontSize: 24, fontWeight: 600, color: 'white', margin: 0 }}>{data.displayName ?? data.username}</p>
          <p style={{ fontSize: 20, color: '#94a3b8', margin: 0 }}>@{data.username}</p>
        </div>
      </div>

      <p style={{ position: 'absolute', bottom: 50, fontSize: 20, color: '#64748b' }}>
        sorbakalim.fun/{data.username}
      </p>
    </div>
  )
);
MessageTemplate.displayName = 'MessageTemplate';

const StoryTemplate = forwardRef<HTMLDivElement, { data: StoryImageData }>(
  ({ data }, ref) => (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1920,
        background: 'linear-gradient(180deg, #0a0e1a 0%, #1a1f3a 50%, #1e1b4b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 100,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.18), transparent)', filter: 'blur(50px)' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)', filter: 'blur(50px)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 80, zIndex: 1 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: 'white' }}>
          S
        </div>
        <span style={{ fontSize: 30, fontWeight: 800, color: 'white' }}>
          Sor<span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bakalım</span>
        </span>
      </div>

      {data.avatarUrl ? (
        <img src={data.avatarUrl} alt="" style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', border: '6px solid rgba(59,130,246,0.3)', marginBottom: 40, zIndex: 1 }} />
      ) : (
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, fontWeight: 800, color: '#93c5fd', border: '6px solid rgba(59,130,246,0.3)', marginBottom: 40, zIndex: 1 }}>
          {data.username.slice(0, 2).toUpperCase()}
        </div>
      )}

      <h1 style={{ fontSize: 56, fontWeight: 800, color: 'white', margin: 0, marginBottom: 12, textAlign: 'center', zIndex: 1 }}>
        {data.displayName ?? data.username}
      </h1>
      <p style={{ fontSize: 36, color: '#94a3b8', margin: 0, marginBottom: 32, zIndex: 1 }}>
        @{data.username}
      </p>

      {data.bio && (
        <p style={{ fontSize: 30, color: '#cbd5e1', textAlign: 'center', maxWidth: 800, lineHeight: 1.5, marginBottom: 48, zIndex: 1 }}>
          {data.bio}
        </p>
      )}

      {typeof data.messageCount === 'number' && data.messageCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 60, zIndex: 1, background: 'rgba(255,255,255,0.05)', padding: '16px 32px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.1)' }}>
          <Sparkles size={28} color="#3b82f6" />
          <span style={{ fontSize: 28, color: '#e2e8f0', fontWeight: 600 }}>
            {data.messageCount} anonim mesaj
          </span>
        </div>
      )}

      <div style={{ marginTop: 'auto', marginBottom: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, zIndex: 1 }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', padding: '24px 64px', borderRadius: 100, fontSize: 34, fontWeight: 700, color: 'white' }}>
          Bana anonim mesaj gönder
        </div>
        <p style={{ fontSize: 28, color: '#64748b' }}>
          {data.profileUrl}
        </p>
      </div>
    </div>
  )
);
StoryTemplate.displayName = 'StoryTemplate';

export function ShareableImage({ trigger, type, data }: ShareableImageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const activeRef = type === 'message' ? messageRef : storyRef;

  const generateImage = useCallback(async () => {
    const node = activeRef.current;
    if (!node) return null;
    return toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
      width: 1080,
      height: type === 'story' ? 1920 : 1080,
      style: { transform: 'scale(1)', transformOrigin: 'top left' },
    });
  }, [activeRef, type]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) return;
      const link = document.createElement('a');
      const filename = type === 'story'
        ? `sorbakalim-story-${(data as StoryImageData).username}.png`
        : `sorbakalim-message-${Date.now()}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
      toast.success('Görsel indirildi!');
    } catch {
      toast.error('Görsel oluşturulamadı');
    } finally {
      setDownloading(false);
    }
  }, [generateImage, type, data]);

  const handleShare = useCallback(async () => {
    setDownloading(true);
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) return;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'sorbakalim.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'SorBakalım',
          text: type === 'story'
            ? `Bana anonim mesaj gönder: ${(data as StoryImageData).profileUrl}`
            : 'SorBakalım anonim mesaj',
        });
      } else {
        const link = document.createElement('a');
        link.download = 'sorbakalim.png';
        link.href = dataUrl;
        link.click();
        toast.success('Görsel indirildi! Instagram\'da paylaşabilirsin.');
      }
    } catch {
      toast.error('Paylaşım başarısız, indirip manuel paylaşabilirsin.');
    } finally {
      setDownloading(false);
    }
  }, [generateImage, type, data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-primary" />
            {type === 'story' ? 'Instagram Hikaye Görseli' : 'Instagram Post Görseli'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center">
          <div
            className="overflow-hidden rounded-xl border"
            style={{ width: 270, height: type === 'story' ? 480 : 270 }}
          >
            <div
              style={{
                transform: `scale(${270 / 1080})`,
                transformOrigin: 'top left',
                width: 1080,
                height: type === 'story' ? 1920 : 1080,
              }}
            >
              {type === 'message' ? (
                <MessageTemplate ref={messageRef} data={data as MessageImageData} />
              ) : (
                <StoryTemplate ref={storyRef} data={data as StoryImageData} />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownload} disabled={downloading} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            İndir
          </Button>
          <Button onClick={handleShare} disabled={downloading} variant="outline" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Paylaş
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Görseli indirip Instagram'da post veya hikaye olarak paylaşabilirsin
        </p>
      </DialogContent>
    </Dialog>
  );
}

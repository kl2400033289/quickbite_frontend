import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';

interface CaptchaFieldProps {
  value: string;
  onChange: (value: string) => void;
  onCaptchaIdChange: (captchaId: string) => void;
  refreshTrigger?: number;
}

export const CaptchaField: React.FC<CaptchaFieldProps> = ({
  value,
  onChange,
  onCaptchaIdChange,
  refreshTrigger = 0,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCaptcha = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await authService.getCaptcha();
      setImageUrl(res.imageDataUrl);
      onCaptchaIdChange(res.captchaId);
    } catch {
      setLoadError('Could not load CAPTCHA from Auth Service.');
    } finally {
      setIsLoading(false);
    }
  }, [onCaptchaIdChange]);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha, refreshTrigger]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-tangerine-600" />
          <span>Security CAPTCHA</span>
        </label>
        <button
          type="button"
          onClick={() => {
            onChange('');
            loadCaptcha();
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-tangerine-600 hover:text-tangerine-700 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          <span>New Code</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="shrink-0 h-14 w-full sm:w-[180px] rounded-xl border border-warm-200 bg-[#FFF7ED] flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="CAPTCHA challenge"
              className="h-14 w-[180px] object-contain select-none"
              draggable={false}
            />
          ) : (
            <span className="text-[11px] text-charcoal-600">
              {loadError || 'Loading...'}
            </span>
          )}
        </div>

        <input
          type="text"
          required
          autoComplete="off"
          maxLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Enter 5-char code"
          className="flex-1 px-4 py-3.5 bg-warm-50 border border-warm-200 rounded-xl text-sm font-mono font-bold tracking-widest uppercase text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30 focus:border-tangerine-500 transition-all"
        />
      </div>
    </div>
  );
};


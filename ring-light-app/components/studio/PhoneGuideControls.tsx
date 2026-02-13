'use client';

import { useEffect, useMemo, useState } from 'react';
import { Smartphone } from 'lucide-react';
import { useLightContext } from '@/context/LightContext';
import { PHONE_GUIDE_MODELS } from '@/lib/phoneGuideModels';
import { isValidPxPerMm } from '@/lib/phoneGuideSizing';

const CARD_WIDTH_MM = 85.6;

export default function PhoneGuideControls() {
  const {
    settings,
    setPhoneGuideEnabled,
    setPhoneGuideModel,
    setPhoneGuideOrientation,
    setPhoneGuideCalibration,
    resetPhoneGuide,
  } = useLightContext();

  const calibrationValue = settings.phoneGuide.calibration.pxPerMm;
  const [draftPxPerMm, setDraftPxPerMm] = useState<number>(calibrationValue ?? 3);

  useEffect(() => {
    setDraftPxPerMm(calibrationValue ?? 3);
  }, [calibrationValue]);

  const cardPreviewWidth = useMemo(
    () => Math.max(76, Math.min(340, draftPxPerMm * CARD_WIDTH_MM)),
    [draftPxPerMm]
  );

  return (
    <section className="phone-guide-controls rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          <Smartphone className="h-4 w-4 text-electric-blue" aria-hidden="true" />
          Phone Guide
        </p>

        <button
          type="button"
          onClick={() => setPhoneGuideEnabled(!settings.phoneGuide.enabled)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            settings.phoneGuide.enabled
              ? 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'
              : 'bg-white/10 text-white/70 hover:bg-white/15'
          }`}
          aria-pressed={settings.phoneGuide.enabled}
        >
          {settings.phoneGuide.enabled ? 'Enabled' : 'Enable'}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="phone-guide-model"
            className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-white/55"
          >
            iPhone model / size
          </label>
          <select
            id="phone-guide-model"
            value={settings.phoneGuide.modelId}
            onChange={(event) => setPhoneGuideModel(event.target.value)}
            className="w-full rounded-lg border border-white/12 bg-black/35 px-3 py-2 text-sm text-white/85"
            disabled={!settings.phoneGuide.enabled}
          >
            {PHONE_GUIDE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-white/55">
            Orientation
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(['portrait', 'landscape'] as const).map((orientation) => {
              const isActive = settings.phoneGuide.orientation === orientation;

              return (
                <button
                  key={orientation}
                  type="button"
                  onClick={() => setPhoneGuideOrientation(orientation)}
                  disabled={!settings.phoneGuide.enabled}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                    isActive
                      ? 'bg-hot-pink/20 text-hot-pink border border-hot-pink/40'
                      : 'bg-white/8 text-white/65 border border-white/10 hover:bg-white/12'
                  }`}
                >
                  {orientation}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-white/55">Drag guide on screen to reposition.</p>
          <button
            type="button"
            onClick={resetPhoneGuide}
            disabled={!settings.phoneGuide.enabled}
            className="rounded-lg border border-white/12 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10 transition-colors"
          >
            Reset guide
          </button>
        </div>

        <details className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
          <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.15em] text-white/65">
            Quick calibrate
          </summary>

          <div className="mt-3 space-y-3">
            <p className="text-xs text-white/55">
              Hold a bank card against your screen and adjust until the bar below
              matches card width ({CARD_WIDTH_MM}mm).
            </p>

            <div className="rounded-lg border border-white/10 bg-black/35 p-3">
              <div
                className="mx-auto h-8 rounded-md border border-electric-blue/55 bg-electric-blue/15"
                style={{ width: `${cardPreviewWidth}px` }}
              />
              <p className="mt-2 text-center text-[11px] uppercase tracking-[0.13em] text-white/55">
                Reference card width
              </p>
            </div>

            <div>
              <label
                htmlFor="px-per-mm"
                className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-white/55"
              >
                Pixels per mm: {draftPxPerMm.toFixed(2)}
              </label>
              <input
                id="px-per-mm"
                type="range"
                min={0.8}
                max={8}
                step={0.02}
                value={draftPxPerMm}
                onChange={(event) => setDraftPxPerMm(Number(event.target.value))}
                className="custom-slider w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isValidPxPerMm(draftPxPerMm)) {
                    setPhoneGuideCalibration(draftPxPerMm);
                  }
                }}
                className="rounded-lg bg-hot-pink/25 px-3 py-1.5 text-xs font-semibold text-hot-pink hover:bg-hot-pink/35 transition-colors"
              >
                Save calibration
              </button>
              <button
                type="button"
                onClick={() => setPhoneGuideCalibration(null)}
                className="rounded-lg border border-white/12 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10 transition-colors"
              >
                Clear calibration
              </button>
              <span className="text-[11px] text-white/55">
                {calibrationValue
                  ? `Saved (${calibrationValue.toFixed(2)} px/mm)`
                  : 'No calibration saved'}
              </span>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

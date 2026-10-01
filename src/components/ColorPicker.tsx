import { PRESET_COLORS } from '@/types';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`h-8 w-8 rounded-full transition-all duration-200 ${
            value === color
              ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
              : 'hover:scale-110'
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Cor ${color}`}
        />
      ))}
    </div>
  );
}

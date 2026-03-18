'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer shrink-0 rounded-[2px] border border-bom-black bg-background shadow-none transition-colors',
        'focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-bom-black/25 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-bom-black data-[state=checked]:text-bom-white',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <Check className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

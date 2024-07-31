import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

type Value<T> = { label: string; value: T };

type ComboBoxProps<T> = {
  className?: string;
  placeholder?: string;
  value?: Value<T>;
  values: Array<Value<T>>;
  searchBar?: boolean;
  onChange: (value: T | undefined) => void;
};

export default function ComboBox<T>({
  className,
  placeholder = 'Select',
  values,
  value,
  searchBar = true,
  onChange,
}: ComboBoxProps<T>) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  const currentLabel = value?.label;

  function handleSelect(item: Value<T>) {
    if (currentLabel === item.label) {
      onChange(undefined);
    } else {
      onChange(item.value);
    }
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'w-[200px] justify-between capitalize border-none shadow-md bg-white dark:bg-transparent dark:border-solid',
            className,
          )}
          title=""
          role="combobox"
          variant="outline"
        >
          {value ? value.label.toLowerCase() || placeholder : placeholder}
          <ChevronUpDownIcon className="ml-auto h-5 w-5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] bg-card p-0 z-50">
        <div className="mt-0.5 divide-y">
          {searchBar && (
            <div className="flex gap-1 p-1">
              <div>
                <MagnifyingGlassIcon className="h-5 w-5" />
              </div>
              <input
                className="border-none bg-transparent font-thin outline-none"
                value={input}
                placeholder="Search"
                onChange={(event) => setInput(event.currentTarget.value)}
              />
            </div>
          )}
          <div className="grid gap-1 p-1">
            {values.map((item) => (
              <Button
                className={cn('justify-start capitalize hover:bg-brand', {
                  'bg-brand text-background': item.label === currentLabel,
                })}
                key={item.label}
                variant="ghost"
                onClick={() => handleSelect(item)}
              >
                {item.label.toLowerCase()}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

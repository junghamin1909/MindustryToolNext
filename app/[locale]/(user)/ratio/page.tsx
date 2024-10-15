'use client';

import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Tran from '@/components/common/tran';
import { blocks, Factory, Value } from '@/app/[locale]/(user)/ratio/block-data';
import Image from 'next/image';

type Tree = {
  factory: Factory;
  children?: Record<string, Tree>;
};

export default function Page() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const [value, setValue] = useState<Tree>();

  function handleSelect(item: Factory) {
    setValue({ factory: item });
    setOpen(false);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 overflow-auto p-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="h-12 min-w-[200px] justify-between border-none bg-secondary p-2 capitalize shadow-md"
            title=""
            role="combobox"
            variant="outline"
          >
            {value ? (
              <div className="flex items-center justify-start gap-2">
                <Image
                  className="h-8 w-8"
                  src={`/assets/sprite/${value.factory.name}.png`}
                  height={32}
                  width={32}
                  alt={value.factory.name}
                />
                <Tran text={`ratio.${value.factory.name}`} />
              </div>
            ) : (
              <Tran text="ratio.select-block" />
            )}
            <ChevronUpDownIcon className="ml-auto size-5 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-50 min-w-[200px] bg-card p-0">
          <div className="mt-0.5 divide-y">
            <div className="flex gap-1 p-1">
              <div>
                <MagnifyingGlassIcon className="size-5" />
              </div>
              <input
                className="border-none bg-transparent font-thin outline-none"
                value={filter}
                placeholder="Search"
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
            </div>
            <div className="flex flex-col gap-2 p-1">
              {blocks.map((item) => (
                <Button
                  className="flex items-center justify-start gap-2 text-start capitalize hover:bg-muted"
                  key={item.name}
                  variant="ghost"
                  onClick={() => handleSelect(item)}
                >
                  <Image
                    className="h-8 w-8"
                    src={`/assets/sprite/${item.name}.png`}
                    height={32}
                    width={32}
                    alt={item.name}
                  />
                  <Tran text={`ratio.${item.name}`} />
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {value && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-start bg-card py-2 border">
            <Image
              className="h-8 w-8"
              src={`/assets/sprite/${value.factory.name}.png`}
              height={32}
              width={32}
              alt={value.factory.name}
            />
            <Tran text={`ratio.${value.factory.name}`} />
          </div>
          <div className="flex justify-evenly gap-2">
            {value.factory.input.map((input, index) => (
              <RequirementCard key={index} input={input} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type RequirementCardProps = {
  input: Value;
};

function RequirementCard({ input }: RequirementCardProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const [value, setValue] = useState<Factory>();

  function handleSelect(item: Factory) {
    setValue(item);
    setOpen(false);
  }

  const filtered = blocks.filter(
    (block) =>
      block.name.includes(filter) &&
      block.output.some((output) => output.name === input.name),
  );

  return (
    <div className="flex flex-col items-center justify-start gap-6 bg-card p-2 border">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="h-12 p-0" title="" variant="icon">
            <div className="flex items-center gap-1">
              <Image
                className="h-8 w-auto"
                src={`/assets/sprite/${input.icon}-ui.png`}
                alt={input.name}
                width={32}
                height={32}
              />
              {input.rate}/s
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-50 min-w-[200px] bg-card p-0">
          <div className="mt-0.5 divide-y">
            <div className="flex gap-1 p-1">
              <div>
                <MagnifyingGlassIcon className="size-5" />
              </div>
              <input
                className="border-none bg-transparent font-thin outline-none"
                value={filter}
                placeholder="Search"
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
            </div>
            <div className="grid gap-2 p-1">
              {filtered.map((item) => (
                <Button
                  className="flex items-center justify-start gap-2 text-start capitalize hover:bg-muted"
                  key={item.name}
                  variant="ghost"
                  onClick={() => handleSelect(item)}
                >
                  <Image
                    className="h-8 w-8"
                    src={`/assets/sprite/${item.name}.png`}
                    height={32}
                    width={32}
                    alt={item.name}
                  />
                  <Tran text={`ratio.${item.name}`} />
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {value && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-start">
            <Image
              className="h-8 w-8"
              src={`/assets/sprite/${value.name}.png`}
              height={32}
              width={32}
              alt={value.name}
            />
            <Tran text={`ratio.${value.name}`} />
          </div>
          <div className="flex justify-evenly gap-2">
            {value.input.map((input) => (
              <RequirementCard key={input.name} input={input} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

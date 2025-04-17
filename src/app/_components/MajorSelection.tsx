"use client";

import { getMajors } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Major } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GenerateHeatmapButton from "./GenerateHeatmapButton";

export default function MajorSelection({
  selected,
  setSelected,
  onGenerateClick,
  isGenerating,
}: {
  selected: Major[];
  setSelected: (majors: Major[]) => void;
  onGenerateClick: () => void;
  isGenerating: boolean;
}) {
  const { data: majors = [] } = useQuery({
    queryKey: ["majors"],
    queryFn: () => getMajors(),
  });

  const [openPopover, setOpenPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const CommandInputRef = useRef<HTMLInputElement>(null);
  const CommandListRef = useRef<HTMLDivElement>(null);

  const removeSelection = (major: Major) => {
    setSelected(selected.filter((s) => s.id !== major.id));
  };

  const updateSelection = (major: Major) => {
    selected.includes(major)
      ? removeSelection(major)
      : setSelected([...selected, major]);

    setTimeout(() => {
      CommandInputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (CommandListRef.current) {
      CommandListRef.current.scrollTop = 0;
    }
  }, [searchQuery]);

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={openPopover}
            variant="outline"
            className="hover:cursor-pointer w-xs"
          >
            {selected.length === 0 && "Click here to select!"}
            {selected.length === 1 && `Selected ${selected.length} major`}
            {selected.length > 1 && `Selected ${selected.length} majors`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-xs">
          <Command>
            <CommandInput
              ref={CommandInputRef}
              placeholder="Search majors..."
              onValueChange={setSearchQuery}
            />
            <CommandList ref={CommandListRef}>
              <CommandEmpty>No majors found.</CommandEmpty>
              {majors.map((major) => (
                <CommandItem
                  key={major.id}
                  value={`${major.abbr}${major.name}`}
                  onSelect={() => updateSelection(major)}
                  className="cursor-pointer"
                >
                  {selected.includes(major) ? (
                    <Check className="text-muted-foreground" />
                  ) : (
                    <Check className="opacity-0" />
                  )}
                  {`${major.name} (${major.abbr})`}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <GenerateHeatmapButton
        onClick={onGenerateClick}
        isLoading={isGenerating}
      />

      {selected.length > 0 && (
        <div className="flex overflow-y-auto flex-wrap gap-2 justify-center max-w-lg">
          {selected.map((major) => (
            <Badge
              key={major.id}
              variant="secondary"
              className="cursor-pointer"
              title={`Remove ${major.name}`}
              onMouseDown={() => removeSelection(major)}
            >
              {major.name}
            </Badge>
          ))}
        </div>
      )}
    </>
  );
}

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

export default function MajorSelection() {
  const { data: majors = [] } = useQuery({
    queryKey: ["majors"],
    queryFn: () => getMajors(),
  });

  const [selected, setSelected] = useState<Major[]>([]);
  const [openPopover, setOpenPopover] = useState(false);

  /* What's currently in the input */
  const [searchQuery, setSearchQuery] = useState("");

  const CommandInputRef = useRef<HTMLInputElement>(null);
  const CommandListRef = useRef<HTMLDivElement>(null);

  const removeSelection = (major: Major) => {
    setSelected(selected.filter((s) => s.id !== major.id));
  };

  const addSelection = (major: Major) => {
    /* Add item, sort by Major.abbreviation (order that selection list is in) */
    setSelected(
      [...selected, major].toSorted((a: Major, b: Major) =>
        a.abbr.localeCompare(b.abbr),
      ),
    );
  };

  const updateSelection = (major: Major) => {
    /* Remove the major from the selected list if it's already there */
    /* Otherwise, add it to the selected list */
    selected.includes(major) ? removeSelection(major) : addSelection(major);

    /* Focus the input after selection */
    setTimeout(() => {
      CommandInputRef.current?.focus();
    }, 0);
  };

  /* Reset scroll position when search query changes */
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
                    /* Use opacity-0 to get spacing but not visibility */
                    <Check className="opacity-0" />
                  )}

                  {`${major.name} (${major.abbr})`}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <GenerateHeatmapButton />

      {selected.length > 0 && (
        <div className="flex overflow-y-auto flex-wrap gap-2 justify-center max-w-lg">
          {selected.map((major) => (
            <Badge
              key={major.id}
              variant="secondary"
              className="cursor-pointer hover:line-through hover:opacity-85"
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

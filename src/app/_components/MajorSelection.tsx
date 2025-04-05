"use client";

import { getMajors } from "@/app/actions";
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
import { Major } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type MajorSelectionItem = {
  id: number;
  value: string;
  selected?: Major;
};

export default function MajorSelection() {
  const { data: majors = [] } = useQuery({
    queryKey: ["majors"],
    queryFn: () => getMajors(),
  });

  const [selectors, setSelectors] = useState<MajorSelectionItem[]>([
    { id: 0, value: "" },
  ]);

  const [openPopover, setOpenPopover] = useState<number | null>(null);

  const addSelector = () => {
    setSelectors((prev) => [
      ...prev,
      { id: Date.now(), value: "" },
    ]);
  };

  const removeSelector = (id: number) => {
    setSelectors((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSelection = (id: number, major: Major) => {
    setSelectors((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, value: `${major.name} (${major.abbr})`, selected: major } : s
      )
    );
    setOpenPopover(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {selectors.map((selector, index) => (
        <div key={selector.id} className="flex items-center gap-2">
          {index === 0 ? (
            <button onClick={addSelector} className="p-2">
              <Plus />
            </button>
          ) : (
            <button
              onClick={() => removeSelector(selector.id)}
              className="text-red-500 p-2"
            >
              <Trash2 />
            </button>
          )}

          <Popover
            open={openPopover === selector.id}
            onOpenChange={(isOpen) =>
              setOpenPopover(isOpen ? selector.id : null)
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="justify-between w-[250px]"
              >
                {selector.value || "Click here to select!"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[250px]">
              <Command>
                <CommandInput placeholder="Search majors..." />
                <CommandList>
                  <CommandEmpty>No majors found.</CommandEmpty>
                  {majors.map((major) => (
                    <CommandItem
                      key={major.id}
                      value={`${major.name}${major.abbr}`}
                      onSelect={() => updateSelection(selector.id, major)}
                    >
                      {`${major.name} (${major.abbr})`}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
}

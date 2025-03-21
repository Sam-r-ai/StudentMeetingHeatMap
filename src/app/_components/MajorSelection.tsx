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

export default function MajorSelection() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<Major>();

  const { data: majors = [], isLoading } = useQuery({
    queryKey: ["majors"],
    queryFn: () => {
      return getMajors();
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-md"
        >
          {selected
            ? `${selected.name} (${selected.abbr})`
            : "Click here to select!"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-md">
        <Command>
          <CommandInput placeholder="Search majors..." />
          <CommandList>
            <CommandEmpty>No majors found.</CommandEmpty>
            {majors.map((major) => (
              <CommandItem
                key={major.id}
                value={`${major.name}${major.abbr}`}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setSelected(major);
                  setOpen(false);
                }}
              >
                {`${major.name} (${major.abbr})`}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

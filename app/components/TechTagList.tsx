"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { TechTag } from "@/lib/types";
import TagPill from "./TagPill";
import TagPopup from "./TagPopup";

/**
 * Daftar tech pill yang bisa diklik untuk membuka popup penjelasan tag.
 * Nama dicocokkan ke tabel tech_tags secara case-insensitive.
 */
export default function TechTagList({
  names,
  techTags,
}: {
  names: string[];
  techTags: TechTag[];
}) {
  const [selected, setSelected] = useState<TechTag | null>(null);
  const tagsByName = new Map(techTags.map((t) => [t.name.toLowerCase(), t]));

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {names.map((name) => {
          const tag = tagsByName.get(name.toLowerCase());
          return (
            <TagPill
              key={name}
              icon={tag?.icon ?? null}
              label={name}
              onClick={tag ? () => setSelected(tag) : undefined}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {selected && <TagPopup tag={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

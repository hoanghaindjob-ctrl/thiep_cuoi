import type { Invitation } from "@/types/invitation";

/** Everything the editor can replace with an uploaded file. */
export type UploadTarget =
  | "hero"
  | "groomPhoto"
  | "bridePhoto"
  | "gallery"
  | "music";

export interface EditorFieldsProps {
  data: Invitation;
  update: (
    patch: Partial<Invitation> | ((current: Invitation) => Partial<Invitation>),
  ) => void;
  event: (key: keyof Invitation["event"], value: string) => void;
  upload: (file: File | undefined, target: UploadTarget) => Promise<void>;
}

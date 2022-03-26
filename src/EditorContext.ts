export interface EditorContext {
  audioBlob: Blob;
  audioRecorder: MediaRecorder | null;
  audioType: "" | "wave" | "ogg";
}

export function createEditorContext(initial?: Partial<EditorContext>): EditorContext {
  return {
    audioBlob: initial?.audioBlob ?? new Blob(),
    audioRecorder: initial?.audioRecorder ?? null,
    audioType: initial?.audioType ?? "",
  };
}


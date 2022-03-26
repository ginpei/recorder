export interface EditorContext {
  audioBlob: Blob;
  audioRecorder: MediaRecorder | null;
  audioType: "" | "wave" | "ogg";
  originalAudioBlob: Blob;
}

export function createEditorContext(initial?: Partial<EditorContext>): EditorContext {
  return {
    audioBlob: initial?.audioBlob ?? new Blob(),
    audioRecorder: initial?.audioRecorder ?? null,
    audioType: initial?.audioType ?? "",
    originalAudioBlob: initial?.originalAudioBlob ?? new Blob(),
  };
}


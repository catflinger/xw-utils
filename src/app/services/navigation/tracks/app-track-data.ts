import { PuzzleProvider } from 'src/app/model3/interfaces';

export type EditorType = "blogger" | "solver";

export interface AppTrackData {
    provider?: PuzzleProvider;
    errorMessage?: string;
}

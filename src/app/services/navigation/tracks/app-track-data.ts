import { PuzzleProvider } from 'src/app/model/interfaces';

export type EditorType = "blogger" | "solver";

export interface AppTrackData {
    provider?: PuzzleProvider;
    errorMessage?: string;
}

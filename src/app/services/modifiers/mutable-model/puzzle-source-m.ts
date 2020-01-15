import { IPuzzleSource } from 'src/app/model/interfaces';
import { TextParsingErrorM } from './text-parsing-error-m';
import { TextParsingWarningM } from './text-parsing-warning-m';

export abstract class PuzzleSourceM implements IPuzzleSource {
    public abstract source: string;
    public abstract parseErrors: TextParsingErrorM[];
    public abstract parseWarnings: TextParsingWarningM[];
}
import { IPuzzleProvision } from 'src/app/model/interfaces';
import { TextParsingErrorM } from './text-parsing-error-m';
import { TextParsingWarningM } from './text-parsing-warning-m';

export abstract class PuzzleProvisionM implements IPuzzleProvision {
    public abstract source: string;
    public abstract parseErrors: TextParsingErrorM[];
    public abstract parseWarnings: TextParsingWarningM[];
}
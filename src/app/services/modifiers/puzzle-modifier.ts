import { PuzzleM } from './mutable-model/puzzle-m';

export interface IPuzzleModifier {
    exec(puzzle: PuzzleM);
};

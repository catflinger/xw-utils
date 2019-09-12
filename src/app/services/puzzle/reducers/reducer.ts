import { PuzzleM } from './mutable-model/puzzle-m';

export interface IReducer {
    exec(puzzle: PuzzleM);
};

import { IPuzzle } from '../../model/puzzle';

export interface IReducer {
    exec(puzzle: IPuzzle);
};

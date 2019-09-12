import { IPuzzle } from 'src/app/model/interfaces';

export interface IReducer {
    exec(puzzle: IPuzzle);
};

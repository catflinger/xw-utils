import { Grid } from '../../../model/puzzle-model/grid';

export class ParseData {

    // a grid, probably retrieved from somewhere else
    grid: Grid = null;

    // the raw data, probably scraped form a website
    rawData: string = "";

    // what sort of data is it? eg text, guardian, indy etc 
    clueDataType: string = "text"; 
}
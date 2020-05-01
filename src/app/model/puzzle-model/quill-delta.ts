import { IQuillDelta, IDeltaOperation } from '../../model3/interfaces';

export class QuillDelta implements IQuillDelta {
    ops: IDeltaOperation[] = [];

    constructor(data?: any) {
        if (data && Array.isArray(data.ops)){
            data.ops.forEach(op =>this.ops.push(op));
        }
    }
}
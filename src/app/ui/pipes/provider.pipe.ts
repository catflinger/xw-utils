import { Pipe, PipeTransform } from '@angular/core';
import { ProviderService } from 'src/app/services/puzzles/provider.service';

@Pipe({ name: 'provider', pure: false })
export class ProviderPipe implements PipeTransform {
    constructor(private ps: ProviderService) {
    }

    transform(content: string) {
        return this.ps.getProviderString(content);
    }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordpressId'
})
export class WordpressIdPipe implements PipeTransform {

    transform(content: string) {
        return content ? "Published" : "";
    }

}

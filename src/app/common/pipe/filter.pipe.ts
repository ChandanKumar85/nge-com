import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, searchTerm: any): any {
    return value.filter(function(search: { title: string; }){
      return search.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    });
  }

}

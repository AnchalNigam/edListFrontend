import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: Array<object>,args?: any): any {
  
    if (array == null) {
      return null;
    }
    let finalArray=array.sort((a,b)=>{
     
      let textA=a['value'].toLowerCase();
      let textB=b['value'].toLowerCase();
      return textA<textB ?-1 : (textA>textB)? 1:0;

    });
    return finalArray;
  }

}

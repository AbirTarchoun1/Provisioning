import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByProduct'
})
export class FilterByProductPipe implements PipeTransform {

    transform(modules: any[], selectedProduct: string): any[] {
        if (!selectedProduct) {
          return modules;
        }
        return modules.filter(module => module.productIds.includes(selectedProduct));
      }
    

}
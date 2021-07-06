import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

export class SortableData {
  elements: any[] | undefined;
  sortProperty: string | undefined;
  sortOrder: "asc" | "desc" | undefined;
}

function compare(a: number | string, b: number | string) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

@Directive({
  selector: '[appSort]',
})
export class SortDirective {

  @Input() appSort: SortableData | undefined;
  constructor(private renderer: Renderer2, private targetElem: ElementRef) { }

  @HostListener("click")
  sortData() {

    if (this.appSort == null || this.appSort.elements == undefined) {
      return;
    }

    const elem = this.targetElem.nativeElement;
    const property = elem.getAttribute("data-name");

    if (this.appSort.sortOrder === 'asc' && this.appSort.sortProperty === property) {
      this.appSort.elements.sort((a, b) => compare(b[property], a[property]));
      this.appSort.sortOrder = 'desc';
    } else {
      this.appSort.elements.sort((a, b) => compare(a[property], b[property]));
      this.appSort.sortProperty = property;
      this.appSort.sortOrder = 'asc';
    }

    console.log(this.appSort);
  }
}
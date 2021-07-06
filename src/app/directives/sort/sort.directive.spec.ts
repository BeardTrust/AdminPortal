import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SortableData, SortDirective } from './sort.directive';


@Component({
  template: `<div id="clickMe" [appSort]="sortData" data-name="lastName"></div>`
})
class TestSortDirectiveComponent {
  sortData: SortableData = {
    elements: [
      {
        "firstName": "Krombopulos",
        "lastName": "Michael"
      },
      {
        "firstName": "Shadow",
        "lastName": "Mere"
      }
    ],
    sortProperty: undefined,
    sortOrder: undefined
  };
}

describe('SortDirective', () => {

  let fixture: ComponentFixture<TestSortDirectiveComponent>;
  let des: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SortDirective, TestSortDirectiveComponent],
    }).createComponent(TestSortDirectiveComponent);
    fixture.detectChanges();
    des = fixture.debugElement.queryAll(By.directive(SortDirective));
  });

  it('should apply to the correct element in this test', () => {
    expect(des.length).toBe(1);
    expect(des[0].nativeElement.id).toBe('clickMe');
  });

  it('modifies sortData', () => {

    des[0].nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.sortData.sortOrder).toBe("asc");
    expect(fixture.componentInstance.sortData.sortProperty).toBe("lastName");

    expect(fixture.componentInstance.sortData.elements).not.toBeUndefined();
    if (fixture.componentInstance.sortData.elements)
      expect(fixture.componentInstance.sortData.elements[0].lastName).toBe("Mere");

    des[0].nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.sortData.sortOrder).toBe("desc");
    expect(fixture.componentInstance.sortData.sortProperty).toBe("lastName");

    expect(fixture.componentInstance.sortData.elements).not.toBeUndefined();
    if (fixture.componentInstance.sortData.elements)
      expect(fixture.componentInstance.sortData.elements[0].lastName).toBe("Michael");
  });
});

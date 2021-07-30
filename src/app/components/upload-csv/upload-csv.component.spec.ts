import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';

import { UploadCsvComponent } from './upload-csv.component';

class MockHTMLInput {
  files: Array<File>;
  constructor() {
    this.files = new Array<File>();
    let content = "Hello World";
    let data = new Blob([content], { type: 'text/plain' });
    let arrayOfBlob = new Array<Blob>();
    arrayOfBlob.push(data);
    let file = new File(arrayOfBlob, "Mock.csv");
    this.files.push(file);
  }
}

describe('UploadCsvComponent', () => {

  let mockService: any;

  let component: UploadCsvComponent;
  let fixture: ComponentFixture<UploadCsvComponent>;

  beforeEach(async () => {

    mockService = jasmine.createSpyObj(['uploadCsv']);
    mockService.uploadCsv.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [UploadCsvComponent],
      providers: [{ provide: HttpService, useValue: mockService }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads file', () => {

    expect(component.fileContents.status).toBe("notYetPending");
    component.setFile(<any>{ target: <any>{ files: [] } });
    expect(component.fileContents.status).toBe("notYetPending");

    let arrayOfBlob = new Array<Blob>();
    arrayOfBlob.push(new Blob(["some data"], { type: 'text/csv' }));
    var files = new Array<File>();
    files.push(new File(arrayOfBlob, "some.csv"));
    component.setFile(<any>{ target: <any>{ files } });
    expect(component.fileContents.status).toBe("pending");
  });

  it('sets fileContents.status correctly', () => {
    component.setFileContents(undefined);
    expect(component.fileContents.status).toBe("error");
    component.setFileContents("a\n1,2");
    expect(component.fileContents.status).toBe("warning");
    component.setFileContents("a,b\n1,2");
    expect(component.fileContents.status).toBe("success");
  });

  it('uploads csv', () => {

    component.fileContents = { status: "error" };
    expect(() => component.uploadCsv()).toThrow();

    component.fileContents = { status: "success", content: "a,b\n1,2" };
    component.uploadCsv();
    expect(component.fileUploadStatus).toBe("success");

    mockService.uploadCsv.and.returnValue(throwError(() => "some error"));
    component.uploadCsv();
    expect(component.fileUploadStatus).toBe("error");
  });
});
function mockClass(FileReader: { new(): FileReader; prototype: FileReader; readonly DONE: number; readonly EMPTY: number; readonly LOADING: number; }) {
  throw new Error('Function not implemented.');
}


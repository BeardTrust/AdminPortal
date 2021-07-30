import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { parse } from 'papaparse';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent implements OnInit {

  file?: File;

  fileContents: {
    status: "notYetPending" | "pending" | "success" | "warning" | "error",
    content?: string,
    warningMessage?: string
  } = { status: "notYetPending" };

  fileUploadStatus: "notYetPending" | "pending" | "success" | "error" = "notYetPending";

  fileReadSubscription?: Subscription;
  fileUploadSubscription?: Subscription;

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  setFile(event: Event) {

    this.fileReadSubscription?.unsubscribe();
    this.fileReadSubscription = undefined;

    this.file = (<any>event).target.files[0];

    if (this.file) {
      this.fileContents = { status: "pending" };
      const fileReader = new FileReader();
      const fileReaderObservable = fromEvent(fileReader, 'load');
      fileReaderObservable.subscribe(() => this.setFileContents(fileReader.result?.toString()), this.setFileContents);
      fileReader.readAsText(this.file);
    } else {
      this.fileContents = { status: "notYetPending" };
    }
  }

  setFileContents(content?: string) {

    if (content === undefined) {
      this.fileContents = { status: "error" };
      return;
    }

    this.fileContents = { status: (parse(content).errors.length === 0) ? "success" : "warning", content };
  }

  uploadCsv(){

    if (this.fileContents.content === undefined) {
      throw "Cannot upload csv: fileContents.content is undefined";
    }

    this.fileUploadStatus = "pending";
    this.fileUploadSubscription?.unsubscribe();

    this.fileUploadSubscription = this.httpService.uploadCsv(this.fileContents.content).subscribe(() => {
      this.fileUploadStatus = "success";
    }, (err) => {
      console.error("Failed to upload csv", err);
      this.fileUploadStatus = "error";
    })
  }
}

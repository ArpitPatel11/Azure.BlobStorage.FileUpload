import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}
  files: string[] = [];
  fileToUpload!: FormData;
  showLoader: boolean = false;
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  private url = 'https://localhost:7016/api/Azure';

  ngOnInit(): void {
    this.showBlobs();
  }
  title = 'azure.blobstorage.client';

  requestHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    };

    return { headers };
  }

  showBlobs() {
    this.showLoader = true;
    this.http.get<string[]>(this.url + '/ListFiles').subscribe({
      next: (result) => {
        this.files = result;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.showLoader = false;
      },
    });
  }

  onClick() {
    let fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      this.showLoader = true;
      const file = fileUpload.files[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.http.post(this.url + '/InsertFile', formData).subscribe({
        next: (response: any) => {
          if (response == true) {
            this.showBlobs();
          }
        },
        error: (err) => {
          console.error(err);
          this.showLoader = false;
        },
        complete: () => {},
      });
    };
    fileUpload.click();
  }

  downloadFile(fileName: string) {
    this.showLoader = true;
    return this.http
      .get(this.url + '/DownloadFile/' + fileName, {
        responseType: 'blob',
      })
      .subscribe({
        next: (result: any) => {
          if (result.type != 'text/plain') {
            var blob = new Blob([result]);
            let file = fileName;
            saveAs(blob, file);
          } else {
            alert('File not found in Blob!');
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.showLoader = false;
        },
      });
  }

  deleteFile(fileName: string) {
    var del = confirm(`Are you sure want to delete this file ${fileName}`);
    if (!del) return;
    this.showLoader = true;
    this.http.get(this.url + '/DeleteFile/' + fileName).subscribe({
      next: (result: any) => {
        if (result != null) {
          this.showBlobs();
        }
      },
      error: (err) => {
        console.error(err);
        this.showLoader = false;
      },
      complete: () => {},
    });
  }
}

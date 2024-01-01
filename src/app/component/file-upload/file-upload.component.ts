import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { FileMetaData } from 'src/app/model/file-meta-data';
import { FileService } from 'src/app/shared/file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  slectedFiles !: FileList;
  currentFileUpload !: FileMetaData;
  percentage: number = 0;

  listOfFiles: FileMetaData[] =[];

  constructor(private fileService: FileService, private fireStorage: AngularFireStorage) {
  }

  ngOnInit(): void {
    this.getAllFiles();
  }

  selectFile(event: any) {
    this.slectedFiles = event.target.files;
  }

  uploadFile() {
    this.currentFileUpload =  new FileMetaData(this.slectedFiles[0]);
    const path = 'Uploads/'+this.currentFileUpload.file.name;

    const storageRef = this.fireStorage.ref(path);
    const uploadTask = storageRef.put(this.slectedFiles[0]);

    uploadTask.snapshotChanges().pipe(finalize( () => {
       storageRef.getDownloadURL().subscribe(downloadLink => {
         this.currentFileUpload.id = '';
         this.currentFileUpload.url = downloadLink;
         this.currentFileUpload.size = this.currentFileUpload.file.size;
         this.currentFileUpload.name = this.currentFileUpload.file.name;

         this.fileService.saveMetaDataOfFile(this.currentFileUpload);
       })
       this.ngOnInit();
    })
    ).subscribe( (res : any) => {
       this.percentage = (res.bytesTransferred * 100 / res.totalBytes);
    }, err => {
       console.log('Error occured');
    });

 }

  getAllFiles() {
    this.fileService.getAllFile().subscribe( res => {
        this.listOfFiles = res.map((e : any) => {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            //console.log(data);
            return data;
        });
    }, err => {
        console.log('Error occured while fetching file meta data');
    })
  }

  deleteFile(file: FileMetaData) {
    if(window.confirm('Are you sure you want to delete ' + file.name + ' ?')){
      this.fileService.deleteFile(file);
      this.ngOnInit();
    }
    
  }

}

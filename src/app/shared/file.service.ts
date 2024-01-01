import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { FileMetaData } from '../model/file-meta-data';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private fireStorage: AngularFireStorage, private fireStore: AngularFirestore) { }

  //save meta data of file to firestore
  saveMetaDataOfFile(fileObj: FileMetaData) {

    const fileMeta = {
      id: '',
      name: fileObj.name,
      url: fileObj.url,
      size: fileObj.size
    }

    fileMeta.id = this.fireStore.createId();

    this.fireStore.collection('/Upload').add(fileMeta);

  }

  //display
  getAllFile() {
    return this.fireStore.collection('/Upload').snapshotChanges();
  }

  //delete(
  deleteFile(fileMeta: FileMetaData) {
    this.fireStore.collection('/Upload').doc(fileMeta.id).delete();
    this.fireStorage.ref('/Uploads/' + fileMeta.name).delete();
  }
}

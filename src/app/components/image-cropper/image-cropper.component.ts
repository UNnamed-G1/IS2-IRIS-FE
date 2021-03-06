import { Component, OnChanges, EventEmitter, Output, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { Swal } from 'app/classes/swal';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnChanges {
  @ViewChild('openCropperModal') private openBtn: ElementRef;
  @ViewChild('closeCropperModal') private closeBtn: ElementRef;
  @Input() imageEncoded: string;
  @Output() croppedImage = new EventEmitter<string>();
  @Output() canceled = new EventEmitter();
  swalOpts: Swal;
  imgToCrop = '';
  private imageCropped: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    // Open of modal if imageEncoded changed to a new value
    if (changes.imageEncoded && changes.imageEncoded.currentValue) {
      this.openBtn.nativeElement.click();
      setTimeout(() => {
        this.imgToCrop = this.imageEncoded;
      }, 150);
    }
  }

  onCropped() {
    if (this.imageCropped) {
      // Send image cropped and close modal
      this.croppedImage.emit(this.imageCropped);
      this.closeModal();
    } else {
      // Cropped image area invalid
      this.swalOpts = { title: 'Parece que no has seleccionado un área de recorte válida.', type: 'error' };
    }
  }

  onCancel() {
    // Close modal
    this.canceled.emit();
    this.closeModal();
  }

  // On modal close clicking out of the modal-dialog (backdrop)
  backdropClicked(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.onCancel();
    }
  }

  closeModal() {
    this.closeBtn.nativeElement.click();
    this.imageCropped = undefined;
    setTimeout(() => {
      this.imgToCrop = '';
    }, 150);
  }

  // Sets on image cropped
  onImageCrop(image: string) {
    this.imageCropped = image;
  }
}

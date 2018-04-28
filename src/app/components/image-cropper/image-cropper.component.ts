import { Component, OnChanges, EventEmitter, Output, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnChanges {
  @ViewChild('cropperModal') private modal: ElementRef;
  @ViewChild('openCropperModal') private openBtn: ElementRef;
  @ViewChild('closeCropperModal') private closeBtn: ElementRef;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @Input() event: Event;
  @Input() display: boolean;
  @Output() croppedImage = new EventEmitter<File>();
  @Output() canceled = new EventEmitter();
  private uploadedImageEncoded: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    // Open of modal if display changed to true
    if (changes.display && changes.display.currentValue) {
      this.openBtn.nativeElement.click();
    }
  }

  onCropped() {
    window.dispatchEvent(new Event('resize'));
    const file: File = this.dataURLtoFile(this.uploadedImageEncoded, 'file');
    if (file) {
      // Send image cropped and close modal
      this.croppedImage.emit(file);
      this.closeModal();
    } else {
      // Cropped image area invalid
      this.errSwal.title = 'Parece que no has seleccionado un área de recorte válida.';
      this.errSwal.show();
    }
  }

  onCancel() {
    if (this.display) {
      // Close modal
      this.canceled.emit();
      this.closeModal();
    }
  }

  // On modal close clicking out of the modal-dialog (Fade)
  modalClicked(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.onCancel();
    }
  }

  closeModal() {
    this.closeBtn.nativeElement.click();
    this.uploadedImageEncoded = undefined;
  }

  // Sets on image cropped
  imageCropped(image: string) {
    this.uploadedImageEncoded = image;
  }

  // Convert b64 to file
  dataURLtoFile(dataurl: string, filename: string): File {
    if (!dataurl) {
      return undefined;
    }
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename + '.' + mime.split('/')[1], { type: mime });
  }
}

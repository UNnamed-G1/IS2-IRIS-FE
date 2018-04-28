/*
 * Image Preview Directive
 * [https://github.com/valor-software/ng2-file-upload/issues/461]
 * Implemented by BojanKogoj
 * Improved by isabelatelles
 * Modified by JulianSalomon
 */

import { Directive, ElementRef, Input, Renderer, OnChanges, SimpleChanges } from '@angular/core';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[filePreview]' })

export class FilePreviewDirective implements OnChanges {
  @Input() private media: File;
  @Input() private b64: string;
  @Input() private type: string;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.media) {
      const reader = new FileReader();
      const el = this.el;
      if (this.media.type === 'application/pdf') {
        reader.onloadend = () => el.nativeElement.data = reader.result;
      } else if (this.media.type.startsWith('image')) {
        reader.onloadend = () => el.nativeElement.src = reader.result;
      }
      reader.readAsDataURL(this.media);
    } else if (this.b64 && this.type) {
      const el = this.el;
      if (this.media.type === 'application/pdf') {
        el.nativeElement.data = this.b64;
      } else if (this.media.type.startsWith('image')) {
        el.nativeElement.src = this.b64;
      }
    }
  }
}

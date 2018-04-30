/*
 * Image Preview Directive
 * [https://github.com/valor-software/ng2-file-upload/issues/461]
 * Implemented by BojanKogoj
 * Improved by isabelatelles
 * Modified by JulianSalomon
 */

import { Directive, ElementRef, Input, Renderer, OnChanges, SimpleChanges } from '@angular/core';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[mediaPreview]' })

export class MediaPreviewDirective implements OnChanges {
  @Input() private media: File;
  @Input() private base64: string;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    let b64: string, type: string;
    if (this.base64) {
      b64 = this.base64;
      type = b64.split(',')[0].match(/:(.*?);/)[1];
      this.addSourceToElement(b64, type);
    } else if (this.media) {
      type = this.media.type;
      const reader = new FileReader();
      reader.onloadend = () => this.addSourceToElement(b64, type);
      reader.readAsDataURL(this.media);
    } else {
      return;
    }
  }

  addSourceToElement(b64: string, type: string) {
    let sourceAttribute: string;
    if (type === 'application/pdf') {
      sourceAttribute = 'data';
    } else if (type.startsWith('image')) {
      sourceAttribute = 'src';
    }
    this.el.nativeElement[sourceAttribute] = this.base64;
  }
}

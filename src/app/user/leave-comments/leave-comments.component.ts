import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select } from '@angular-redux/store';

import { PermissionManager } from 'app/permission-manager';
import { CommentService } from 'app/services/comment.service';
import { Comment } from 'app/classes/comment';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-leave-comments',
  templateUrl: './leave-comments.component.html',
  styleUrls: ['./leave-comments.component.css']
})
export class LeaveCommentsComponent implements OnInit {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @select(['session', 'username']) username;
  commentForm: FormGroup;

  constructor(private commentService: CommentService,
    private permMan: PermissionManager,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.permMan.validateLogged();
    this.createCommentForm();
  }

  sendComments() {
    const comments = { comment: this.commentForm.value };
    this.username.subscribe((username: string) => {
      comments.comment.email = username + '@unal.edu.co';
      this.commentService.create(comments).subscribe(
        (response: any) => {
          this.sucSwal.title = 'Se han enviado tus comentarios, ¡Gracias!';
          this.sucSwal.show();
          this.commentForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'No se han podido enviar tus comentarios';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        });
    });
  }

  private createCommentForm() {
    this.commentForm = this.formBuilder.group({
      subject: ['', Validators.required],
      comments: ['', Validators.required]
    });
  }

  get subject() { return this.commentForm.get('subject'); }
  get comments() { return this.commentForm.get('comments'); }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { select } from '@angular-redux/store';

import { PermissionManager } from 'app/permission-manager';
import { Swal } from 'app/classes/swal';
import { CommentService } from 'app/services/comment.service';

@Component({
  selector: 'app-leave-comments',
  templateUrl: './leave-comments.component.html',
  styleUrls: ['./leave-comments.component.css']
})
export class LeaveCommentsComponent implements OnInit {
  @select(['session', 'username']) username;
  swalOpts: Swal;
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
          this.swalOpts = { title: 'Se han enviado tus comentarios, ¡Gracias!', type: 'success' };
          this.commentForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'No se han podido enviar tus comentarios', text: error.message, type: 'error' };
        }
      );
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

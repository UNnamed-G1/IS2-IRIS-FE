import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select } from '@angular-redux/store';

import { PermissionManager } from 'app/permission-manager';
import { CommentService } from 'app/services/comment.service';
import { Comment } from 'app/classes/comment';

@Component({
  selector: 'app-leave-comments',
  templateUrl: './leave-comments.component.html',
  styleUrls: ['./leave-comments.component.css']
})
export class LeaveCommentsComponent implements OnInit {
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
    let comments = { comment: this.commentForm.value };
    this.username.subscribe((username: string) => {
      comments.comment.email = username + "@unal.edu.co";
      this.commentService.create(comments).subscribe(
        response => console.log(response),
        error => console.log(error)
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

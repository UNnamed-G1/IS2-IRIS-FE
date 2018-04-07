import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';

import { ISession } from 'app/redux/session';
import { PermissionManager } from 'app/permission-manager';
import { CommentService } from 'app/services/comment.service';
import { Comment } from 'app/classes/comment';

@Component({
  selector: 'app-leave-comments',
  templateUrl: './leave-comments.component.html',
  styleUrls: ['./leave-comments.component.css']
})
export class LeaveCommentsComponent implements OnInit {
  @select() session;
  comment: Comment = new Comment();

  constructor(private commentService: CommentService,
    private permMan: PermissionManager) { }

  ngOnInit() {
    this.permMan.validateLogged();
  }

  ngAfterContentInit() {
    this.session.subscribe((session: ISession) => {
      this.comment.email = session.username + "@unal.edu.co";
    });
  }

  sendComments() {
    this.commentService.create({ comment: this.comment }).subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }

}

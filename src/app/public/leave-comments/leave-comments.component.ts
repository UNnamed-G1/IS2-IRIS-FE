import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';

import { CommentService } from 'app/services/comment.service';
import { Comment } from 'app/classes/comment';

@Component({
  selector: 'app-leave-comments',
  templateUrl: './leave-comments.component.html',
  styleUrls: ['./leave-comments.component.css']
})
export class LeaveCommentsComponent implements OnInit {
  @select() isLogged: boolean;
  comment: Comment = new Comment();

  constructor(private commentService: CommentService) { }

  ngOnInit() {
  }

  sendComments() {
    this.commentService.create({ comment: this.comment }).subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }

}

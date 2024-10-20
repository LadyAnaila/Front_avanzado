import { Component, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts: PostDTO[] = [];
  totalLikes: number = 0;
  totalDislikes: number = 0;
  showButtons: boolean = false;

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) {
    this.loadPosts();
  }

  ngOnInit(): void {}

  private async loadPosts(): Promise<void> {
    try {
      this.posts = await this.postService.getPosts();
      console.log(JSON.stringify(this.posts, null, 2));
      this.calculateTotals();
    } catch (error: any) {
      this.sharedService.errorLog(error);
    }
  }

  private calculateTotals(): void {
    this.totalLikes = 0;
    this.totalDislikes = 0;

    for (const post of this.posts) {
      this.totalLikes += post.num_likes;
      this.totalDislikes += post.num_dislikes;
    }
  }

  async like(postId: string): Promise<void> {
    try {
      await this.postService.likePost(postId);
      const updatedPost = await this.postService.getPostById(postId);
      const index = this.posts.findIndex(post => post.postId === postId);
      if (index !== -1) {
        this.posts[index] = updatedPost;
        this.calculateTotals();
      }
    } catch (error: any) {
      this.sharedService.errorLog(error);
    }
  }

  async dislike(postId: string): Promise<void> {
    try {
      await this.postService.dislikePost(postId);
      const updatedPost = await this.postService.getPostById(postId);
      const index = this.posts.findIndex(post => post.postId === postId);
      if (index !== -1) {
        this.posts[index] = updatedPost;
        this.calculateTotals();
      }
    } catch (error: any) {
      this.sharedService.errorLog(error);
    }
  }
}

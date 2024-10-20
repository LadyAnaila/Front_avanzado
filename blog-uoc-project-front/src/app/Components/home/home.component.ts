import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  posts: PostDTO[] = [];
  showButtons: boolean = false;

  constructor(
    private postService: PostService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.loadPosts();
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }

  private async loadPosts(): Promise<void> {
    try {
      this.posts = await this.postService.getPosts();
      console.log(JSON.stringify(this.posts, null, 2));  // Ver los detalles de cada post    } catch (error: any) {
      
    } catch (error: any) {
      this.sharedService.errorLog(error);
    }
  }

  async like(postId: string): Promise<void> {
    try {
      await this.postService.likePost(postId);
      const updatedPost = await this.postService.getPostById(postId); 
      const index = this.posts.findIndex(post => post.postId === postId);
      if (index !== -1) {
        this.posts[index] = updatedPost; 
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
      }
    } catch (error: any) {
      this.sharedService.errorLog(error);
    }
  }
}

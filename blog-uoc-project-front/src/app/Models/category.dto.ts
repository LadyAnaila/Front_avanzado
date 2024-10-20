export class CategoryDTO {
  categoryId!: string;
  title: string;
  description: string;
  css_color: string;
  userId!: string;

  constructor(categoryId: string, title: string, description: string, css_color: string) {
    this.categoryId = categoryId;
    this.title = title;
    this.description = description;
    this.css_color = css_color;
  }}
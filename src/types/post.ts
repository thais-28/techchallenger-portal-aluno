export type Post = {
  id?: number;
  title: string;
  content: string;
  author?: string;
  subject?: string;
};

export interface IPostInput {
  title: string;
  content: string;
  author: string;
  subject: string;
}

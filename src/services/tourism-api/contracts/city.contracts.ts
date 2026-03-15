export interface ICityApiResponse {
  id: string;
  name: string;
  slug: string;
  state: string;
  summary: string;
  description?: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
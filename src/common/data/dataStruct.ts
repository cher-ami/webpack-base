import { IImage } from "@wbe/libraries";

// ----------------------------------------------------------------------------------- PAGES

// Global Page Data struct
// ex: const data:IPageData<IHomePage> = ...
export interface IPageData<PageContent = any> {
  title: string;
  content: PageContent;
  metas?: IPageMetadata;
}

// Sepcific pages data struct
// Home
export interface IHomePage {}

// ----------------------------------------------------------------------------- DATA

// TODO: keep ?
// Grav basic page data, available on all data models
export interface GravPageData {
  id: string;
  slug: string;
  route: string;
  url: string;
}

// ----------------------------------------------------------------------------- COMPONENT

// Page Metadatas
export interface IPageMetadata {
  title?: string;
  description?: string;
  image?: string;
}

// TODO: keep ?
// Image element
export interface IImageElement {
  images: IImage[];
  alt?: string;
}

export interface WordpressPost {
  posts:   Post[];
  _paging: Paging;
}

export interface Paging {
  total:      string;
  totalPages: string;
  links:      Links;
  next:       Next;
}

export interface Links {
  next: string;
}

export interface Next {
  _options:          Options;
  transport:         Params;
  _params:           Params;
  _supportedMethods: string[];
  _path:             Params;
}

export interface Options {
  endpoint: string;
}

export interface Params {
}

export interface Post {
  id:                    number;
  modified:              string;
  link:                  string;
  better_featured_image: BetterFeaturedImage | null;
  title?:                Excerpt;
  excerpt:               Excerpt;
}

export interface BetterFeaturedImage {
  id:            number;
  alt_text:      string;
  caption:       string;
  description:   string;
  media_type:    string;
  media_details: MediaDetails;
  post:          number;
  source_url:    string;
}

export interface MediaDetails {
  width:      number;
  height:     number;
  file:       string;
  sizes:      { [key: string]: Size };
  image_meta: ImageMeta;
}

export interface ImageMeta {
  aperture:          string;
  credit:            string;
  camera:            string;
  caption:           string;
  created_timestamp: string;
  copyright:         string;
  focal_length:      string;
  iso:               string;
  shutter_speed:     string;
  title:             string;
  orientation:       string;
  keywords:          any[];
}

export interface Size {
  file:        string;
  width:       number;
  height:      number;
  "mime-type": MIMEType;
  source_url:  string;
}

export enum MIMEType {
  ImageJPEG = "image/jpeg",
}

export interface Excerpt {
  rendered: string;
}


export interface WordpressCategory {
  id:          number;
  count:       number;
  description: string;
  link:        string;
  name:        string;
  slug:        string;
  taxonomy:    Taxonomy;
  parent:      number;
  meta:        any[];
  _links:      Links;
}

export interface Links {
  self:           About[];
  collection:     About[];
  about:          About[];
  "wp:post_type": About[];
  curies:         Cury[];
}

export interface About {
  href: string;
}

export interface Cury {
  name:      Name;
  href:      Href;
  templated: boolean;
}

export enum Href {
  HTTPSAPIWOrgRel = "https://api.w.org/{rel}",
}

export enum Name {
  Wp = "wp",
}

export enum Taxonomy {
  Category = "category",
}

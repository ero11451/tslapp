export interface BaseModel<T>{
  status: boolean;
  data: T;
  message: string;
}

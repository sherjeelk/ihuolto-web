import {Image} from "./Image";

export interface Service {
  name_fi: any;
  type: number;
  id: number;
  name: string;
  desc?: any;
  enable: boolean;
  created_at: Date;
  updated_at: Date;
  image: Image;
}


export type ArchObject = {
  id: number;
  address: string;
  name: string;
  identifier: string;
  district_id: number;
  xcoordinate: number;
  ycoordinate: number;
  description: string;
  name_kg: string;
  tags: number[];
  district_name?: string;
};


export interface ArchObjectValues extends ArchObject {
  geometry: any[];
  addressInfo: AddresInfo[];
  point: any[];
  DarekSearchList: [];
  errordistrict_id: string;
  errordescription: string;
  erroraddress: string;
  count?: number;
  legalRecords?:[]
  legalActs?:[]
}
export type AddresInfo = {
  address: string;
  propcode?: string;
}
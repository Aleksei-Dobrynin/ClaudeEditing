export type ArchObject = {
  id: number;
  address: string;
  name: string;
  identifier: string;
  district_id: number;
  tunduk_district_id?: number;
  tunduk_address_unit_id?: number;
  tunduk_street_id?: number;
  tunduk_street_input_value?: string;
  tunduk_building_id?: number;
  tunduk_uch_num?: string;
  tunduk_flat_num?: string;
  tunduk_building_num?: string;
  open?: boolean;
  xcoordinate: number;
  ycoordinate: number;
  description: string;
  name_kg: string;
  tags: number[];
  district_name?: string;
  is_manual?: boolean;
};


export interface ArchObjectValues extends ArchObject {
  geometry: any[];
  addressInfo: AddresInfo[];
  point: any[];
  DarekSearchList: [];
  errordistrict_id: string;
  errortunduk_district_id?: string;
  errortunduk_address_unit_id?: string;
  errortunduk_street_id?: string;
  errortunduk_building_id?: string;
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
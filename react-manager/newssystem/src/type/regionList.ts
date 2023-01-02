export type Region = {
  id: number;
  title: string;
  value: string;
};
export type MapRegion = Region & {
  label: string;
  disabled?: boolean;
};
export type RegionFilter = Region & {
  text: string;
};

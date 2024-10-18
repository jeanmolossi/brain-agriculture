export const farmingsEnum = [
  "Milho",
  "Mandioca",
  "Tomate",
  "Cafe",
  "Melancia",
  "Soja",
  "Alface",
] as const;

export type FarmingType = (typeof farmingsEnum)[number];

export interface Farming {
  type: FarmingType;
  area: number;
}

export interface Farmer {
  name: string;
  farm_name: string;
  document: string;
  city: string;
  state: string;
  farm_total_area: number;
  farm_usable_area: number;
  farmings: Farming[];
}

export interface _Farmer {
  name: string;
  document: string;
}

export interface Farm {
  name: string;
  city: string;
  state: string;
  total_area: number;
  usable_area: number;
}

export type Relation<K extends string, TRelationData> = {
  [P in K]: ApiJson<TRelationData>;
};

export type ApiJson<TData, TRelations = undefined> = {
  data: {
    type: string;
    id?: string | number;
    attributes: TData;
    relationships?: TRelations;
  };
};

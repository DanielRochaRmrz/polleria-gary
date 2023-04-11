export interface BoxOrProduct {
  status:     boolean;
  message:    string;
  type:       string;
  data:       Data;
  kilos_caja?: number;
  provider?: string;
  id_provider: number;
}

export interface Data {
  id?:               number;
  id_provider?:      number;
  nombre?:           string;
  codigo_proveedor?: string;
  barcode?:          string;
  costo_kilo?:       number;
  stock_kilos?:      number;
  stock_cajas?:      number;
  stock_tapas?:      number;
  proveedor_id?:     number;
  created_at?:       string;
  updated_at?:       string;
}

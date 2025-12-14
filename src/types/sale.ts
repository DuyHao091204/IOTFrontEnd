export interface BillProduct {
  id: number;
  name: string;
  price: number;
}

export interface BillItem {
  id: number;
  qty: number;
  lineTotal: number;

  product: {
    id: number;
    name: string;
    sellPrice: number; // 👈 Thêm đúng giá bán
  };
}

export interface Bill {
  id: number;
  totalQty: number;
  totalPrice: number;
  items: BillItem[];
}

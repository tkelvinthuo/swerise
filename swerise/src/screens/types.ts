export interface Sale {
  sale_id: number; // Matches sale_id from the database
  shop_id: number; // Matches shop_id from the database
  product_id: number; // Matches product_id from the database
  quantity: number; // Matches quantity from the database
  total_price: number; // Matches total_price from the database
  sale_date: string; // Matches sale_date from the database
  employee_id: number | null; // Matches employee_id from the database (can be null)
  sale_type: 'cash' | 'debt'; // Matches sale_type from the database
  sync_status: number; // Matches sync_status from the database
  customer: string | null; // Matches customer from the database (can be null)
}
  
export interface Debt {
  sale_id: number; // Will be assigned after inserting the sale
  customer_name: string;
  customer_phone: string | null;
  amount_due: number;
  amount_paid: number; // Amount paid for the debt, default is 0
}
 

export interface DebtInfo {
  customer_name: string;
  customer_phone: string | null;
  amount_due: number;
}
export interface Sale {
    id: string; // Unique ID for the sale
    shop_id: number; // Shop ID
    product_id: number; // Product ID
    quantity: number; // Quantity of the product sold
    total_price: number; // Total price for the sale
    sale_date: string; // Date of the sale
    employee_id: string; // Employee ID responsible for the sale
    sale_type: string; // "cash" or "debt" (payment method)
  }
  
  export interface Debt {
    sale_id: number; // ID of the sale that generated the debt
    customer_name: string; // Name of the customer
    customer_phone?: string | null; // Phone number of the customer (optional)
    amount_due: number; // Amount the customer owes
    amount_paid: number; // Amount already paid
  }  
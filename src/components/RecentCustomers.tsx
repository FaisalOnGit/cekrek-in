import React from 'react';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

const RecentCustomers = () => {
  const customers = [
    {
      salesNo: '#876364',
      productName: 'Trisana',
      price: 'Rp 35,000',
      totalOrder: 325,
      totalAmount: 'Rp 100,000'
    },
    {
      salesNo: '#876368',
      productName: 'Zayn',
      price: 'Rp 35,000',
      totalOrder: 53,
      totalAmount: 'Rp 100,000'
    },
    {
      salesNo: '#876412',
      productName: 'Gillian Anderson',
      price: 'Rp 35,000',
      totalOrder: 78,
      totalAmount: 'Rp 100,000'
    },
    {
      salesNo: '#876621',
      productName: 'Henry Cavill',
      price: 'Rp 35,000',
      totalOrder: 98,
      totalAmount: 'Rp 100,000'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Customer</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 text-sm font-medium text-gray-600">Sales No</th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>Product Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>Total Order</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left py-3 text-sm font-medium text-gray-600">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 text-sm text-gray-800">{customer.salesNo}</td>
                <td className="py-4 text-sm text-gray-800">{customer.productName}</td>
                <td className="py-4 text-sm text-gray-800">{customer.price}</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {customer.totalOrder}
                  </span>
                </td>
                <td className="py-4 text-sm text-gray-800">{customer.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCustomers;
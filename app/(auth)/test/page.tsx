'use client';

import React from 'react';
import { 
  PenSquare, 
  Ban, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Map, 
  MapPinned, 
  StickyNote, 
  Star, 
  Clock3 as ClockIcon,
  Loader,
  CrosshairIcon
} from 'lucide-react';

const OrderDetailPage = () => {
  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div id="order-header" className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-gray-600">Order ID: #ORD-2025-0123</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <PenSquare className="inline mr-2 h-4 w-4" />Update Status
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              <Ban className="inline mr-2 h-4 w-4" />Cancel Order
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div id="order-status" className="col-span-3 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">Pending</span>
                <p className="text-sm text-gray-500 mt-2">Last Updated: Jan 15, 2025 10:30 AM</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">$245.00</p>
                </div>
              </div>
            </div>
          </div>
          <div id="customer-info" className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" className="w-12 h-12 rounded-full" alt="Customer Avatar"/>
                <div className="ml-3">
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">ID: USR-2025-456</p>
                </div>
              </div>
              <div className="pt-3">
                <p className="text-sm text-gray-600">
                  <Mail className="inline mr-2 h-4 w-4" />john.doe@example.com
                </p>
              </div>
            </div>
          </div>
          <div id="shop-info" className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Shop Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <img className="w-12 h-12 rounded-lg object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d614fe1d34-9609aca726966739e938.png" alt="modern restaurant storefront with elegant signage, minimalist style" />
                <div className="ml-3">
                  <p className="font-medium">The Gourmet Kitchen</p>
                  <div className="flex items-center">
                    <Star className="inline h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1">4.8</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <MapPin className="inline mr-2 h-4 w-4" />123 Culinary Street, Food District
              </p>
              <p className="text-sm text-gray-600">
                <Phone className="inline mr-2 h-4 w-4" />+1 234 567 8900
              </p>
              <p className="text-sm text-gray-600">
                <Clock className="inline mr-2 h-4 w-4" />9:00 AM - 10:00 PM
              </p>
            </div>
          </div>
          <div id="shipping-info" className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <Map className="inline mr-2 h-4 w-4" />Province: California
              </p>
              <p className="text-sm text-gray-600">
                <CrosshairIcon className="inline mr-2 h-4 w-4" />Lat: 34.0522° N, Long: 118.2437° W
              </p>
              <p className="text-sm text-gray-600">
                <MapPinned className="inline mr-2 h-4 w-4" />Shipping Address: 456 Beverly Hills, Los Angeles
              </p>
              <p className="text-sm text-gray-600">
                <StickyNote className="inline mr-2 h-4 w-4" />Note: Please deliver to the back entrance
              </p>
            </div>
          </div>
          <div id="order-items" className="col-span-3 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img className="w-12 h-12 rounded-lg object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/e8e50f9f92-65cf36b847dc63302736.png" alt="gourmet burger with fries on wooden plate, food photography" />
                        <div className="ml-3">
                          <p className="font-medium">Gourmet Burger</p>
                          <p className="text-sm text-gray-500">#PRD-001</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">2</td>
                    <td className="px-6 py-4">$45.00</td>
                    <td className="px-6 py-4">$90.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img className="w-12 h-12 rounded-lg object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/ce2b49be0a-3d3316e0dfd0e15deeb7.png" alt="caesar salad with grilled chicken, food photography" />
                        <div className="ml-3">
                          <p className="font-medium">Caesar Salad</p>
                          <p className="text-sm text-gray-500">#PRD-002</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">1</td>
                    <td className="px-6 py-4">$25.00</td>
                    <td className="px-6 py-4">$25.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div id="order-timeline" className="col-span-3 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Timeline</h2>
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <ClockIcon className="text-white h-4 w-4" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">Order Received</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time>Jan 15, 2025 10:30 AM</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                          <Loader className="text-white h-4 w-4" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">Pending Confirmation</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time>Jan 15, 2025 10:31 AM</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
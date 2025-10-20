import React from 'react';
import { Mail, Hash, Calendar, Shield, CreditCard, AlertTriangle,User } from 'lucide-react';

const InfoItem = ({ Icon, label, value, isRole = false }) => (
  <div className="flex items-start mb-4">
    <Icon className="w-5 h-5 text-gray-500 mr-3 mt-1" />
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      {isRole ? (
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 mt-0.5">
          {value.toUpperCase()}
        </span>
      ) : (
        <span className="text-gray-800 font-medium">{value}</span>
      )}
    </div>
  </div>
);

const UserProfileCard = ({ user, summary }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg h-full">
    <h3 className="text-lg font-semibold text-gray-700 mb-6 border-b pb-3">Personal Information</h3>
    <InfoItem Icon={User} label="Name" value={user.name} />
    <InfoItem Icon={Mail} label="Email" value={user.email} />
    <InfoItem Icon={Hash} label="Member ID" value={user.memberId} />
    <InfoItem Icon={Calendar} label="Member Since" value={user.memberSince} />
    <InfoItem Icon={Shield} label="Role" value={user.role} isRole={true} />

    <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4 border-b pb-3">Account Summary</h3>
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-700">
        <span>Active Borrows:</span>
        <span className="font-semibold">{summary.activeBorrows}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-700">
        <span>Overdue Books:</span>
        <span className={`font-semibold ${summary.overdueBooks > 0 ? 'text-red-500' : 'text-gray-700'}`}>
          {summary.overdueBooks}
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-700 items-center">
        <span>Total Fines:</span>
        <span className={`font-bold text-lg ${summary.totalFines > 0 ? 'text-red-600' : 'text-gray-800'}`}>
          ${summary.totalFines.toFixed(2)}
        </span>
      </div>
    </div>
    
    {summary.totalFines > 0 && (
      <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2" />
        You have outstanding fines of ${summary.totalFines.toFixed(2)}. Please clear them at the library desk.
      </div>
    )}
  </div>
);

export default UserProfileCard;
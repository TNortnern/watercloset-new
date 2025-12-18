<script setup lang="ts">
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CreditCard,
  Download,
  Settings,
  ArrowUpRight,
  Calendar,
  AlertCircle
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
})

const stats = {
  totalEarnings: 12450,
  availableBalance: 3240,
  pending: 890,
  feesPaid: 1245
}

const transactions = [
  {
    id: 'TXN-1001',
    date: '2025-12-17',
    description: 'Booking #BK-1005',
    property: 'Garden View Powder Room',
    amount: 30.00,
    fee: 3.00,
    net: 27.00,
    status: 'completed'
  },
  {
    id: 'TXN-1002',
    date: '2025-12-17',
    description: 'Booking #BK-1004',
    property: 'Executive Suite Bath',
    amount: 52.50,
    fee: 5.25,
    net: 47.25,
    status: 'completed'
  },
  {
    id: 'TXN-1003',
    date: '2025-12-16',
    description: 'Payout to Bank Account',
    property: null,
    amount: -500.00,
    fee: 0,
    net: -500.00,
    status: 'processed'
  },
  {
    id: 'TXN-1004',
    date: '2025-12-16',
    description: 'Booking #BK-1003',
    property: 'Modern Minimalist Washroom',
    amount: 90.00,
    fee: 9.00,
    net: 81.00,
    status: 'completed'
  },
  {
    id: 'TXN-1005',
    date: '2025-12-15',
    description: 'Booking #BK-1002',
    property: 'Spa Retreat Bathroom',
    amount: 45.00,
    fee: 4.50,
    net: 40.50,
    status: 'completed'
  },
  {
    id: 'TXN-1006',
    date: '2025-12-15',
    description: 'Booking #BK-1001',
    property: 'Downtown Luxury Suite',
    amount: 67.50,
    fee: 6.75,
    net: 60.75,
    status: 'completed'
  },
  {
    id: 'TXN-1007',
    date: '2025-12-14',
    description: 'Booking #BK-0998',
    property: 'Penthouse Premium Bath',
    amount: 100.00,
    fee: 10.00,
    net: 90.00,
    status: 'pending'
  },
  {
    id: 'TXN-1008',
    date: '2025-12-13',
    description: 'Booking #BK-0997',
    property: 'Downtown Luxury Suite',
    amount: 75.00,
    fee: 7.50,
    net: 67.50,
    status: 'completed'
  }
]

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    processed: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Earnings</h1>
        <p class="mt-2 text-gray-600">Track your revenue and payouts</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="console.log('Export earnings data')"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Download class="w-5 h-5" />
          Export
        </button>
        <button
          @click="console.log('Request payout')"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          <ArrowUpRight class="w-5 h-5" />
          Request Payout
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-white/20 rounded-xl">
            <DollarSign class="w-6 h-6" />
          </div>
          <TrendingUp class="w-5 h-5 opacity-80" />
        </div>
        <div class="text-3xl font-bold mb-1">${{ stats.totalEarnings.toLocaleString() }}</div>
        <div class="text-green-100 text-sm">Total Earnings</div>
        <div class="mt-3 text-xs text-green-100 flex items-center gap-1">
          <TrendingUp class="w-3 h-3" />
          +12.5% from last month
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-100 rounded-xl">
            <CreditCard class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">${{ stats.availableBalance.toLocaleString() }}</div>
        <div class="text-gray-600 text-sm">Available Balance</div>
        <div class="mt-3">
          <button class="text-xs font-medium text-blue-600 hover:text-blue-700">
            Withdraw funds
          </button>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-yellow-100 rounded-xl">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">${{ stats.pending.toLocaleString() }}</div>
        <div class="text-gray-600 text-sm">Pending</div>
        <div class="mt-3 text-xs text-gray-500">
          Processing in 2-3 days
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-purple-100 rounded-xl">
            <TrendingDown class="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">${{ stats.feesPaid.toLocaleString() }}</div>
        <div class="text-gray-600 text-sm">Fees Paid</div>
        <div class="mt-3 text-xs text-gray-500">
          10% platform fee
        </div>
      </div>
    </div>

    <!-- Earnings Chart Placeholder -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Earnings Overview</h2>
          <p class="text-sm text-gray-600 mt-1">Your earnings over the last 12 months</p>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            7D
          </button>
          <button class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            30D
          </button>
          <button class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg">
            12M
          </button>
        </div>
      </div>
      <div class="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div class="text-center">
          <TrendingUp class="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p class="text-gray-600 font-medium">Earnings Chart</p>
          <p class="text-sm text-gray-500 mt-1">Chart visualization would go here</p>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Transaction History</h2>
            <p class="text-sm text-gray-600 mt-1">All your earnings and payouts</p>
          </div>
          <button class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <Calendar class="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="txn in transactions" :key="txn.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ txn.date }}</div>
                <div class="text-xs text-gray-500">{{ txn.id }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ txn.description }}</div>
                <div v-if="txn.property" class="text-xs text-gray-500 mt-1">{{ txn.property }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div :class="[
                  'text-sm font-semibold',
                  txn.amount > 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ txn.amount > 0 ? '+' : '' }}${{ Math.abs(txn.amount).toFixed(2) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ txn.fee > 0 ? `$${txn.fee.toFixed(2)}` : '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div :class="[
                  'text-sm font-bold',
                  txn.net > 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ txn.net > 0 ? '+' : '' }}${{ Math.abs(txn.net).toFixed(2) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`">
                  {{ txn.status.charAt(0).toUpperCase() + txn.status.slice(1) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payout Settings -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Payout Settings</h2>
          <p class="text-sm text-gray-600 mt-1">Manage your payout methods and schedule</p>
        </div>
        <button class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
          <Settings class="w-4 h-4" />
          Edit
        </button>
      </div>

      <div class="space-y-4">
        <div class="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <h3 class="font-medium text-blue-900">Automatic Payouts Enabled</h3>
            <p class="text-sm text-blue-700 mt-1">
              Funds are automatically transferred to your bank account every week
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center gap-3 mb-3">
              <div class="p-2 bg-gray-100 rounded-lg">
                <CreditCard class="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">Bank Account</div>
                <div class="text-xs text-gray-500">Primary payout method</div>
              </div>
            </div>
            <div class="text-sm text-gray-700">
              <div class="font-mono">**** **** **** 4242</div>
              <div class="text-xs text-gray-500 mt-1">Chase Bank</div>
            </div>
          </div>

          <div class="p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center gap-3 mb-3">
              <div class="p-2 bg-gray-100 rounded-lg">
                <Calendar class="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">Payout Schedule</div>
                <div class="text-xs text-gray-500">Automatic transfer</div>
              </div>
            </div>
            <div class="text-sm text-gray-700">
              <div>Weekly on Fridays</div>
              <div class="text-xs text-gray-500 mt-1">Next payout: Dec 20, 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

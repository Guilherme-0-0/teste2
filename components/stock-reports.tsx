"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import type { StockItem } from "./stock-dashboard"

interface StockReportsProps {
  stockItems: StockItem[]
}

export function StockReports({ stockItems }: StockReportsProps) {
  // Category distribution data
  const categoryData = stockItems.reduce(
    (acc, item) => {
      const existing = acc.find((cat) => cat.category === item.category)
      if (existing) {
        existing.count += 1
        existing.value += item.quantity * item.unitPrice
      } else {
        acc.push({
          category: item.category,
          count: 1,
          value: item.quantity * item.unitPrice,
        })
      }
      return acc
    },
    [] as Array<{ category: string; count: number; value: number }>,
  )

  // Stock level distribution
  const stockLevelData = stockItems.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    minStock: item.minStock,
    maxStock: item.maxStock,
  }))

  // Top value items
  const topValueItems = stockItems
    .map((item) => ({
      ...item,
      totalValue: item.quantity * item.unitPrice,
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const totalInventoryValue = stockItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const averageStockLevel = stockItems.reduce((sum, item) => sum + item.quantity, 0) / stockItems.length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${totalInventoryValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Stock Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{averageStockLevel.toFixed(0)} units</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{categoryData.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Distribution of items across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Items",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, count }) => `${category}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Stock Levels Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>Current vs minimum/maximum stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                quantity: {
                  label: "Current Stock",
                  color: "hsl(var(--chart-1))",
                },
                minStock: {
                  label: "Minimum Stock",
                  color: "hsl(var(--chart-2))",
                },
                maxStock: {
                  label: "Maximum Stock",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockLevelData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quantity" fill="var(--color-quantity)" />
                  <Bar dataKey="minStock" fill="var(--color-minStock)" />
                  <Bar dataKey="maxStock" fill="var(--color-maxStock)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Value Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top Value Items</CardTitle>
          <CardDescription>Items with highest total inventory value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topValueItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} units × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${item.totalValue.toFixed(2)}</p>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Value Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Value Breakdown</CardTitle>
          <CardDescription>Total inventory value by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryData
              .sort((a, b) => b.value - a.value)
              .map((category, index) => (
                <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${category.value.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{category.count} items</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

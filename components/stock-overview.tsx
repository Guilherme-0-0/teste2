"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import type { StockItem } from "./stock-dashboard"

interface StockOverviewProps {
  stockItems: StockItem[]
}

export function StockOverview({ stockItems }: StockOverviewProps) {
  const lowStockItems = stockItems.filter((item) => item.quantity <= item.minStock)
  const overStockItems = stockItems.filter((item) => item.quantity >= item.maxStock)
  const categoryStats = stockItems.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Items that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold">{item.quantity} units</p>
                    <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>Current inventory status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockItems.map((item) => {
              const stockPercentage = (item.quantity / item.maxStock) * 100
              const isLow = item.quantity <= item.minStock
              const isHigh = item.quantity >= item.maxStock

              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {item.quantity}/{item.maxStock}
                      </span>
                      {isLow && <TrendingDown className="h-4 w-4 text-red-500" />}
                      {isHigh && <TrendingUp className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                  <Progress
                    value={stockPercentage}
                    className={`h-2 ${isLow ? "bg-red-100" : isHigh ? "bg-green-100" : ""}`}
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Items by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category}</span>
                  <Badge variant="secondary">{count} items</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Latest stock movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stockItems
              .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
              .slice(0, 5)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Updated: {item.lastUpdated.toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline">{item.quantity} units</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

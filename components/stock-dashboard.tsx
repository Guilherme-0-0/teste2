"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockOverview } from "./stock-overview"
import { StockList } from "./stock-list"
import { AddStockForm } from "./add-stock-form"
import { StockReports } from "./stock-reports"
import { Package, TrendingUp, AlertTriangle, Plus } from "lucide-react"

export interface StockItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  minStock: number
  maxStock: number
  unitPrice: number
  supplier: string
  lastUpdated: Date
}

const initialStock: StockItem[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    quantity: 45,
    minStock: 10,
    maxStock: 100,
    unitPrice: 99.99,
    supplier: "TechCorp",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Office Chair",
    sku: "OC-002",
    category: "Furniture",
    quantity: 8,
    minStock: 15,
    maxStock: 50,
    unitPrice: 249.99,
    supplier: "FurniSupply",
    lastUpdated: new Date("2024-01-14"),
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LS-003",
    category: "Accessories",
    quantity: 23,
    minStock: 20,
    maxStock: 80,
    unitPrice: 39.99,
    supplier: "AccessoryHub",
    lastUpdated: new Date("2024-01-16"),
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    sku: "BS-004",
    category: "Electronics",
    quantity: 5,
    minStock: 12,
    maxStock: 60,
    unitPrice: 79.99,
    supplier: "AudioTech",
    lastUpdated: new Date("2024-01-13"),
  },
]

export function StockDashboard() {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStock)

  const addStockItem = (item: Omit<StockItem, "id" | "lastUpdated">) => {
    const newItem: StockItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    }
    setStockItems((prev) => [...prev, newItem])
  }

  const updateStockItem = (id: string, updates: Partial<StockItem>) => {
    setStockItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, lastUpdated: new Date() } : item)),
    )
  }

  const deleteStockItem = (id: string) => {
    setStockItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalItems = stockItems.length
  const totalValue = stockItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const lowStockItems = stockItems.filter((item) => item.quantity <= item.minStock)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stock Management System</h1>
        <p className="text-gray-600 mt-2">Manage your inventory efficiently</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Active stock items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items below minimum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(stockItems.map((item) => item.category)).size}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="add-stock">Add Stock</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StockOverview stockItems={stockItems} />
        </TabsContent>

        <TabsContent value="inventory">
          <StockList stockItems={stockItems} onUpdateStock={updateStockItem} onDeleteStock={deleteStockItem} />
        </TabsContent>

        <TabsContent value="add-stock">
          <AddStockForm onAddStock={addStockItem} />
        </TabsContent>

        <TabsContent value="reports">
          <StockReports stockItems={stockItems} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StockItem } from "./stock-dashboard"

interface AddStockFormProps {
  onAddStock: (item: Omit<StockItem, "id" | "lastUpdated">) => void
}

export function AddStockForm({ onAddStock }: AddStockFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    supplier: "",
  })

  const categories = ["Electronics", "Furniture", "Accessories", "Office Supplies", "Tools", "Other"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.sku && formData.category) {
      onAddStock(formData)
      setFormData({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        minStock: 0,
        maxStock: 0,
        unitPrice: 0,
        supplier: "",
      })
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Stock Item</CardTitle>
        <CardDescription>Enter the details for a new inventory item</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantity">Initial Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="minStock">Minimum Stock</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => handleInputChange("minStock", Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="maxStock">Maximum Stock</Label>
              <Input
                id="maxStock"
                type="number"
                value={formData.maxStock}
                onChange={(e) => handleInputChange("maxStock", Number(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="unitPrice">Unit Price ($)</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => handleInputChange("unitPrice", Number(e.target.value))}
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  name: "",
                  sku: "",
                  category: "",
                  quantity: 0,
                  minStock: 0,
                  maxStock: 0,
                  unitPrice: 0,
                  supplier: "",
                })
              }
            >
              Clear Form
            </Button>
            <Button type="submit">Add Stock Item</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

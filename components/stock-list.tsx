"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Edit, Trash2, Plus, Minus } from "lucide-react"
import type { StockItem } from "./stock-dashboard"

interface StockListProps {
  stockItems: StockItem[]
  onUpdateStock: (id: string, updates: Partial<StockItem>) => void
  onDeleteStock: (id: string) => void
}

export function StockList({ stockItems, onUpdateStock, onDeleteStock }: StockListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [adjustmentItem, setAdjustmentItem] = useState<StockItem | null>(null)
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0)

  const categories = ["all", ...new Set(stockItems.map((item) => item.category))]

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleEdit = (item: StockItem) => {
    setEditingItem({ ...item })
  }

  const handleSaveEdit = () => {
    if (editingItem) {
      onUpdateStock(editingItem.id, editingItem)
      setEditingItem(null)
    }
  }

  const handleStockAdjustment = (type: "add" | "remove") => {
    if (adjustmentItem && adjustmentQuantity > 0) {
      const newQuantity =
        type === "add"
          ? adjustmentItem.quantity + adjustmentQuantity
          : Math.max(0, adjustmentItem.quantity - adjustmentQuantity)

      onUpdateStock(adjustmentItem.id, { quantity: newQuantity })
      setAdjustmentItem(null)
      setAdjustmentQuantity(0)
    }
  }

  const getStockStatus = (item: StockItem) => {
    if (item.quantity <= item.minStock) return { status: "Low", color: "destructive" }
    if (item.quantity >= item.maxStock) return { status: "High", color: "default" }
    return { status: "Normal", color: "secondary" }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Search and manage your stock items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Items Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Item</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Quantity</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Unit Price</th>
                  <th className="p-4 font-medium">Total Value</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item)
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{item.quantity}</p>
                          <p className="text-xs text-gray-500">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={stockStatus.color as any}>{stockStatus.status}</Badge>
                      </td>
                      <td className="p-4">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-4">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setAdjustmentItem(item)}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Adjust Stock</DialogTitle>
                                <DialogDescription>Adjust quantity for {item.name}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Current Quantity: {item.quantity}</Label>
                                </div>
                                <div>
                                  <Label htmlFor="adjustment">Adjustment Quantity</Label>
                                  <Input
                                    id="adjustment"
                                    type="number"
                                    value={adjustmentQuantity}
                                    onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                                    min="0"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => handleStockAdjustment("remove")}>
                                  <Minus className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                                <Button onClick={() => handleStockAdjustment("add")}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" onClick={() => onDeleteStock(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Stock Item</DialogTitle>
              <DialogDescription>Update the details for this stock item</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  value={editingItem.sku}
                  onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-min">Min Stock</Label>
                  <Input
                    id="edit-min"
                    type="number"
                    value={editingItem.minStock}
                    onChange={(e) => setEditingItem({ ...editingItem, minStock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-max">Max Stock</Label>
                  <Input
                    id="edit-max"
                    type="number"
                    value={editingItem.maxStock}
                    onChange={(e) => setEditingItem({ ...editingItem, maxStock: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-price">Unit Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editingItem.unitPrice}
                  onChange={(e) => setEditingItem({ ...editingItem, unitPrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-supplier">Supplier</Label>
                <Input
                  id="edit-supplier"
                  value={editingItem.supplier}
                  onChange={(e) => setEditingItem({ ...editingItem, supplier: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

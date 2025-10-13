"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";
import { MOCK_CATEGORIES } from "@/utils/constants";

export function ProductFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [availability, setAvailability] = useState<string[]>([]);

  return (
    <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-6">Filter Options</h2>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Select Category</h3>
        <div className="space-y-2">
          {MOCK_CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category.id]);
                  } else {
                    setSelectedCategories(selectedCategories.filter((id) => id !== category.id));
                  }
                }}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Rating</h3>
        <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">& Up</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={availability.includes("in-stock")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setAvailability([...availability, "in-stock"]);
                } else {
                  setAvailability(availability.filter((item) => item !== "in-stock"));
                }
              }}
            />
            <Label htmlFor="in-stock" className="text-sm cursor-pointer">
              In Stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="out-of-stock"
              checked={availability.includes("out-of-stock")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setAvailability([...availability, "out-of-stock"]);
                } else {
                  setAvailability(availability.filter((item) => item !== "out-of-stock"));
                }
              }}
            />
            <Label htmlFor="out-of-stock" className="text-sm cursor-pointer">
              Out of Stock
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  Download,
  Palette,
  Grid,
  Clock,
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
} from "lucide-react";
import type { Material, MaterialAnalysisResult } from "@/types/api";
import Image from "next/image";

export function MaterialAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<MaterialAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      setAnalysisResult({
        materials: [],
        totalRegions: 0,
        processingTime: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportMaterials = () => {
    if (!analysisResult) return;

    const materialsData = {
      materials: analysisResult.materials.map((material) => ({
        name: material.name,
        color: material.color,
        dominance: material.dominance,
      })),
      metadata: {
        totalRegions: analysisResult.totalRegions,
        processingTime: analysisResult.processingTime,
        exportedAt: new Date().toISOString(),
      },
    };

    const blob = new Blob([JSON.stringify(materialsData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "materials-analysis.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial({ ...material });
  };

  const handleSaveMaterial = (updatedMaterial: Material) => {
    if (!analysisResult) return;

    const updatedMaterials = analysisResult.materials.map((m) =>
      m.id === updatedMaterial.id ? updatedMaterial : m
    );

    setAnalysisResult({
      ...analysisResult,
      materials: updatedMaterials,
    });
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (!analysisResult) return;

    const updatedMaterials = analysisResult.materials.filter(
      (m) => m.id !== materialId
    );

    setAnalysisResult({
      ...analysisResult,
      materials: updatedMaterials,
    });
  };

  const handleCreateMaterial = (newMaterial: Omit<Material, "id">) => {
    if (!analysisResult) return;

    const material: Material = {
      ...newMaterial,
      id: `material-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setAnalysisResult({
      ...analysisResult,
      materials: [...analysisResult.materials, material],
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Material Analyzer</h1>
        <p className="text-muted-foreground">
          Upload an image to automatically detect and extract materials based on
          spatial color analysis
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Image
          </CardTitle>
          <CardDescription>
            Select an image to analyze for material detection. Supported
            formats: JPEG, PNG, WebP, GIF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full h-32 border-dashed"
                disabled={isAnalyzing}
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p>Click to select image</p>
                  <p className="text-sm text-muted-foreground">Max 10MB</p>
                </div>
              </Button>

              {selectedFile && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Selected: {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Analyze Materials
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Preview</p>
              <div className="border rounded-lg p-4 bg-muted/50">
                {imagePreview ? (
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Image preview"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded"
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded">
                    Image preview will appear here
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Grid className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Palette className="h-4 w-4" />
                    {analysisResult.materials.length} materials detected
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {analysisResult.processingTime}ms
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <CreateMaterialDialog
                  isOpen={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                  onCreateMaterial={handleCreateMaterial}
                />
                <Button
                  onClick={handleExportMaterials}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {analysisResult.materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onEdit={handleEditMaterial}
                  onDelete={handleDeleteMaterial}
                  isEditing={editingMaterial?.id === material.id}
                  editingMaterial={editingMaterial}
                  onSave={handleSaveMaterial}
                  onCancelEdit={() => setEditingMaterial(null)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MaterialCard({
  material,
  onEdit,
  onDelete,
  isEditing,
  editingMaterial,
  onSave,
  onCancelEdit,
}: {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  editingMaterial: Material | null;
  onSave: (material: Material) => void;
  onCancelEdit: () => void;
}) {
  const [localMaterial, setLocalMaterial] = useState<Material>(material);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSave = () => {
    // Validate hex color
    if (!/^#[0-9A-F]{6}$/i.test(localMaterial.color)) {
      alert("Please enter a valid hex color (e.g., #FF5733)");
      return;
    }

    onSave(localMaterial);
  };

  const handleColorChange = (color: string) => {
    setLocalMaterial((prev) => ({ ...prev, color }));
  };

  const handleNameChange = (name: string) => {
    setLocalMaterial((prev) => ({ ...prev, name }));
  };

  const handleDominanceChange = (dominance: number) => {
    setLocalMaterial((prev) => ({
      ...prev,
      dominance: Math.max(0, Math.min(100, dominance)),
    }));
  };

  if (isEditing && editingMaterial) {
    return (
      <Card className="border-2 border-primary">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-border flex-shrink-0"
              style={{ backgroundColor: localMaterial.color }}
            />
            <div className="flex-1 space-y-2">
              <Input
                value={localMaterial.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Material name"
                className="h-8"
              />
              <Input
                value={localMaterial.color}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#FF5733"
                className="h-8 font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Dominance:</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={localMaterial.dominance}
                onChange={(e) =>
                  handleDominanceChange(Number.parseFloat(e.target.value) || 0)
                }
                className="h-6 w-16 text-xs"
              />
              <span className="text-xs">%</span>
            </div>
            <Progress value={localMaterial.dominance} className="h-2" />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button
              onClick={onCancelEdit}
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg border-2 border-border flex-shrink-0"
            style={{ backgroundColor: material.color }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{material.name}</p>
            <button
              onClick={() => copyToClipboard(material.color)}
              className="text-xs text-muted-foreground hover:text-foreground font-mono"
              title="Click to copy"
            >
              {material.color}
            </button>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              onClick={() => onEdit(material)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => onDelete(material.id)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Dominance</span>
            <span>{material.dominance.toFixed(1)}%</span>
          </div>
          <Progress value={material.dominance} className="h-2" />
        </div>

        <div className="text-xs text-muted-foreground">
          Region: {material.region.width}×{material.region.height}px
        </div>
      </CardContent>
    </Card>
  );
}

function CreateMaterialDialog({
  isOpen,
  onOpenChange,
  onCreateMaterial,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateMaterial: (material: Omit<Material, "id">) => void;
}) {
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    color: "#FF5733",
    dominance: 10,
    region: { x: 0, y: 0, width: 100, height: 100 },
  });

  const handleCreate = () => {
    if (!newMaterial.name.trim()) {
      alert("Please enter a material name");
      return;
    }

    if (!/^#[0-9A-F]{6}$/i.test(newMaterial.color)) {
      alert("Please enter a valid hex color (e.g., #FF5733)");
      return;
    }

    onCreateMaterial(newMaterial);
    setNewMaterial({
      name: "",
      color: "#FF5733",
      dominance: 10,
      region: { x: 0, y: 0, width: 100, height: 100 },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Material</DialogTitle>
          <DialogDescription>
            Add a custom material to your analysis results.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material-name">Material Name</Label>
            <Input
              id="material-name"
              value={newMaterial.name}
              onChange={(e) =>
                setNewMaterial((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Wood, Metal, Fabric"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="material-color">Hex Color</Label>
            <div className="flex gap-2">
              <div
                className="w-10 h-10 rounded border-2 border-border flex-shrink-0"
                style={{ backgroundColor: newMaterial.color }}
              />
              <Input
                id="material-color"
                value={newMaterial.color}
                onChange={(e) =>
                  setNewMaterial((prev) => ({ ...prev, color: e.target.value }))
                }
                placeholder="#FF5733"
                className="font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="material-dominance">Dominance (%)</Label>
            <Input
              id="material-dominance"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={newMaterial.dominance}
              onChange={(e) =>
                setNewMaterial((prev) => ({
                  ...prev,
                  dominance: Math.max(
                    0,
                    Math.min(100, Number.parseFloat(e.target.value) || 0)
                  ),
                }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Create Material</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

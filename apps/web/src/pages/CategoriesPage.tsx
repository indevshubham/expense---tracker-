import { FormEvent, useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Card, EmptyState, Field, Input, Select, Skeleton, StatusPill } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import type { Category } from "../types/api";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#12b981");
  const [type, setType] = useState<Category["type"]>("both");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<{ categories: Category[] }>("/categories");
      setCategories(data.categories);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}`, { name, color, type });
      } else {
        await api.post("/categories", { name, color, type, icon: "CircleDollarSign" });
      }
      toast.success(editingId ? "Category updated" : "Category created");
      setName("");
      setColor("#12b981");
      setType("both");
      setEditingId(null);
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setName(category.name);
    setColor(category.color);
    setType(category.type);
  }

  async function deleteCategory(id: string) {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (loading) return <Skeleton className="h-[560px]" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card>
        <p className="label">Categories</p>
        <h2 className="mb-5 text-2xl font-black">{editingId ? "Edit category" : "Create a category"}</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Field label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Color">
              <Input value={color} onChange={(event) => setColor(event.target.value)} type="color" />
            </Field>
            <Field label="Type">
              <Select value={type} onChange={(event) => setType(event.target.value as Category["type"])}>
                <option value="both">Both</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button>{editingId ? "Update category" : "Create category"}</Button>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setName(""); setColor("#12b981"); setType("both"); }}>
                <X size={16} /> Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card>
        <p className="label">Available categories</p>
        <h2 className="mb-5 text-2xl font-black">User-owned category list</h2>
        {categories.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="h-11 w-11 rounded-2xl" style={{ backgroundColor: category.color }} />
                  <div>
                    <p className="font-black">{category.name}</p>
                    <div className="mt-1 flex gap-2">
                      <StatusPill>{category.type}</StatusPill>
                      {category.isDefault ? <StatusPill tone="green">Default</StatusPill> : null}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => startEdit(category)}>
                    <Pencil size={16} />
                  </Button>
                  <Button type="button" variant="danger" onClick={() => deleteCategory(category.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No categories" body="Categories are loaded from your account. Create one before adding transactions." />
        )}
      </Card>
    </div>
  );
}

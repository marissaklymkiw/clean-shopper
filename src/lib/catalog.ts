import { supabase } from './supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SafetyLevel = 'clean' | 'caution' | 'avoid'

export interface Category {
  id: string
  slug: string
  name: string
  parentId: string | null
  sortOrder: number
}

export interface ProductSummary {
  id: string
  name: string
  brand: string | null
  categoryId: string
  categoryName: string
  imageUrl: string | null
  cleanScore: number
  safety: SafetyLevel
}

export interface Ingredient {
  name: string
  concernLevel: 'none' | 'caution' | 'avoid'
  concernReason: string | null
  position: number
}

export interface Certification {
  slug: string
  name: string
}

export interface ProductDetail extends ProductSummary {
  barcode: string | null
  retailerUrl: string | null
  ingredients: Ingredient[]
  certifications: Certification[]
}

// ─── Score → safety mapping ───────────────────────────────────────────────────
// 75–100: clean, 40–74: caution, 0–39: avoid
// Matches the three-tier system defined in project-context.md §7.

export function scoreToSafety(score: number): SafetyLevel {
  if (score >= 75) return 'clean'
  if (score >= 40) return 'caution'
  return 'avoid'
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, parent_id, sort_order')
    .order('sort_order')

  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
  }))
}

export async function getProducts(options?: { categoryId?: string; categoryIds?: string[] }): Promise<ProductSummary[]> {
  let query = supabase
    .from('products')
    .select('id, name, image_url, clean_score, category_id, brands(name), categories(name)')

  if (options?.categoryIds && options.categoryIds.length > 0) {
    query = query.in('category_id', options.categoryIds)
  } else if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  const { data, error } = await query.order('name')
  if (error) throw error

  return data.map((row) => {
    const score = row.clean_score ?? 0
    return {
      id: row.id,
      name: row.name,
      brand: (row.brands as { name: string } | null)?.name ?? null,
      categoryId: row.category_id,
      categoryName: (row.categories as { name: string } | null)?.name ?? '',
      imageUrl: row.image_url,
      cleanScore: score,
      safety: scoreToSafety(score),
    }
  })
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, image_url, clean_score, category_id, retailer_url, barcode,
      brands(name),
      categories(name),
      product_ingredients(position, ingredients(name, concern_level, concern_reason)),
      product_certifications(certifications(slug, name))
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  const score = data.clean_score ?? 0

  const ingredients: Ingredient[] = (
    (data.product_ingredients as Array<{
      position: number
      ingredients: { name: string; concern_level: string; concern_reason: string | null }
    }>) ?? []
  )
    .map((pi) => ({
      name: pi.ingredients.name,
      concernLevel: pi.ingredients.concern_level as Ingredient['concernLevel'],
      concernReason: pi.ingredients.concern_reason,
      position: pi.position,
    }))
    .sort((a, b) => a.position - b.position)

  const certifications: Certification[] = (
    (data.product_certifications as Array<{
      certifications: { slug: string; name: string }
    }>) ?? []
  ).map((pc) => ({
    slug: pc.certifications.slug,
    name: pc.certifications.name,
  }))

  return {
    id: data.id,
    name: data.name,
    brand: (data.brands as { name: string } | null)?.name ?? null,
    categoryId: data.category_id,
    categoryName: (data.categories as { name: string } | null)?.name ?? '',
    imageUrl: data.image_url,
    barcode: data.barcode,
    retailerUrl: data.retailer_url,
    cleanScore: score,
    safety: scoreToSafety(score),
    ingredients,
    certifications,
  }
}

// ─── Saved list & Cart ────────────────────────────────────────────────────────
// Both backed by cart_items.item_type: 'saved' | 'cart'

type ItemType = 'saved' | 'cart'

async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')
  return user.id
}

export async function getItemIds(type: ItemType): Promise<string[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('product_id')
    .eq('item_type', type)

  if (error) throw error
  return (data ?? []).map((row) => row.product_id as string)
}

export async function addItem(productId: string, type: ItemType): Promise<void> {
  const userId = await getCurrentUserId()
  const { error } = await supabase
    .from('cart_items')
    .upsert({ product_id: productId, user_id: userId, item_type: type }, { onConflict: 'user_id,product_id' })

  if (error) throw error
}

export async function removeItem(productId: string, type: ItemType): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('product_id', productId)
    .eq('item_type', type)

  if (error) throw error
}

export async function moveToCart(productId: string): Promise<void> {
  const userId = await getCurrentUserId()
  const { error } = await supabase
    .from('cart_items')
    .update({ item_type: 'cart' })
    .eq('product_id', productId)
    .eq('user_id', userId)
    .eq('item_type', 'saved')

  if (error) throw error
}

const PRODUCT_SELECT = 'product_id, products(id, name, image_url, clean_score, category_id, brands(name), categories(name))'

function mapProductRow(row: Record<string, unknown>): ProductSummary {
  const p = row.products as {
    id: string; name: string; image_url: string | null; clean_score: number | null
    category_id: string; brands: { name: string } | null; categories: { name: string } | null
  }
  const score = p.clean_score ?? 0
  return {
    id: p.id,
    name: p.name,
    brand: p.brands?.name ?? null,
    categoryId: p.category_id,
    categoryName: p.categories?.name ?? '',
    imageUrl: p.image_url,
    cleanScore: score,
    safety: scoreToSafety(score),
  }
}

export async function getItemProducts(type: ItemType): Promise<ProductSummary[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(PRODUCT_SELECT)
    .eq('item_type', type)

  if (error) throw error
  return (data ?? []).map(mapProductRow)
}

// ─── Chat context ─────────────────────────────────────────────────────────────

export interface CategoryContextProduct {
  name: string
  brand: string | null
  cleanScore: number
  safety: SafetyLevel
  ingredients: { name: string; concernLevel: string; concernReason: string | null }[]
  certifications: string[]
}

export interface CategoryContext {
  categoryName: string
  products: CategoryContextProduct[]
}

export async function getCategoryContext(categoryId: string): Promise<CategoryContext> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      name, clean_score,
      brands(name),
      categories(name),
      product_ingredients(position, ingredients(name, concern_level, concern_reason)),
      product_certifications(certifications(name))
    `)
    .eq('category_id', categoryId)
    .order('clean_score', { ascending: false })
    .limit(25)

  if (error) throw error

  const categoryName =
    (data[0]?.categories as { name: string } | null)?.name ?? 'this category'

  const products: CategoryContextProduct[] = data.map((row) => {
    const score = row.clean_score ?? 0

    const ingredients = (
      (row.product_ingredients as Array<{
        position: number
        ingredients: { name: string; concern_level: string; concern_reason: string | null }
      }>) ?? []
    )
      .sort((a, b) => a.position - b.position)
      .map((pi) => ({
        name: pi.ingredients.name,
        concernLevel: pi.ingredients.concern_level,
        concernReason: pi.ingredients.concern_reason,
      }))

    const certifications = (
      (row.product_certifications as Array<{ certifications: { name: string } }>) ?? []
    ).map((pc) => pc.certifications.name)

    return {
      name: row.name,
      brand: (row.brands as { name: string } | null)?.name ?? null,
      cleanScore: score,
      safety: scoreToSafety(score),
      ingredients,
      certifications,
    }
  })

  return { categoryName, products }
}

export function formatCategoryContext(ctx: CategoryContext): string {
  const lines: string[] = [
    `Catalog context — ${ctx.categoryName} (${ctx.products.length} products from the Clean Shopper catalog):`,
    '',
  ]

  for (const p of ctx.products) {
    const verdict = `${p.safety.charAt(0).toUpperCase() + p.safety.slice(1)} (score ${p.cleanScore})`
    lines.push(`Product: ${p.name}`)
    lines.push(`Brand: ${p.brand ?? 'Unknown'} | Rating: ${verdict}`)

    if (p.ingredients.length > 0) {
      const ingredientParts = p.ingredients.map((ing) => {
        if (ing.concernLevel === 'none') return ing.name
        const flag = ing.concernLevel === 'avoid' ? 'avoid' : 'caution'
        const reason = ing.concernReason ? ` — ${ing.concernReason}` : ''
        return `${ing.name} [${flag}${reason}]`
      })
      lines.push(`Ingredients: ${ingredientParts.join(', ')}`)
    }

    if (p.certifications.length > 0) {
      lines.push(`Certifications: ${p.certifications.join(', ')}`)
    }

    lines.push('')
  }

  lines.push(
    'Use this data to give specific answers about these products. ' +
    'If asked about a product not listed here, say you only have catalog data for the current category.',
  )

  return lines.join('\n')
}

export function formatProductContext(product: ProductDetail): string {
  const verdict = `${product.safety.charAt(0).toUpperCase() + product.safety.slice(1)} (score ${product.cleanScore})`
  const lines: string[] = [
    `Product context — ${product.name} from the Clean Shopper catalog:`,
    '',
    `Product: ${product.name}`,
    `Brand: ${product.brand ?? 'Unknown'} | Rating: ${verdict}`,
    `Category: ${product.categoryName}`,
  ]

  if (product.certifications.length > 0) {
    lines.push(`Certifications: ${product.certifications.map((c) => c.name).join(', ')}`)
  }

  if (product.ingredients.length > 0) {
    lines.push('')
    lines.push('Full ingredient list (in order of label prominence):')
    product.ingredients.forEach((ing, i) => {
      const flag =
        ing.concernLevel === 'none'
          ? 'No concern'
          : ing.concernLevel === 'caution'
          ? `Caution${ing.concernReason ? ` — ${ing.concernReason}` : ''}`
          : `Avoid${ing.concernReason ? ` — ${ing.concernReason}` : ''}`
      lines.push(`${i + 1}. ${ing.name} — ${flag}`)
    })
  }

  lines.push('')
  lines.push(
    'Use this data to answer specific questions about this product\'s ingredients, safety rating, and certifications.',
  )

  return lines.join('\n')
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchProducts(query: string): Promise<ProductSummary[]> {
  const term = `%${query}%`

  // Find brand IDs whose names match, then OR with product name match.
  const { data: brandRows } = await supabase
    .from('brands')
    .select('id')
    .ilike('name', term)

  const brandIds = (brandRows ?? []).map((b) => b.id)

  let q = supabase
    .from('products')
    .select('id, name, image_url, clean_score, category_id, brands(name), categories(name)')

  if (brandIds.length > 0) {
    q = q.or(`name.ilike.${term},brand_id.in.(${brandIds.join(',')})`)
  } else {
    q = q.ilike('name', term)
  }

  const { data, error } = await q.order('name')
  if (error) throw error

  return data.map((row) => {
    const score = row.clean_score ?? 0
    return {
      id: row.id,
      name: row.name,
      brand: (row.brands as { name: string } | null)?.name ?? null,
      categoryId: row.category_id,
      categoryName: (row.categories as { name: string } | null)?.name ?? '',
      imageUrl: row.image_url,
      cleanScore: score,
      safety: scoreToSafety(score),
    }
  })
}

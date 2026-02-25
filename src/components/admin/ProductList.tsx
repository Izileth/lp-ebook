// src/components/admin/ProductList.tsx
import { useState, useCallback } from "react";
import { motion,AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";
import { useDeleteProduct } from "../../hooks/useProductMutations";
import { LoadingState, ErrorState } from "../ui/StatesScreens";
import {
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconX,
  IconCheck,
  IconBook,
  IconTag,
  IconLoader,
} from "../Icons";
import type { Product } from "../../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductListProps {
  onEdit:    (product: Product) => void;
  onSuccess: () => void;
}

interface DeleteConfirmState {
  open:      boolean;
  productId: number | null;
  name:      string;
}

const INITIAL_CONFIRM: DeleteConfirmState = {
  open: false, productId: null, name: "",
};

// ─── Motion Variants ──────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const rowVariants: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, x: -16, transition: { duration: 0.25 } },
};

const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.96, y: 8,  transition: { duration: 0.22 } },
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteModalProps {
  name:       string;
  loading:    boolean;
  onConfirm:  () => void;
  onCancel:   () => void;
}

function DeleteModal({ name, loading, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[380px] border border-white/[0.1] bg-black p-8 flex flex-col gap-6"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-5 right-5 text-white/25 hover:text-white/60 transition-colors"
          aria-label="Fechar"
        >
          <IconX size={15} />
        </button>

        {/* Icon */}
        <div className="w-11 h-11 border border-white/[0.12] flex items-center justify-center text-white/40">
          <IconAlertCircle size={18} />
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/30 border-l-2 border-white/20 pl-3">
            Confirmar exclusão
          </span>
          <h3
            className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1] tracking-[-0.01em]"
            style={{ fontSize: "clamp(18px,2.5vw,24px)" }}
          >
            Remover produto?
          </h3>
          <p className="font-sans font-light text-[13px] leading-[1.65] text-white/45 mt-1">
            Você está prestes a excluir{" "}
            <span className="text-white/70 font-normal not-italic">"{name}"</span>.
            Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <motion.button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.03, y: -1 }}
            whileTap={loading  ? {} : { scale: 0.97 }}
            className="flex-1 bg-white text-black font-sans text-[11px] font-bold tracking-[0.15em] uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-white/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <><IconLoader size={13} /> Excluindo...</>
              : <><IconCheck size={13} />  Confirmar</>
            }
          </motion.button>
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 border border-white/[0.1] font-sans text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white hover:border-white/30 transition-[color,border-color] disabled:opacity-40"
          >
            Cancelar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-24 gap-4 border border-white/[0.06] text-center"
    >
      <div className="w-11 h-11 border border-white/[0.1] flex items-center justify-center text-white/20">
        <IconBook size={18} />
      </div>
      <p
        className="[font-family:'Playfair_Display',serif] font-bold text-white/50"
        style={{ fontSize: "clamp(16px,2vw,20px)" }}
      >
        Nenhum produto cadastrado.
      </p>
      <p className="font-sans text-[12px] text-white/25 tracking-wide">
        Clique em "Novo produto" para começar.
      </p>
    </motion.div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

interface ProductRowProps {
  product:       Product;
  deletingId:    number | null;
  onEdit:        (p: Product) => void;
  onDeleteClick: (p: Product) => void;
}

function ProductRow({ product, deletingId, onEdit, onDeleteClick }: ProductRowProps) {
  const isDeleting = deletingId === product.id;

  return (
    <motion.div
      layout
      variants={rowVariants}
      exit="exit"
      className={[
        "grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[2fr_1fr_auto_auto] items-center gap-4 px-6 py-5",
        "border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors duration-200 group",
        isDeleting ? "opacity-40 pointer-events-none" : "",
      ].join(" ")}
    >
      {/* Name */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="[font-family:'Playfair_Display',serif] font-bold text-white truncate"
          style={{ fontSize: "clamp(13px,1.3vw,16px)" }}
        >
          {product.name}
        </span>
        {product.badge && (
          <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/30">
            {product.badge}
          </span>
        )}
      </div>

      {/* Category */}
      <div className="hidden md:flex items-center gap-1.5 text-white/35">
        <IconTag size={12} />
        <span className="font-sans text-[11px] tracking-[0.1em] uppercase">
          {product.category}
        </span>
      </div>

      {/* Price */}
      <span
        className="[font-family:'Playfair_Display',serif] font-bold text-white/80 tabular-nums"
        style={{ fontSize: "clamp(13px,1.3vw,15px)" }}
      >
        {typeof product.price === "number"
          ? `R$ ${product.price.toFixed(2)}`
          : product.price}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <motion.button
          type="button"
          onClick={() => onEdit(product)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 border border-transparent hover:border-white/[0.14] flex items-center justify-center text-white/25 hover:text-white/70 transition-[color,border-color] duration-200"
          aria-label={`Editar ${product.name}`}
        >
          <IconEdit size={14} />
        </motion.button>

        <motion.button
          type="button"
          onClick={() => onDeleteClick(product)}
          disabled={isDeleting}
          whileHover={isDeleting ? {} : { scale: 1.1 }}
          whileTap={isDeleting   ? {} : { scale: 0.9 }}
          className="w-8 h-8 border border-transparent hover:border-white/[0.14] flex items-center justify-center text-white/25 hover:text-white/60 transition-[color,border-color] duration-200 disabled:opacity-30"
          aria-label={`Excluir ${product.name}`}
        >
          {isDeleting
            ? <IconLoader size={13} />
            : <IconTrash  size={14} />
          }
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── ProductList ──────────────────────────────────────────────────────────────

export function ProductList({ onEdit, onSuccess }: ProductListProps) {
  const { products, loading, error }                = useProducts();
  const { deleteProduct, loading: deleteLoading }   = useDeleteProduct();

  const [confirm,    setConfirm]    = useState<DeleteConfirmState>(INITIAL_CONFIRM);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Open modal
  const handleDeleteClick = useCallback((product: Product) => {
    setConfirm({ open: true, productId: product.id, name: product.name });
  }, []);

  // Cancel modal
  const handleCancel = useCallback(() => {
    setConfirm(INITIAL_CONFIRM);
  }, []);

  // Confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (confirm.productId === null) return;

    const id = confirm.productId;
    setDeletingId(id);
    setConfirm(INITIAL_CONFIRM);

    const result = await deleteProduct(id);
    setDeletingId(null);

    if (result && !result.error) onSuccess();
  }, [confirm.productId, deleteProduct, onSuccess]);

  // ── States ──────────────────────────────────────────────────────────────
  if (loading) return <LoadingState message="Carregando produtos..." />;
  if (error)   return <ErrorState  error={error} onRetry={() => window.location.reload()} />;

  return (
    <>
      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirm.open && (
          <DeleteModal
            key="delete-modal"
            name={confirm.name}
            loading={deleteLoading}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>

      {/* Table header */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[2fr_1fr_auto_auto] gap-4 px-6 py-3 border-b border-white/[0.08]"
        >
          {[
            { label: "Nome",      cls: "" },
            { label: "Categoria", cls: "hidden md:block" },
            { label: "Preço",     cls: "" },
            { label: "",          cls: "" },
          ].map(({ label, cls }, i) => (
            <span
              key={i}
              className={`font-sans text-[10px] tracking-[0.2em] uppercase text-white/25 ${cls}`}
            >
              {label}
            </span>
          ))}
        </motion.div>
      )}

      {/* Rows */}
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                deletingId={deletingId}
                onEdit={onEdit}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Footer count */}
      {products.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 font-sans text-[10px] tracking-[0.15em] uppercase text-white/20 text-right"
        >
          {products.length} produto{products.length !== 1 ? "s" : ""}
        </motion.p>
      )}
    </>
  );
}
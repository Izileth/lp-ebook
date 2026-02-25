// src/components/admin/AdminDashboard.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useAdmin } from "../../hooks/useAdmin";
import { ProductList } from "./ProductList";
import { ProductForm } from "./ProductForm";
import { LoadingState, ErrorState } from "../ui/StatesScreens";
import { Header } from "../Header";
import { MobileMenu } from "../MobileMenu";
import { NoiseOverlay } from "../NoiseOverlay";
import {
  IconPlus,
  IconArrowLeft,
  IconAlertCircle,
  IconSettings,
  IconUser,
  IconTrendingUp,
  IconBookOpen,
} from "../Icons";
import type { Product } from "../../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "list" | "create" | "edit";

interface ViewState {
  current:  View;
  product?: Product;
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const slideRight: Variants = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0,   transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, x:  16,              transition: { duration: 0.25 } },
};

// ─── Access Denied ────────────────────────────────────────────────────────────

function AccessDenied({ menuOpen, setMenuOpen }: { menuOpen: boolean, setMenuOpen: (o: boolean) => void }) {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden pt-16">
      <NoiseOverlay />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      <div className="flex-1 flex items-center justify-center">
        <span
          aria-hidden="true"
          className="[font-family:'Playfair_Display',serif] absolute font-black select-none pointer-events-none text-white/[0.03] leading-none"
          style={{ fontSize: "clamp(120px,20vw,240px)" }}
        >
          403
        </span>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-8 max-w-[420px] flex flex-col items-center gap-6"
        >
          <motion.div variants={fadeUp}>
            <div className="w-12 h-12 border border-white/[0.14] flex items-center justify-center text-white/40">
              <IconAlertCircle size={20} />
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
            <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-white/30 border-l-2 border-white/20 pl-3">
              Acesso restrito
            </span>
            <h1
              className="[font-family:'Playfair_Display',serif] font-bold leading-[1.08] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(24px,3.5vw,38px)" }}
            >
              Área exclusiva
              <br />
              <em className="not-italic text-white/55">de administradores.</em>
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="font-sans font-light text-[13px] leading-[1.7] text-white/40 max-w-[300px]"
          >
            Você não possui permissão para acessar esta área.
            Entre em contato com o administrador do sistema.
          </motion.p>
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-3.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
          >
            <IconArrowLeft size={14} />
            Voltar à loja
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon:  React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="border border-white/[0.08] bg-white/[0.02] px-6 py-5 flex items-center gap-4"
    >
      <div className="text-white/25 shrink-0">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/35">{label}</span>
        <span
          className="[font-family:'Playfair_Display',serif] font-bold text-white"
          style={{ fontSize: "clamp(18px,2vw,24px)" }}
        >
          {value}
        </span>
      </div>
    </motion.div>
  );
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────

export function AdminDashboard() {
  const navigate = useNavigate();

  const { user, loading: authLoading }          = useAuth();
  const { isAdmin, loading: adminLoading, error: adminError } = useAdmin();

  const [viewState, setViewState] = useState<ViewState>({ current: "list" });
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  // ── Handlers (stable refs via useCallback) ────────────────────────────────
  const handleEdit = useCallback((product: Product) => {
    setViewState({ current: "edit", product });
  }, []);

  const handleCreateNew = useCallback(() => {
    setViewState({ current: "create", product: undefined });
  }, []);

  const handleSuccess = useCallback(() => {
    setViewState({ current: "list" });
    setRefreshKey((k) => k + 1);
  }, []);

  const handleCancel = useCallback(() => {
    setViewState({ current: "list" });
  }, []);

  // ── Early returns ─────────────────────────────────────────────────────────
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-black">
        <LoadingState message="Verificando permissões..." />
      </div>
    );
  }

  if (adminError) {
    return (
      <div className="min-h-screen bg-black">
        <ErrorState error={adminError} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!user)    return null;
  if (!isAdmin) return <AccessDenied menuOpen={menuOpen} setMenuOpen={setMenuOpen} />;

  // ── Main render ───────────────────────────────────────────────────────────
  const isFormView = viewState.current === "create" || viewState.current === "edit";

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-white/20 pt-16">
      <NoiseOverlay />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 py-16">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.header
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-14"
        >
          {/* Title */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3 mb-8">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3">
              Painel administrativo
            </span>
            <h1
              className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: "clamp(28px,4.5vw,52px)" }}
            >
              Gerencie seu
              <br />
              <em className="not-italic text-white/60">catálogo.</em>
            </h1>
          </motion.div>

          {/* Stats row — only on list view */}
          <AnimatePresence>
            {!isFormView && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0,  height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <StatCard icon={<IconBookOpen  size={18} />} label="Ebooks"    value="—" />
                  <StatCard icon={<IconTrendingUp size={18} />} label="Vendas"    value="—" />
                  <StatCard icon={<IconUser       size={18} />} label="Usuários"  value="—" />
                  <StatCard icon={<IconSettings   size={18} />} label="Revisões"  value="—" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── View container ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ── List view ──────────────────────────────────────────────── */}
          {viewState.current === "list" && (
            <motion.div
              key="list"
              variants={slideRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">
                    Produtos
                  </span>
                  <h2
                    className="[font-family:'Playfair_Display',serif] font-bold"
                    style={{ fontSize: "clamp(18px,2.5vw,26px)" }}
                  >
                    Catálogo atual
                  </h2>
                </div>

                <motion.button
                  type="button"
                  onClick={handleCreateNew}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-black font-sans text-[11px] font-medium tracking-[0.12em] uppercase px-5 py-3 flex items-center gap-2 hover:bg-white/85 transition-colors"
                >
                  <IconPlus size={14} />
                  Novo produto
                </motion.button>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.07] mb-8" />

              <ProductList
                key={refreshKey}
                onEdit={handleEdit}
                onSuccess={handleSuccess}
              />
            </motion.div>
          )}

          {/* ── Form view (create / edit) ──────────────────────────────── */}
          {isFormView && (
            <motion.div
              key="form"
              variants={slideRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Back + section header */}
              <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div className="flex flex-col gap-3">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ x: -2 }}
                    className="group flex items-center gap-2 font-sans text-[11px] tracking-[0.12em] uppercase text-white/35 hover:text-white transition-colors w-max"
                  >
                    <span className="transition-transform duration-200 group-hover:-translate-x-1">
                      <IconArrowLeft size={14} />
                    </span>
                    Voltar ao catálogo
                  </motion.button>

                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">
                      {viewState.current === "create" ? "Novo produto" : "Editar produto"}
                    </span>
                    <h2
                      className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05]"
                      style={{ fontSize: "clamp(20px,3vw,32px)" }}
                    >
                      {viewState.current === "create" ? (
                        <>Adicionar ao<br /><em className="not-italic text-white/60">catálogo.</em></>
                      ) : (
                        <>Atualizar<br /><em className="not-italic text-white/60">publicação.</em></>
                      )}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.07] mb-8" />

              <div className="border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10">
                <ProductForm
                  product={viewState.product}
                  onSuccess={handleSuccess}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

          {/* Title */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3 mb-8">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3">
              Painel administrativo
            </span>
            <h1
              className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: "clamp(28px,4.5vw,52px)" }}
            >
              Gerencie seu
              <br />
              <em className="not-italic text-white/60">catálogo.</em>
            </h1>
          </motion.div>

          {/* Stats row — only on list view */}
          <AnimatePresence>
            {!isFormView && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0,  height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <StatCard icon={<IconBookOpen  size={18} />} label="Ebooks"    value="—" />
                  <StatCard icon={<IconTrendingUp size={18} />} label="Vendas"    value="—" />
                  <StatCard icon={<IconUser       size={18} />} label="Usuários"  value="—" />
                  <StatCard icon={<IconSettings   size={18} />} label="Revisões"  value="—" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── View container ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ── List view ──────────────────────────────────────────────── */}
          {viewState.current === "list" && (
            <motion.div
              key="list"
              variants={slideRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">
                    Produtos
                  </span>
                  <h2
                    className="[font-family:'Playfair_Display',serif] font-bold"
                    style={{ fontSize: "clamp(18px,2.5vw,26px)" }}
                  >
                    Catálogo atual
                  </h2>
                </div>

                <motion.button
                  type="button"
                  onClick={handleCreateNew}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-black font-sans text-[11px] font-medium tracking-[0.12em] uppercase px-5 py-3 flex items-center gap-2 hover:bg-white/85 transition-colors"
                >
                  <IconPlus size={14} />
                  Novo produto
                </motion.button>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.07] mb-8" />

              <ProductList
                key={refreshKey}
                onEdit={handleEdit}
                onSuccess={handleSuccess}
              />
            </motion.div>
          )}

          {/* ── Form view (create / edit) ──────────────────────────────── */}
          {isFormView && (
            <motion.div
              key="form"
              variants={slideRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Back + section header */}
              <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div className="flex flex-col gap-3">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ x: -2 }}
                    className="group flex items-center gap-2 font-sans text-[11px] tracking-[0.12em] uppercase text-white/35 hover:text-white transition-colors w-max"
                  >
                    <span className="transition-transform duration-200 group-hover:-translate-x-1">
                      <IconArrowLeft size={14} />
                    </span>
                    Voltar ao catálogo
                  </motion.button>

                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">
                      {viewState.current === "create" ? "Novo produto" : "Editar produto"}
                    </span>
                    <h2
                      className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05]"
                      style={{ fontSize: "clamp(20px,3vw,32px)" }}
                    >
                      {viewState.current === "create" ? (
                        <>Adicionar ao<br /><em className="not-italic text-white/60">catálogo.</em></>
                      ) : (
                        <>Atualizar<br /><em className="not-italic text-white/60">publicação.</em></>
                      )}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.07] mb-8" />

              <div className="border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10">
                <ProductForm
                  product={viewState.product}
                  onSuccess={handleSuccess}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
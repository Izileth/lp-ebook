import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { IconCheck, IconAlertCircle, IconLoader } from "../components/Icons";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "invalid">("loading");

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!email) {
        setStatus("invalid");
        return;
      }

      try {
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .delete()
          .eq("email", email);

        if (error) throw error;
        setStatus("success");
      } catch (err) {
        console.error("Unsubscribe error:", err);
        setStatus("error");
      }
    };

    handleUnsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-10 rounded-2xl"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <IconLoader size={40} className="animate-spin text-white/40" />
            <p className="text-white/60 font-sans tracking-wide">Processando seu pedido...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full text-black">
              <IconCheck size={32} />
            </div>
            <div>
              <h1 className="[font-family:'Playfair_Display',serif] text-2xl font-bold text-white mb-2">Inscrição Cancelada</h1>
              <p className="text-white/40 font-sans text-sm leading-relaxed">
                O e-mail <span className="text-white/70">{email}</span> foi removido da nossa lista com sucesso. Você não receberá mais nossos informativos semanais.
              </p>
            </div>
            <Link 
              to="/"
              className="mt-4 px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-sans text-xs uppercase tracking-[0.2em] transition-all"
            >
              Voltar para o site
            </Link>
          </div>
        )}

        {(status === "error" || status === "invalid") && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-red-500/10 flex items-center justify-center rounded-full text-red-500">
              <IconAlertCircle size={32} />
            </div>
            <div>
              <h1 className="[font-family:'Playfair_Display',serif] text-2xl font-bold text-white mb-2">Ops! Algo deu errado</h1>
              <p className="text-white/40 font-sans text-sm leading-relaxed">
                {status === "invalid" 
                  ? "O link que você acessou parece estar incompleto ou é inválido." 
                  : "Não conseguimos processar o cancelamento agora. Por favor, tente novamente mais tarde."}
              </p>
            </div>
            <Link 
              to="/"
              className="mt-4 px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-sans text-xs uppercase tracking-[0.2em] transition-all"
            >
              Ir para a página inicial
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UnsubscribePage;

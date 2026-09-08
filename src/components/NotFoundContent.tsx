// PAGE_META: title="Página não encontrada | Ethos Software", description="A página que você procura não existe ou foi movida. Volte para a página inicial da Ethos Software.", noindex=true

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFoundContent() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-[#531B8C]">
              Página não encontrada
            </h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            O endereço informado não existe ou foi movido.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Voltar para a página inicial
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

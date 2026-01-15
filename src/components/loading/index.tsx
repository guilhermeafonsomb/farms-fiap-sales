export const Loading = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary-500/20"></div>
        <p className="text-black text-lg">Carregando...</p>
        <span className="sr-only">
          Por favor, aguarde enquanto os dados são carregados
        </span>
      </div>
    </div>
  );
};

export const Error = () => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-red-50 border-l-4 border-red-500 p-6 rounded"
    >
      <h2 className="text-red-800 font-bold text-lg mb-2">
        Erro ao carregar dados
      </h2>
      <p className="text-red-700 mb-4">
        Ocorreu um erro ao buscar os dados. Por favor, tente novamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Recarregar página
      </button>
    </div>
  );
};

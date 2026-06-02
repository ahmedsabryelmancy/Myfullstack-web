type PageLoaderProps = {
  title?: string;
  message?: string;
};

export function PageLoader({
  title = "Loading",
  message = "Please wait while we prepare the page.",
}: PageLoaderProps) {
  return (
    <section className="page_loader" aria-live="polite" aria-busy="true">
      <div className="container">
        <div className="page_loader_card">
          <div className="page_loader_visual" aria-hidden="true">
            <span className="page_loader_ring page_loader_ring_outer" />
            <span className="page_loader_ring page_loader_ring_middle" />
            <span className="page_loader_ring page_loader_ring_inner" />
            <span className="page_loader_core" />
          </div>

          <div className="page_loader_copy">
            <p className="page_loader_eyebrow">Storefront sync</p>
            <h1>{title}</h1>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
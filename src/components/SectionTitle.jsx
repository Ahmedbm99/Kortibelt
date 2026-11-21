/** Titre de section (h2) centré avec le trait orange de la marque. */
export default function SectionTitle({ children, light = false }) {
  return (
    <div className="mb-12 text-center">
      <h2 className={`text-3xl font-bold md:text-4xl ${light ? 'text-white' : 'text-primary'}`}>{children}</h2>
      <div className="mx-auto mt-3 h-1 w-20 bg-accent" />
    </div>
  );
}

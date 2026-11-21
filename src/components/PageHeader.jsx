/** Titre de page cohérent : h1 + trait orange + texte d'introduction optionnel. */
export default function PageHeader({ title, intro, children, center = false }) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      <h1 className="text-3xl font-bold text-primary md:text-4xl">{title}</h1>
      <div className={`mt-3 h-1 w-20 bg-accent ${center ? 'mx-auto' : ''}`} />
      {intro && <p className={`mt-4 max-w-3xl text-muted-foreground ${center ? 'mx-auto' : ''}`}>{intro}</p>}
      {children}
    </div>
  );
}

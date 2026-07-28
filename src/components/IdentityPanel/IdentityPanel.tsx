import './IdentityPanel.css'

export default function IdentityPanel() {

  return (
    <section className="identity-panel" aria-labelledby="identity-name">
      <div className="identity-panel__content">
        <div className="identity-panel__avatar" aria-hidden="true">
          <span>AA</span>
        </div>

        <div>
          <h1 className="identity-panel__name" id="identity-name">
            Arkaaz Attar
          </h1>
          <p className="identity-panel__role">Software Engineer</p>
          <p className="identity-panel__university">
            Third-Year Computer Systems Engineering · Carleton University
          </p>
        </div>
      </div>
    </section>
  )
}

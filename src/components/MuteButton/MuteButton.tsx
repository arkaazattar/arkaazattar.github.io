import './MuteButton.css'

type MuteButtonProps = {
  muted?: boolean
  onClick?: () => void
}

export default function MuteButton({ muted = false, onClick }: MuteButtonProps) {
  return (
    <button
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      aria-pressed={muted}
      className="mute-button"
      data-muted={muted}
      onClick={onClick}
      type="button"
    >
      <span className="mute-button__face" aria-hidden="true">
        {muted ? (
          <svg
            className="mute-button__icon"
            viewBox="0 0 24 24"
            shapeRendering="crispEdges"
          >
            <path d="M2 10h4V8h2V6h2V4h2v16h-2v-2H8v-2H6v-2H2z" />
            <path d="M15 8h2v2h-2zm6 0h2v2h-2zm-4 2h4v4h-4zm-2 4h2v2h-2zm6 0h2v2h-2z" />
          </svg>
        ) : (
          <svg
            className="mute-button__icon"
            viewBox="0 0 24 24"
            shapeRendering="crispEdges"
          >
            <path d="M1 10h5V8h2V6h2V4h2v16h-2v-2H8v-2H6v-2H1z" />
            <path d="M15 8h2v2h1v4h-1v2h-2v-2h1v-4h-1zm4-4h2v3h1v3h1v4h-1v3h-1v3h-2v-2h1v-3h1V9h-1V7h-1z" />
          </svg>
        )}
      </span>
    </button>
  )
}

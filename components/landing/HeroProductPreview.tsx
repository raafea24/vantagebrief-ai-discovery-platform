import {
  ArrowRight,
  Check,
  CircleDot,
  FileText,
  MessageSquareText,
  Send,
} from "lucide-react";

const briefItems = [
  { label: "Business context", status: "Captured" },
  { label: "Primary challenge", status: "Clarified" },
  { label: "Open questions", status: "2 remaining" },
];

export function HeroProductPreview() {
  return (
    <div
      className="product-preview"
      id="discovery-preview"
      aria-label="Preview of a VantageBrief discovery conversation and opportunity brief"
    >
      <div className="product-preview__topbar">
        <div className="product-preview__brand">
          <span aria-hidden="true">V</span>
          <strong>VantageBrief</strong>
        </div>
        <span className="product-preview__status">
          <CircleDot aria-hidden="true" size={13} />
          Discovery in progress
        </span>
      </div>

      <div className="product-preview__body">
        <section className="conversation-preview" aria-labelledby="conversation-title">
          <div className="preview-heading">
            <MessageSquareText aria-hidden="true" size={17} />
            <h2 id="conversation-title">Guided discovery</h2>
          </div>

          <div className="conversation-preview__message conversation-preview__message--assistant">
            <span className="conversation-preview__avatar" aria-hidden="true">
              V
            </span>
            <p>What part of the current workflow creates the most friction?</p>
          </div>

          <div className="conversation-preview__message conversation-preview__message--user">
            <p>
              Important handoffs are tracked across separate tools, so ownership
              and next steps are often unclear.
            </p>
          </div>

          <div className="conversation-preview__insight">
            <span aria-hidden="true">
              <Check size={13} strokeWidth={2} />
            </span>
            <p>
              <strong>Structured insight</strong>
              Workflow ownership needs clarification.
            </p>
          </div>
        </section>

        <ArrowRight
          className="product-preview__flow"
          aria-hidden="true"
          size={20}
          strokeWidth={1.5}
        />

        <section className="brief-preview" aria-labelledby="brief-title">
          <div className="preview-heading">
            <FileText aria-hidden="true" size={17} />
            <h2 id="brief-title">Opportunity Brief</h2>
          </div>

          <p className="brief-preview__label">Discovery summary</p>
          <h3>Workflow coordination</h3>
          <p className="brief-preview__summary">
            A structured view of the context, challenge, and decisions still to
            clarify.
          </p>

          <dl>
            {briefItems.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.status}</dd>
              </div>
            ))}
          </dl>

          <div className="brief-preview__email">
            <Send aria-hidden="true" size={15} strokeWidth={1.6} />
            <span>
              <strong>Email brief</strong>
              Available when explicitly requested
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

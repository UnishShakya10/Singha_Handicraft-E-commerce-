import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Anchor, Text, Title } from "@mantine/core";

const AuthPageLayout = ({ eyebrow, title, description, children }) => (
  <div className="auth-page">
    <aside className="auth-story">
      <div className="auth-story-shade" />
      <Anchor component={Link} to="/" underline="never" className="auth-brand">
        <span className="auth-brand-mark">S</span>
        <span className="auth-brand-name">SINGHA HANDICRAFT</span>
      </Anchor>
      <div className="auth-story-copy">
        <span className="auth-story-eyebrow">MADE BY HAND IN PATAN, NEPAL</span>
        <Title order={2} className="auth-story-title">
          A tradition shaped<br />by hand, kept for generations.
        </Title>
        <Text className="auth-story-caption">
          Discover sacred works made with patience, purpose, and a deep respect for craft.
        </Text>
      </div>
      <span className="auth-story-index">01 / THE ATELIER</span>
    </aside>

    <main className="auth-content">
      <div className="auth-form-wrap">
        <Anchor component={Link} to="/shop" underline="never" className="auth-back-link">
          <ArrowLeft size={15} />
          Back to the collection
        </Anchor>
        <div className="auth-form-heading">
          <span className="auth-form-eyebrow">{eyebrow}</span>
          <Title order={1} className="auth-form-title">{title}</Title>
          <Text className="auth-form-description">{description}</Text>
        </div>
        {children}
      </div>
    </main>
  </div>
);

export default AuthPageLayout;
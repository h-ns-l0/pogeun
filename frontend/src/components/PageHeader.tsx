import logoPogeunCloud from "../assets/logo-pogeun-cloud.png";
import "./PageHeader.css";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="topbar">
      <img className="brand-logo" src={logoPogeunCloud} alt={title} />
      <p className="tagline">{subtitle}</p>
    </header>
  );
}

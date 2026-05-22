import SEO from './SEO';

export default function PageHead({ title, description, noindex = true }) {
  return <SEO title={title} description={description} path="/admin" noindex={noindex} />;
}

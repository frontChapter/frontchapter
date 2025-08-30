import MDXContent from "app/helper/MDXContent";
import Banner from "./components/Banner";

interface Frontmatter {
  title: string;
  [key: string]: unknown;
}

interface DefaultProps {
  data: {
    frontmatter: Frontmatter;
    content: string;
    [key: string]: unknown;
  };
}

const Default: React.FC<DefaultProps> = ({ data }) => {
  const { frontmatter, content } = data;
  const { title } = frontmatter;

  return (
    <section className="section">
      <Banner title={title} />
      <div className="container mt-10">
        <div className="content">
          <MDXContent content={content} />
        </div>
      </div>
    </section>
  );
};

export default Default;

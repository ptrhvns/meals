import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/TagForRecipeNew.module.scss";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import HorizontalRule from "../components/HorizontalRule";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import Paragraph from "../components/Paragraph";
import RequireAuthn from "../components/RequireAuthn";
import TagForRecipeNewForm from "../components/TagForRecipeNewForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function TagForRecipeNew() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<string[]>([]);
  const { recipeId } = useParams() as { recipeId: string };
  const { tagsGet } = useApi();

  useEffectOnce(async () => {
    const response = await tagsGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTags(response.data.tags.map((t: { name: string }) => t.name));
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Tag")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Create Tag
          </Breadcrumbs>

          <Heading>Create Tag</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <TagForRecipeNewForm tags={tags} />
          )}

          <HorizontalRule className={classes.horizontalRule} />

          <Paragraph>
            <Anchor to="/dashboard/tags">Manage all tags</Anchor>
          </Paragraph>
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}

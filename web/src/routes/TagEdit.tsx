import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/TagEdit.module.scss";
import Heading from "../components/Heading";
import HorizontalRule from "../components/HorizontalRule";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RecipesForTagList from "../components/RecipesForTagList";
import RequireAuthn from "../components/RequireAuthn";
import TagEditForm from "../components/TagEditForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { TagData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function TagEdit() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [tag, setTag] = useState<TagData>();
  const { tagGet } = useApi();
  const { tagId } = useParams() as { tagId: string };

  useEffectOnce(async () => {
    const response = await tagGet({ tagId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTag(response.data);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Tag")}</title>
      </Helmet>

      <Navbar />

      <PageLayout containerClassName={classes.pageLayout}>
        <Breadcrumbs>
          <Anchor to="/dashboard/tags">Dashboard</Anchor>
          Edit Tag
        </Breadcrumbs>

        <Heading>Edit Tag</Heading>

        {!loading && error && (
          <Alert onDismiss={() => setError(undefined)} variant="error">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <TagEditForm tag={tag} />

            <div className={classes.recipesWrapper}>
              <HorizontalRule />
              <RecipesForTagList tag={tag} />
            </div>
          </>
        )}
      </PageLayout>
    </RequireAuthn>
  );
}

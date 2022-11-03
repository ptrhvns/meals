import Alert from "./Alert";
import Heading from "./Heading";
import PageCenteredSection from "./PageCenteredSection";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import classes from "../styles/components/ErrorPage.module.scss";

export default function ErrorPage() {
  const error = useRouteError();

  if (import.meta.env.DEV) {
    console.error("A route error occurred:", error);
  }

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <Helmet>
          <title>{buildTitle(`Error (${error.status})`)}</title>
        </Helmet>

        <PageCenteredSection>
          <div className={classes.content}>
            <Heading className={classes.title}>Error</Heading>

            <Alert variant="error">
              <div className={classes.errorSection}>
                An unexpected error occured.
              </div>
              <div className={classes.errorSection}>
                <i>
                  {error.statusText} ({error.status})
                </i>
              </div>
              {error.data?.message && (
                <div className={classes.errorSection}>
                  <i>{error.data.message}</i>
                </div>
              )}
            </Alert>
          </div>
        </PageCenteredSection>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{buildTitle("Error")}</title>
      </Helmet>

      <PageCenteredSection>
        <div className={classes.content}>
          <Heading className={classes.title}>Error</Heading>

          <Alert variant="error">
            <p>An unexpected error occured.</p>
          </Alert>
        </div>
      </PageCenteredSection>
    </>
  );
}

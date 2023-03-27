import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Heading from "../components/Heading";
import PageCenteredSection from "../components/PageCenteredSection";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Error")}</title>
      </Helmet>

      <PageCenteredSection>
        <div>
          <Heading>Error</Heading>

          <Alert variant="error">
            An unexpected error occurred. You can start from the{" "}
            <Anchor color="red" to="/">
              home page
            </Anchor>
            , and retry your request.
          </Alert>
        </div>
      </PageCenteredSection>
    </>
  );
}

import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Heading from "../components/Heading";
import PageCenteredCard from "../components/PageCenteredCard";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Not Found (404)")}</title>
      </Helmet>

      <PageCenteredCard>
        <div>
          <Heading>Not Found (404)</Heading>

          <Alert variant="error">
            We coudn&apos;t find the page you requested. Maybe you can find what
            you&apos;re looking for by visiting the{" "}
            <Anchor color="red" to="/">
              home page
            </Anchor>
            .
          </Alert>
        </div>
      </PageCenteredCard>
    </>
  );
}

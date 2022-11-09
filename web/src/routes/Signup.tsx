import Heading from "../components/Heading";
import PageCenteredSection from "../components/PageCenteredSection";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Signup() {
  return (
    <>
      <Helmet>
        <title>{buildTitle("Sign Up")}</title>
      </Helmet>

      <PageCenteredSection>
        <Heading>Sign Up</Heading>
      </PageCenteredSection>
    </>
  );
}

export const signupRouterOpts = {
  element: <Signup />,
};

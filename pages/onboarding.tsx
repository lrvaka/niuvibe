// pages/onboarding.tsx
import { GetServerSideProps } from "next";
import { withNoOnboardingCheck } from "../utils/withNoOnboardingCheck";
import { Field } from "react-final-form";
import Wizard from "@/components/Wizard";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

interface FormValues {
  name: string;
}

const StyledField = (props: any) => {
  return <Field {...props} className="rounded-md p-2" />;
};

const required = (value: any) => (value ? undefined : "Required");

const Error = ({ name }: { name: string }) => (
  <Field
    name={name}
    subscription={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? (
        <span className="text-red-600 text-sm mt-1">{error}</span>
      ) : null
    }
  />
);

export default function OnboardingPage() {
  const { push } = useRouter();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Submitting onboarding form");
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.sub,
          name: values.name,
        }),
      });
      if (res.ok) {
        console.log("Onboarding form submitted successfully");
        push("/");
      } else {
        const errorData = await res.json();
        console.error("Error during onboarding:", errorData);
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  return (
    <Wizard initialValues={{ name: "" }} onSubmit={onSubmit}>
      <Wizard.Page>
        <div className="flex flex-col mind-h-[80px] w-full">
          <label className="text-zinc-900">Name</label>
          <StyledField
            name="name"
            component="input"
            type="text"
            placeholder="Name"
            validate={required}
          />
          <Error name="name" />
        </div>
      </Wizard.Page>
      <Wizard.Page>
        <div className="flex flex-col mind-h-[80px] w-full">
          <label className="text-zinc-900">Name</label>
        </div>
      </Wizard.Page>
    </Wizard>
  );
}

export const getServerSideProps: GetServerSideProps = withNoOnboardingCheck();
